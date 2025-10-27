"""
Main Training Script - Train all models and save them
Run this script first to train all models on your data
"""

from preprocessing import DataPreprocessor
from segmentation_model import CustomerSegmentation
from churn_model import ChurnPredictor
from sales_forecast_model import SalesForecaster
from return_model import ReturnPredictor
import pandas as pd


def main():
    print("="*60)
    print("BI DASHBOARD - MODEL TRAINING PIPELINE")
    print("="*60)
    
    # Step 1: Preprocess Data
    print("\n[STEP 1] Running Data Preprocessing...")
    preprocessor = DataPreprocessor(data_path='')
    data = preprocessor.process_all()
    
    # Step 2: Train Customer Segmentation Model
    print("\n[STEP 2] Training Customer Segmentation Model...")
    seg_model = CustomerSegmentation(n_clusters=4)
    customer_data = seg_model.train(data['customer_master'])
    seg_model.save_model()
    
    # Step 3: Train Churn Prediction Model
    print("\n[STEP 3] Training Churn Prediction Model...")
    churn_model = ChurnPredictor()
    churn_model.train(data['customer_master'])
    churn_model.save_model()
    
    # Step 4: Train Sales Forecasting Model
    print("\n[STEP 4] Training Sales Forecasting Model...")
    sales_model = SalesForecaster()
    sales_model.train(data['sales_data'])
    sales_model.save_model()
    
    # Step 5: Train Product Return Prediction Model
    print("\n[STEP 5] Training Product Return Prediction Model...")
    return_model = ReturnPredictor()
    return_model.train(data['return_data'])
    return_model.save_model()
    
    print("\n" + "="*60)
    print("ALL MODELS TRAINED AND SAVED SUCCESSFULLY!")
    print("="*60)
    
    # Step 6: Create sample prediction CSV templates
    print("\n[STEP 6] Creating Prediction CSV Templates...")
    create_prediction_templates(customer_data, data['return_data'])
    
    print("\n✓ Training pipeline complete!")
    print("\nNext steps:")
    print("1. Check the 'models/' folder for trained models")
    print("2. Use 'Predictions.csv' to make predictions")
    print("3. Run 'predict.py' to generate predictions")


def create_prediction_templates(customer_data, return_data):
    """Create CSV templates for predictions"""
    
    # 1. Customer Predictions Template (for segmentation and churn)
    customer_template = customer_data[[
        'customer_unique_id',
        'recency',
        'frequency',
        'monetary',
        'avg_review_score',
        'has_left_bad_review',
        'avg_days_between_purchases',
        'avg_delivery_time',
        'avg_delivery_lateness',
        'avg_approval_hours',
        'number_of_low_reviews',
        'std_dev_days_between_purchases',
        'frequency_last_90_days',
        'monetary_last_90_days',
        'freq_ratio_90d_alltime'
    ]].head(100).copy()
    
    # Add empty prediction columns
    customer_template['predicted_segment'] = ''
    customer_template['predicted_churn'] = ''
    customer_template['churn_probability'] = ''
    
    customer_template.to_csv('Predictions_Customer.csv', index=False)
    print("✓ Created 'Predictions_Customer.csv' (100 samples)")
    
    # 2. Product Return Predictions Template
    product_template = return_data[[
        'price',
        'freight_value',
        'product_category_name',
        'product_name_lenght',
        'product_description_lenght',
        'product_photos_qty',
        'product_weight_g',
        'product_length_cm',
        'product_height_cm',
        'product_width_cm'
    ]].head(100).copy()
    
    # Add empty prediction columns
    product_template['predicted_return'] = ''
    product_template['return_probability'] = ''
    
    product_template.to_csv('Predictions_Product.csv', index=False)
    print("✓ Created 'Predictions_Product.csv' (100 samples)")
    
    # 3. Sales Forecast Template
    import pandas as pd
    from datetime import datetime, timedelta
    
    # Create future dates for forecasting
    start_date = datetime.now()
    dates = [start_date + timedelta(days=i) for i in range(90)]
    
    sales_template = pd.DataFrame({
        'date': dates,
        'predicted_sales': '',
        'lower_bound': '',
        'upper_bound': ''
    })
    
    sales_template.to_csv('Predictions_Sales.csv', index=False)
    print("✓ Created 'Predictions_Sales.csv' (90 days forecast)")
    
    print("\nPrediction templates created successfully!")


if __name__ == "__main__":
    main()
