"""
Customer Segmentation Model using K-Means Clustering
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import pickle
import os


class CustomerSegmentation:
    def __init__(self, n_clusters=4):
        """Initialize the segmentation model"""
        self.n_clusters = n_clusters
        self.scaler = StandardScaler()
        self.model = None
        self.feature_columns = [
            'recency',
            'frequency',
            'monetary',
            'avg_review_score',
            'has_left_bad_review',
            'avg_days_between_purchases'
        ]
        
    def train(self, customer_master_df):
        """Train the K-Means clustering model"""
        print("\n=== Training Customer Segmentation Model ===")
        
        # Select features
        X = customer_master_df[self.feature_columns].copy()
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train K-Means model
        self.model = KMeans(n_clusters=self.n_clusters, random_state=42, n_init=10)
        clusters = self.model.fit_predict(X_scaled)
        
        print(f"Model trained with {self.n_clusters} clusters")
        
        # Add cluster labels to dataframe
        customer_master_df['segment'] = clusters
        
        # Analyze segments
        print("\n=== Segment Analysis ===")
        segment_analysis = customer_master_df.groupby('segment')[self.feature_columns].mean()
        print(segment_analysis.sort_values('monetary', ascending=False))
        
        return customer_master_df
    
    def predict(self, customer_data):
        """Predict segment for new customers"""
        if self.model is None:
            raise ValueError("Model not trained yet. Call train() first.")
        
        # Ensure input is a DataFrame
        if isinstance(customer_data, pd.Series):
            customer_data = customer_data.to_frame().T
        
        # Select and scale features
        X = customer_data[self.feature_columns].copy()
        X_scaled = self.scaler.transform(X)
        
        # Predict segment
        segments = self.model.predict(X_scaled)
        
        return segments
    
    def save_model(self, filepath='models/segmentation_model.pkl'):
        """Save the trained model and scaler"""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        with open(filepath, 'wb') as f:
            pickle.dump({
                'model': self.model,
                'scaler': self.scaler,
                'feature_columns': self.feature_columns,
                'n_clusters': self.n_clusters
            }, f)
        
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath='models/segmentation_model.pkl'):
        """Load a trained model"""
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
            
        self.model = data['model']
        self.scaler = data['scaler']
        self.feature_columns = data['feature_columns']
        self.n_clusters = data['n_clusters']
        
        print(f"Model loaded from {filepath}")
    
    def predict_from_csv(self, input_csv, output_csv):
        """Predict segments for data in CSV and save results"""
        print(f"\n=== Predicting segments from {input_csv} ===")
        
        # Load data
        df = pd.read_csv(input_csv)
        
        # Make predictions
        segments = self.predict(df)
        
        # Add predictions to dataframe
        df['predicted_segment'] = segments
        
        # Save results
        df.to_csv(output_csv, index=False)
        print(f"Predictions saved to {output_csv}")
        
        return df


if __name__ == "__main__":
    # This section will be used for testing
    print("Customer Segmentation Model Module")
    print("Use this module to train and predict customer segments")
