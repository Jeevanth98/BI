# 🚀 Quick Start Guide - BI Dashboard

## What I've Created for You

I've restructured your Jupyter notebook into a **modular, production-ready system** with:

### ✅ **5 Python Files** (One for each component):
1. **`preprocessing.py`** - Data loading, cleaning, and feature engineering
2. **`segmentation_model.py`** - Customer Segmentation (K-Means)
3. **`churn_model.py`** - Churn Prediction (XGBoost)
4. **`sales_forecast_model.py`** - Sales Forecasting (Prophet)
5. **`return_model.py`** - Product Return Prediction (Random Forest)

### ✅ **2 Main Scripts**:
- **`train_models.py`** - Trains all models and creates prediction CSV templates
- **`predict.py`** - Makes predictions on new data and saves to CSV

### ✅ **New Jupyter Notebook**:
- **`BI_Dashboard.ipynb`** - Clean, streamlined notebook using the modules

### ✅ **Prediction CSV Files** (Auto-generated):
- **`Predictions_Customer.csv`** - Customer segment + churn predictions
- **`Predictions_Product.csv`** - Product return predictions
- **`Predictions_Sales.csv`** - 90-day sales forecast

---

## 📖 How to Use

### **Option 1: Run Python Scripts (Recommended for Production)**

#### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

#### Step 2: Train All Models
```bash
python train_models.py
```
This will:
- Process all your CSV datasets
- Train all 4 ML models
- Save models to `models/` folder
- Create prediction CSV templates

#### Step 3: Make Predictions
```bash
python predict.py
```
This will:
- Load trained models
- Read data from prediction CSV files
- Generate predictions
- Save results back to CSV files

### **Option 2: Run Jupyter Notebook**

1. Open `BI_Dashboard.ipynb`
2. Run all cells sequentially
3. The notebook will:
   - Import the modular Python files
   - Train all models
   - Create prediction CSVs
   - Make predictions
   - Show visualizations

---

## 📊 How the Prediction CSV Workflow Works

### **Training Phase** (`train_models.py`):
1. Loads and preprocesses raw data
2. Trains all 4 models
3. Saves trained models to `models/` folder
4. Creates **template CSV files** with 100 sample records:
   - `Predictions_Customer.csv` (empty prediction columns)
   - `Predictions_Product.csv` (empty prediction columns)
   - `Predictions_Sales.csv` (future dates only)

### **Prediction Phase** (`predict.py`):
1. Loads trained models from `models/` folder
2. Reads data from prediction CSV files
3. Makes predictions using the models
4. **Overwrites the same CSV files** with predictions added
5. Now the CSV files contain both input features AND predictions!

### **CSV Structure**:

**Predictions_Customer.csv** (Before prediction):
```csv
customer_unique_id,recency,frequency,monetary,...,predicted_segment,predicted_churn,churn_probability
cust_001,45,3,250.50,...,,,
cust_002,120,1,80.00,...,,,
```

**Predictions_Customer.csv** (After prediction):
```csv
customer_unique_id,recency,frequency,monetary,...,predicted_segment,predicted_churn,churn_probability
cust_001,45,3,250.50,...,2,0,0.15
cust_002,120,1,80.00,...,0,1,0.78
```

---

## 🎯 Use Cases

### **Scenario 1: Predict for New Customers**
1. Open `Predictions_Customer.csv`
2. Add new customer rows with their features
3. Leave prediction columns empty
4. Run: `python predict.py`
5. Check the CSV - predictions are now filled in!

### **Scenario 2: Monthly Batch Predictions**
1. Export customer data from your database
2. Format it to match `Predictions_Customer.csv` structure
3. Replace the CSV file
4. Run: `python predict.py`
5. Import the results back to your database

### **Scenario 3: API Integration**
```python
from segmentation_model import CustomerSegmentation

# Load model
model = CustomerSegmentation()
model.load_model('models/segmentation_model.pkl')

# Predict for single customer
customer_features = {...}  # Your customer data
segment = model.predict(customer_features)
```

---

## 📁 Project Structure

```
BI_Dashboard/
├── preprocessing.py              # Data preprocessing module
├── segmentation_model.py         # Customer segmentation
├── churn_model.py               # Churn prediction
├── sales_forecast_model.py      # Sales forecasting
├── return_model.py              # Product return prediction
├── train_models.py              # Main training script
├── predict.py                   # Main prediction script
├── BI_Dashboard.ipynb           # New streamlined notebook
├── Bi (3).ipynb                # Your original notebook (preserved)
├── requirements.txt             # Python dependencies
├── README.md                    # Detailed documentation
├── QUICKSTART.md               # This file
├── models/                     # Trained models (auto-created)
│   ├── segmentation_model.pkl
│   ├── churn_model.pkl
│   ├── sales_forecast_model.pkl
│   └── return_model.pkl
├── Predictions_Customer.csv    # Customer predictions
├── Predictions_Product.csv     # Product predictions
└── Predictions_Sales.csv       # Sales forecast
```

---

## 🔄 Workflow Diagram

```
┌─────────────────┐
│  Raw CSV Data   │
│  (Olist files)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ preprocessing.py│
│ (Clean & Build) │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     train_models.py                 │
│  ┌──────────────────────────────┐  │
│  │ 1. Segmentation Model        │  │
│  │ 2. Churn Model               │  │
│  │ 3. Sales Forecast Model      │  │
│  │ 4. Return Model              │  │
│  └──────────────────────────────┘  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  models/ folder │
│  (Saved models) │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Create Prediction CSVs         │
│  (Template with sample data)    │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Add Your Test Data             │
│  (Edit CSV files)               │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│     predict.py                  │
│  (Load models & predict)        │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Updated Prediction CSVs        │
│  (With predictions added!)      │
└─────────────────────────────────┘
```

---

## 💡 Key Features

✅ **Modular Design** - Each model is independent  
✅ **Reusable Models** - Train once, predict many times  
✅ **CSV-Based** - Easy to integrate with any system  
✅ **Production Ready** - Clean, documented code  
✅ **Flexible** - Can be used via scripts, notebook, or API  

---

## 🎓 Next Steps

1. **Run the training** to create your models
2. **Test predictions** with the sample CSV files
3. **Integrate** into your workflow (dashboard, API, etc.)
4. **Schedule** batch predictions for regular updates

---

## ❓ FAQ

**Q: Do I need to retrain models every time I predict?**  
A: No! Train once with `train_models.py`, then use `predict.py` unlimited times.

**Q: Can I add more data to the CSV files?**  
A: Yes! Just add rows with the same column structure. Empty prediction columns will be filled.

**Q: How do I use this in a web dashboard?**  
A: Load the models in your web app and call the `predict()` methods directly.

**Q: What if my data structure is different?**  
A: Modify `preprocessing.py` to match your data format, then retrain.

---

## 🎉 You're All Set!

Your BI Dashboard is now fully modularized and ready for production use!

Run `python train_models.py` to get started! 🚀
