"""
Prediction Script - Make predictions on new data from CSV files
Run this script to generate predictions using trained models
"""

import warnings
# Suppress Prophet plotly warning for cleaner output
warnings.filterwarnings('ignore', message='Importing plotly failed')

from segmentation_model import CustomerSegmentation
from churn_model import ChurnPredictor
from sales_forecast_model import SalesForecaster
from return_model import ReturnPredictor
import pandas as pd
import os


def predict_customer_data(input_csv='Predictions_Customer.csv', output_csv='Predictions_Customer.csv'):
    """Predict customer segments and churn"""
    print("\nPredicting customer segments and churn...")
    
    # Load data
    df = pd.read_csv(input_csv)
    print(f"  Loaded {len(df)} customer records")
    
    # Load and predict with Segmentation Model
    seg_model = CustomerSegmentation()
    seg_model.load_model('models/segmentation_model.pkl')
    segments = seg_model.predict(df)
    df['predicted_segment'] = segments
    
    # Load and predict with Churn Model
    churn_model = ChurnPredictor()
    churn_model.load_model('models/churn_model.pkl')
    
    # Only predict for customers with all required features
    try:
        churn_pred, churn_proba = churn_model.predict(df)
        df['predicted_churn'] = churn_pred
        df['churn_probability'] = churn_proba
    except Exception as e:
        print(f"  ⚠ Warning: Could not predict churn - {e}")
        df['predicted_churn'] = 'N/A'
        df['churn_probability'] = 'N/A'
    
    # Save results
    df.to_csv(output_csv, index=False)
    print(f"  ✓ Customer predictions saved to {output_csv}")
    
    return df


def predict_product_returns(input_csv='Predictions_Product.csv', output_csv='Predictions_Product.csv'):
    """Predict product return likelihood"""
    print("\nPredicting product returns...")
    
    # Load data
    df = pd.read_csv(input_csv)
    print(f"  Loaded {len(df)} product records")
    
    # Load and predict with Return Model
    return_model = ReturnPredictor()
    return_model.load_model('models/return_model.pkl')
    
    return_pred, return_proba = return_model.predict(df)
    df['predicted_return'] = return_pred
    df['return_probability'] = return_proba
    
    # Save results
    df.to_csv(output_csv, index=False)
    print(f"  ✓ Product predictions saved to {output_csv}")
    
    return df


def predict_sales_forecast(output_csv='Predictions_Sales.csv', periods=90):
    """Generate sales forecast"""
    print(f"\nGenerating {periods}-day sales forecast...")
    
    # Load model
    sales_model = SalesForecaster()
    sales_model.load_model('models/sales_forecast_model.pkl')
    
    # Generate forecast
    forecast = sales_model.forecast_to_csv(output_csv, periods=periods)
    
    print(f"  ✓ Sales forecast saved to {output_csv}")
    
    return forecast


