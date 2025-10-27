"""
Prediction Script - Make predictions on new data from CSV files
Run this script to generate predictions using trained models
"""

from segmentation_model import CustomerSegmentation
from churn_model import ChurnPredictor
from sales_forecast_model import SalesForecaster
from return_model import ReturnPredictor
import pandas as pd
import os


def predict_customer_data(input_csv='Predictions_Customer.csv', output_csv='Predictions_Customer.csv'):
    """Predict customer segments and churn"""
    print("\n" + "="*60)
    print("CUSTOMER PREDICTIONS (Segmentation + Churn)")
    print("="*60)
    
    # Load data
    df = pd.read_csv(input_csv)
    print(f"Loaded {len(df)} customer records from {input_csv}")
    
    # Load and predict with Segmentation Model
    print("\n[1/2] Predicting Customer Segments...")
    seg_model = CustomerSegmentation()
    seg_model.load_model('models/segmentation_model.pkl')
    segments = seg_model.predict(df)
    df['predicted_segment'] = segments
    print(f"✓ Segments predicted: {pd.Series(segments).value_counts().to_dict()}")
    
    # Load and predict with Churn Model
    print("\n[2/2] Predicting Customer Churn...")
    churn_model = ChurnPredictor()
    churn_model.load_model('models/churn_model.pkl')
    
    # Only predict for customers with all required features
    try:
        churn_pred, churn_proba = churn_model.predict(df)
        df['predicted_churn'] = churn_pred
        df['churn_probability'] = churn_proba
        print(f"✓ Churn predicted: {pd.Series(churn_pred).value_counts().to_dict()}")
    except Exception as e:
        print(f"⚠ Warning: Could not predict churn - {e}")
        df['predicted_churn'] = 'N/A'
        df['churn_probability'] = 'N/A'
    
    # Save results
    df.to_csv(output_csv, index=False)
    print(f"\n✓ Customer predictions saved to {output_csv}")
    
    return df


def predict_product_returns(input_csv='Predictions_Product.csv', output_csv='Predictions_Product.csv'):
    """Predict product return likelihood"""
    print("\n" + "="*60)
    print("PRODUCT RETURN PREDICTIONS")
    print("="*60)
    
    # Load data
    df = pd.read_csv(input_csv)
    print(f"Loaded {len(df)} product records from {input_csv}")
    
    # Load and predict with Return Model
    print("\nPredicting Product Returns...")
    return_model = ReturnPredictor()
    return_model.load_model('models/return_model.pkl')
    
    return_pred, return_proba = return_model.predict(df)
    df['predicted_return'] = return_pred
    df['return_probability'] = return_proba
    
    print(f"✓ Returns predicted: {pd.Series(return_pred).value_counts().to_dict()}")
    print(f"  Average return probability: {return_proba.mean():.2%}")
    
    # Save results
    df.to_csv(output_csv, index=False)
    print(f"\n✓ Product predictions saved to {output_csv}")
    
    return df


def predict_sales_forecast(output_csv='Predictions_Sales.csv', periods=90):
    """Generate sales forecast"""
    print("\n" + "="*60)
    print(f"SALES FORECAST ({periods} days)")
    print("="*60)
    
    # Load model
    print("\nGenerating Sales Forecast...")
    sales_model = SalesForecaster()
    sales_model.load_model('models/sales_forecast_model.pkl')
    
    # Generate forecast
    forecast = sales_model.forecast_to_csv(output_csv, periods=periods)
    
    print(f"\n✓ Sales forecast generated:")
    print(f"  Total predicted sales: ${forecast['predicted_sales'].sum():,.2f}")
    print(f"  Average daily sales: ${forecast['predicted_sales'].mean():,.2f}")
    
    return forecast


def main():
    """Run all prediction models"""
    print("="*60)
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
        
        # Summary
        print("\n" + "="*60)
        print("ALL PREDICTIONS COMPLETED SUCCESSFULLY!")
        print("="*60)
        print("\nGenerated files:")
        print(f"  ✓ Predictions_Customer.csv ({len(customer_df)} records)")
        print(f"  ✓ Predictions_Product.csv ({len(product_df)} records)")
        print(f"  ✓ Predictions_Sales.csv ({len(sales_df)} records)")
        
        print("\n🎉 Prediction pipeline complete!")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        print("Please ensure all required CSV files exist and models are trained.")


if __name__ == "__main__":
    main()
