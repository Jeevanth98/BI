"""
Sales Forecasting Model using Facebook Prophet
"""

import pandas as pd
import numpy as np
import warnings
import os
import pickle

# Suppress Prophet plotly warning
warnings.filterwarnings('ignore')
import logging
logging.getLogger('prophet').setLevel(logging.ERROR)

from prophet import Prophet


class SalesForecaster:
    def __init__(self):
        """Initialize the sales forecasting model"""
        self.model = None
        
    def train(self, sales_data):
        """Train the Prophet forecasting model"""
        print("\n=== Training Sales Forecasting Model ===")
        
        # Prophet requires columns named 'ds' and 'y'
        if 'ds' not in sales_data.columns or 'y' not in sales_data.columns:
            raise ValueError("Sales data must have 'ds' (date) and 'y' (value) columns")
        
        # Initialize and train Prophet model
        self.model = Prophet()
        self.model.fit(sales_data)
        
        print("Sales forecasting model trained successfully!")
        return self.model
    
    def predict(self, periods=90):
        """Forecast sales for the next N periods (days)"""
        if self.model is None:
            raise ValueError("Model not trained yet. Call train() first.")
        
        # Create future dataframe
        future = self.model.make_future_dataframe(periods=periods)
        
        # Make forecast
        forecast = self.model.predict(future)
        
        return forecast
    
    def save_model(self, filepath='models/sales_forecast_model.pkl'):
        """Save the trained model"""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        with open(filepath, 'wb') as f:
            pickle.dump({'model': self.model}, f)
        
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath='models/sales_forecast_model.pkl'):
        """Load a trained model"""
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
            
        self.model = data['model']
        
        print(f"Model loaded from {filepath}")
    
    def forecast_to_csv(self, output_csv, periods=90):
        """Generate forecast and save to CSV"""
        # Generate forecast
        forecast = self.predict(periods)
        
        # Select relevant columns
        forecast_summary = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods)
        forecast_summary.rename(columns={
            'ds': 'date',
            'yhat': 'predicted_sales',
            'yhat_lower': 'lower_bound',
            'yhat_upper': 'upper_bound'
        }, inplace=True)
        
        # Save to CSV
        forecast_summary.to_csv(output_csv, index=False)
        
        return forecast_summary
    
    def predict_specific_dates(self, dates_csv, output_csv):
        """Predict sales for specific dates from CSV"""
        print(f"\n=== Predicting sales for dates in {dates_csv} ===")
        
        # Load dates
        dates_df = pd.read_csv(dates_csv)
        
        if 'date' not in dates_df.columns:
            raise ValueError("Input CSV must have a 'date' column")
        
        # Rename for Prophet
        dates_df.rename(columns={'date': 'ds'}, inplace=True)
        dates_df['ds'] = pd.to_datetime(dates_df['ds'])
        
        # Make predictions
        forecast = self.model.predict(dates_df)
        
        # Extract results
        results = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].copy()
        results.rename(columns={
            'ds': 'date',
            'yhat': 'predicted_sales',
            'yhat_lower': 'lower_bound',
            'yhat_upper': 'upper_bound'
        }, inplace=True)
        
        # Save results
        results.to_csv(output_csv, index=False)
        print(f"Predictions saved to {output_csv}")
        
        return results


if __name__ == "__main__":
    # This section will be used for testing
    print("Sales Forecasting Model Module")
    print("Use this module to train and forecast sales")
