"""
Data Preprocessing Module for BI Dashboard
Handles data loading, cleaning, and feature engineering
"""

import pandas as pd
import numpy as np
from datetime import datetime


class DataPreprocessor:
    def __init__(self, data_path=''):
        """Initialize the preprocessor with data path"""
        self.data_path = data_path
        self.df = None
        self.customer_master_df = None
        self.CHURN_THRESHOLD_DAYS = 180
        self.analysis_date = None
        
    def load_data(self):
        """Load all CSV files and merge them"""
        print("Loading datasets...")
        
        # Load the core CSV files
        customers = pd.read_csv(f'{self.data_path}olist_customers_dataset.csv')
        orders = pd.read_csv(f'{self.data_path}olist_orders_dataset.csv')
        order_items = pd.read_csv(f'{self.data_path}olist_order_items_dataset.csv')
        order_payments = pd.read_csv(f'{self.data_path}olist_order_payments_dataset.csv')
        order_reviews = pd.read_csv(f'{self.data_path}olist_order_reviews_dataset.csv')
        products = pd.read_csv(f'{self.data_path}olist_products_dataset.csv')
        
        # Merge into a single transaction-level dataframe
        self.df = orders.merge(customers, on='customer_id')
        self.df = self.df.merge(order_payments, on='order_id')
        self.df = self.df.merge(order_reviews, on='order_id')
        self.df = self.df.merge(order_items, on='order_id')
        self.df = self.df.merge(products, on='product_id')
        
        print(f"Data loaded successfully! Shape: {self.df.shape}")
        return self.df
    
    def clean_data(self):
        """Handle missing values and convert data types"""
        print("\nCleaning data...")
        
        # Fill missing product categories
        self.df['product_category_name'] = self.df['product_category_name'].fillna('Unknown')
        
        # Fill missing product weight with median
        median_weight = self.df['product_weight_g'].median()
        self.df['product_weight_g'] = self.df['product_weight_g'].fillna(median_weight)
        
        # Drop columns with too many missing values
        self.df = self.df.drop(columns=['review_comment_title', 'review_comment_message'], errors='ignore')
        
        # Convert date columns
        date_columns = [
            'order_purchase_timestamp', 'order_approved_at', 'order_delivered_carrier_date',
            'order_delivered_customer_date', 'order_estimated_delivery_date',
            'review_creation_date', 'review_answer_timestamp', 'shipping_limit_date'
        ]
        
        for col in date_columns:
            self.df[col] = pd.to_datetime(self.df[col], errors='coerce')
        
        # Fill remaining product-related numerical columns
        cols_to_fill = [
            'product_name_lenght', 'product_description_lenght', 'product_photos_qty',
            'product_length_cm', 'product_height_cm', 'product_width_cm'
        ]
        
        for col in cols_to_fill:
            median_val = self.df[col].median()
            self.df[col] = self.df[col].fillna(median_val)
        
        print("Data cleaning complete!")
        return self.df
    
    def engineer_features(self):
        """Create advanced features for modeling"""
        print("\nEngineering features...")
        
        # Calculate delivery and approval metrics
        self.df['delivery_time_days'] = (
            self.df['order_delivered_customer_date'] - self.df['order_purchase_timestamp']
        ).dt.days
        
        self.df['delivery_lateness_days'] = (
            self.df['order_delivered_customer_date'] - self.df['order_estimated_delivery_date']
        ).dt.days
        
        self.df['approval_time_hours'] = (
            self.df['order_approved_at'] - self.df['order_purchase_timestamp']
        ).dt.total_seconds() / 3600
        
        print("Feature engineering complete!")
        return self.df
    
    def create_customer_master(self):
        """Create customer-level aggregated dataframe"""
        print("\nCreating customer master dataframe...")
        
        # Set analysis date
        self.analysis_date = self.df['order_purchase_timestamp'].max() + pd.DateOffset(days=1)
        
        # Create feedback features
        feedback_features = self.df.groupby('customer_unique_id').agg(
            number_of_low_reviews=('review_score', lambda s: (s <= 2).sum())
        ).reset_index()
        feedback_features['has_left_bad_review'] = (
            feedback_features['number_of_low_reviews'] > 0
        ).astype(int)
        
        # Calculate purchase cadence
        purchase_cadence = self.df.groupby('customer_unique_id').apply(
            lambda x: x.sort_values('order_purchase_timestamp')['order_purchase_timestamp'].diff().dt.days
        ).reset_index(name='days_between_purchases')
        
        cadence_stats = purchase_cadence.groupby('customer_unique_id')['days_between_purchases'].agg(
            ['mean', 'std']
        ).reset_index()
        cadence_stats.rename(
            columns={'mean': 'avg_days_between_purchases', 'std': 'std_dev_days_between_purchases'}, 
            inplace=True
        )
        
        # Recent behavior (last 90 days)
        recent_window_start = self.analysis_date - pd.DateOffset(days=90)
        recent_df = self.df[self.df['order_purchase_timestamp'] >= recent_window_start]
        
        recent_behavior = recent_df.groupby('customer_unique_id').agg(
            frequency_last_90_days=('order_id', 'nunique'),
            monetary_last_90_days=('payment_value', 'sum')
        ).reset_index()
        
        # Create master dataframe with all features
        self.customer_master_df = self.df.groupby('customer_unique_id').agg(
            recency=('order_purchase_timestamp', lambda date: (self.analysis_date - date.max()).days),
            frequency=('order_id', 'nunique'),
            monetary=('payment_value', 'sum'),
            avg_review_score=('review_score', 'mean'),
            avg_delivery_time=('delivery_time_days', 'mean'),
            avg_delivery_lateness=('delivery_lateness_days', 'mean'),
            avg_approval_hours=('approval_time_hours', 'mean')
        ).reset_index()
        
        # Merge all features
        self.customer_master_df = self.customer_master_df.merge(
            feedback_features, on='customer_unique_id', how='left'
        )
        self.customer_master_df = self.customer_master_df.merge(
            cadence_stats, on='customer_unique_id', how='left'
        )
        self.customer_master_df = self.customer_master_df.merge(
            recent_behavior, on='customer_unique_id', how='left'
        )
        
        # Fill NaNs
        self.customer_master_df.fillna(0, inplace=True)
        
        # Create frequency ratio
        self.customer_master_df['freq_ratio_90d_alltime'] = (
            self.customer_master_df['frequency_last_90_days'] / 
            (self.customer_master_df['frequency'] + 1)
        )
        
        # Create churn label
        self.customer_master_df['churn'] = (
            self.customer_master_df['recency'] > self.CHURN_THRESHOLD_DAYS
        ).astype(int)
        
        print(f"Customer master dataframe created! Shape: {self.customer_master_df.shape}")
        return self.customer_master_df
    
    def get_transaction_data(self):
        """Return transaction-level data for sales forecasting"""
        sales_df = self.df[['order_purchase_timestamp', 'payment_value']].copy()
        sales_df.rename(columns={'order_purchase_timestamp': 'ds', 'payment_value': 'y'}, inplace=True)
        daily_sales_df = sales_df.set_index('ds').resample('D').sum().reset_index()
        return daily_sales_df
    
    def get_product_return_data(self):
        """Prepare data for product return prediction"""
        feature_columns = [
            'review_score', 'price', 'freight_value', 'product_category_name',
            'product_name_lenght', 'product_description_lenght', 'product_photos_qty',
            'product_weight_g', 'product_length_cm', 'product_height_cm', 'product_width_cm'
        ]
        
        return_df = self.df[feature_columns].copy()
        return_df.dropna(inplace=True)
        return_df['is_likely_return'] = (return_df['review_score'] <= 2).astype(int)
        return_df = return_df.drop(columns=['review_score'])
        
        return return_df
    
    def process_all(self):
        """Run the complete preprocessing pipeline"""
        self.load_data()
        self.clean_data()
        self.engineer_features()
        self.create_customer_master()
        
        return {
            'transaction_data': self.df,
            'customer_master': self.customer_master_df,
            'sales_data': self.get_transaction_data(),
            'return_data': self.get_product_return_data()
        }


if __name__ == "__main__":
    # Test the preprocessor
    preprocessor = DataPreprocessor(data_path='')
    data = preprocessor.process_all()
    
    print("\n=== Preprocessing Complete ===")
    print(f"Transaction data shape: {data['transaction_data'].shape}")
    print(f"Customer master shape: {data['customer_master'].shape}")
    print(f"Sales data shape: {data['sales_data'].shape}")
    print(f"Return data shape: {data['return_data'].shape}")