def prepare_powerbi_data(customer_df, product_df, sales_df):
    """Prepare and save data for Power BI dashboard"""
    print("\nPreparing dashboard data...")
    
    # Create PowerBI_Data folder if it doesn't exist
    powerbi_folder = 'website/PowerBI_Data'
    if not os.path.exists(powerbi_folder):
        os.makedirs(powerbi_folder)
    
    # 1. Customer Analysis for Dashboard
    customer_summary = customer_df.copy()
    customer_summary['churn_risk_level'] = pd.cut(
        customer_summary['churn_probability'], 
        bins=[0, 0.3, 0.7, 1.0], 
        labels=['Low Risk', 'Medium Risk', 'High Risk']
    )
    customer_summary['segment_name'] = customer_summary['predicted_segment'].map({
        0: 'Inactive Customers',
        1: 'Unhappy Customers',
        2: 'Recent Buyers',
        3: 'VIP Customers'
    })
    customer_summary.to_csv(f'{powerbi_folder}/Customer_Analysis.csv', index=False)
    
    # 2. Product Analysis for Dashboard
    product_summary = product_df.copy()
    product_summary['return_risk_level'] = pd.cut(
        product_summary['return_probability'], 
        bins=[0, 0.3, 0.7, 1.0], 
        labels=['Low Risk', 'Medium Risk', 'High Risk']
    )
    product_summary.to_csv(f'{powerbi_folder}/Product_Analysis.csv', index=False)
    
    # 3. Sales Forecast for Dashboard
    sales_summary = sales_df.copy()
    sales_summary['date'] = pd.to_datetime(sales_summary['date'])
    sales_summary['year'] = sales_summary['date'].dt.year
    sales_summary['month'] = sales_summary['date'].dt.month
    sales_summary['month_name'] = sales_summary['date'].dt.strftime('%B')
    sales_summary['day_of_week'] = sales_summary['date'].dt.day_name()
    sales_summary['week_number'] = sales_summary['date'].dt.isocalendar().week
    sales_summary.to_csv(f'{powerbi_folder}/Sales_Forecast.csv', index=False)
    
    # 4. Create KPI Metrics
    kpi_metrics = pd.DataFrame({
        'Metric': [
            'Total Customers',
            'Customers at Risk',
            'Churn Rate',
            'Avg Churn Probability',
            'Total Products',
            'Products with Return Risk',
            'Return Rate',
            'Avg Return Probability',
            'Total Forecasted Sales (90d)',
            'Avg Daily Sales',
            'Peak Daily Sales',
            'Low Risk Customers',
            'Medium Risk Customers',
            'High Risk Customers'
        ],
        'Value': [
            len(customer_df),
            int(customer_df['predicted_churn'].sum()),
            f"{(customer_df['predicted_churn'].sum() / len(customer_df) * 100):.1f}%",
            f"{customer_df['churn_probability'].mean():.2%}",
            len(product_df),
            int(product_df['predicted_return'].sum()),
            f"{(product_df['predicted_return'].sum() / len(product_df) * 100):.1f}%",
            f"{product_df['return_probability'].mean():.2%}",
            f"${sales_df['predicted_sales'].sum():,.2f}",
            f"${sales_df['predicted_sales'].mean():,.2f}",
            f"${sales_df['predicted_sales'].max():,.2f}",
            int((customer_summary['churn_risk_level'] == 'Low Risk').sum()),
            int((customer_summary['churn_risk_level'] == 'Medium Risk').sum()),
            int((customer_summary['churn_risk_level'] == 'High Risk').sum())
        ]
    })
    kpi_metrics.to_csv(f'{powerbi_folder}/KPI_Metrics.csv', index=False)
    
    # 5. Segment Distribution
    segment_dist = customer_summary.groupby(['segment_name', 'predicted_segment']).size().reset_index(name='count')
    segment_dist.to_csv(f'{powerbi_folder}/Segment_Distribution.csv', index=False)
    
    # 6. Category Analysis
    category_analysis = product_summary.groupby('product_category_name').agg({
        'return_probability': 'mean',
        'predicted_return': 'sum',
        'price': 'mean'
    }).reset_index()
    category_analysis.columns = ['Category', 'Avg_Return_Probability', 'Total_Returns', 'Avg_Price']
    category_analysis = category_analysis.sort_values('Avg_Return_Probability', ascending=False)
    category_analysis.to_csv(f'{powerbi_folder}/Category_Analysis.csv', index=False)
    
    print(f"  ✓ Dashboard data saved to {powerbi_folder}/")


def main():
    """Run all prediction models"""
    print("\n" + "="*60)
    print("BI DASHBOARD - PREDICTION PIPELINE")
    print("="*60)
    
    # Check if models exist
    if not os.path.exists('models'):
        print("\n❌ ERROR: No trained models found!")
        print("Please run 'train_models.py' first to train the models.")
        return
    
    # Run predictions
    try:
        # 1. Customer predictions
        customer_df = predict_customer_data()
        
        # 2. Product return predictions
        product_df = predict_product_returns()
        
        # 3. Sales forecast
        sales_df = predict_sales_forecast()
        
        # 4. Prepare data for Power BI Dashboard
        prepare_powerbi_data(customer_df, product_df, sales_df)
        
        # Summary
        print("\n" + "="*60)
        print("✅ PREDICTION COMPLETE")
        print("="*60)
        print(f"\n{len(customer_df)} customers analyzed | {len(product_df)} products analyzed | {len(sales_df)}-day forecast generated")
        print(f"\nAll predictions saved to:")
        print(f"  • Root directory (Predictions_*.csv)")
        print(f"  • Dashboard folder (website/PowerBI_Data/*.csv)")
        print(f"\n💡 Refresh your browser to see updated dashboard!")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        print("Please ensure all required CSV files exist and models are trained.")


if __name__ == "__main__":
    main()
