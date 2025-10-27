# BI Dashboard - ML-Powered Business Intelligence

## 📋 Project Overview
This project implements 4 machine learning models for business intelligence:
1. **Customer Segmentation** (K-Means)
2. **Churn Prediction** (XGBoost)
3. **Sales Forecasting** (Prophet)
4. **Product Return Prediction** (Random Forest)

## 🚀 Quick Start

### Prerequisites
```bash
pip install pandas numpy scikit-learn xgboost prophet matplotlib seaborn
```

### Step 1: Train Models
Run this first to train all models on your data:
```bash
python train_models.py
```

This will:
- Process all your CSV datasets
- Train all 4 ML models
- Save trained models to `models/` folder
- Create prediction CSV templates

### Step 2: Make Predictions
After training, run predictions on new data:
```bash
python predict.py
```

This will:
- Load trained models
- Read data from prediction CSV files
- Generate predictions
- Save results back to CSV files

## 📁 File Structure

```
BI_Dashboard/
├── preprocessing.py              # Data loading and feature engineering
├── segmentation_model.py         # Customer segmentation (K-Means)
├── churn_model.py               # Churn prediction (XGBoost)
├── sales_forecast_model.py      # Sales forecasting (Prophet)
├── return_model.py              # Product return prediction (Random Forest)
├── train_models.py              # Main training script
├── predict.py                   # Main prediction script
├── models/                      # Saved trained models (auto-created)
│   ├── segmentation_model.pkl
│   ├── churn_model.pkl
│   ├── sales_forecast_model.pkl
│   └── return_model.pkl
├── Predictions_Customer.csv     # Customer predictions (segment + churn)
├── Predictions_Product.csv      # Product return predictions
└── Predictions_Sales.csv        # Sales forecast
```

## 📊 Prediction CSV Files

### Predictions_Customer.csv
Input features for customer predictions:
- `customer_unique_id`
- `recency`, `frequency`, `monetary` (RFM)
- `avg_review_score`
- `has_left_bad_review`
- `avg_days_between_purchases`
- And more...

Output predictions:
- `predicted_segment` (0-3)
- `predicted_churn` (0 or 1)
- `churn_probability` (0.0-1.0)

### Predictions_Product.csv
Input features for product predictions:
- `price`, `freight_value`
- `product_category_name`
- `product_weight_g`, `product_length_cm`, etc.

Output predictions:
- `predicted_return` (0 or 1)
- `return_probability` (0.0-1.0)

### Predictions_Sales.csv
Sales forecast output:
- `date`
- `predicted_sales`
- `lower_bound`
- `upper_bound`

## 🔧 Usage Examples

### Training Models
```python
from preprocessing import DataPreprocessor
from segmentation_model import CustomerSegmentation

# Preprocess data
preprocessor = DataPreprocessor(data_path='')
data = preprocessor.process_all()

# Train segmentation model
seg_model = CustomerSegmentation(n_clusters=4)
seg_model.train(data['customer_master'])
seg_model.save_model()
```

### Making Predictions
```python
from segmentation_model import CustomerSegmentation
import pandas as pd

# Load model
model = CustomerSegmentation()
model.load_model('models/segmentation_model.pkl')

# Make predictions from CSV
model.predict_from_csv('Predictions_Customer.csv', 'Predictions_Customer.csv')
```

## 📈 Model Details

### 1. Customer Segmentation
- **Algorithm:** K-Means Clustering
- **Features:** RFM + behavioral metrics
- **Output:** 4 customer segments (0-3)

### 2. Churn Prediction
- **Algorithm:** XGBoost
- **Target:** Customers likely to churn in next 30 days
- **Output:** Binary (0/1) + probability

### 3. Sales Forecasting
- **Algorithm:** Facebook Prophet
- **Features:** Historical daily sales
- **Output:** 90-day forecast with confidence intervals

### 4. Product Return Prediction
- **Algorithm:** Random Forest
- **Features:** Product attributes + price
- **Output:** Return likelihood (0/1) + probability

## 🎯 Dataset Requirements

Place these CSV files in the root directory:
- `olist_customers_dataset.csv`
- `olist_orders_dataset.csv`
- `olist_order_items_dataset.csv`
- `olist_order_payments_dataset.csv`
- `olist_order_reviews_dataset.csv`
- `olist_products_dataset.csv`

## 📝 Notes

- First run requires training all models (~5-10 minutes)
- Models are saved and can be reused for predictions
- Prediction CSV files are updated in-place
- All predictions include probability scores for confidence assessment

## 🤝 Contributing

Feel free to extend the models or add new features!

## 📄 License

MIT License
