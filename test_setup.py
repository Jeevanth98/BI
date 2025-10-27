"""
Test script to verify the complete workflow
Run this to ensure everything is working correctly
"""

import os
import sys

def check_files():
    """Check if all required files exist"""
    print("="*60)
    print("CHECKING PROJECT FILES")
    print("="*60)
    
    required_files = [
        'preprocessing.py',
        'segmentation_model.py',
        'churn_model.py',
        'sales_forecast_model.py',
        'return_model.py',
        'train_models.py',
        'predict.py',
        'requirements.txt',
        'README.md',
        'QUICKSTART.md',
        'BI_Dashboard.ipynb'
    ]
    
    csv_files = [
        'olist_customers_dataset.csv',
        'olist_orders_dataset.csv',
        'olist_order_items_dataset.csv',
        'olist_order_payments_dataset.csv',
        'olist_order_reviews_dataset.csv',
        'olist_products_dataset.csv'
    ]
    
    print("\n✓ Python Modules:")
    for file in required_files:
        status = "✓" if os.path.exists(file) else "✗"
        print(f"  {status} {file}")
    
    print("\n✓ Data Files:")
    for file in csv_files:
        status = "✓" if os.path.exists(file) else "✗"
        print(f"  {status} {file}")
    
    print("\n" + "="*60)

def check_imports():
    """Check if all required packages can be imported"""
    print("\n" + "="*60)
    print("CHECKING PYTHON PACKAGES")
    print("="*60)
    
    packages = {
        'pandas': 'Data manipulation',
        'numpy': 'Numerical computing',
        'sklearn': 'Machine learning',
        'xgboost': 'XGBoost classifier',
        'prophet': 'Time series forecasting',
        'matplotlib': 'Plotting',
        'seaborn': 'Statistical visualization'
    }
    
    for package, description in packages.items():
        try:
            __import__(package)
            print(f"  ✓ {package:15} - {description}")
        except ImportError:
            print(f"  ✗ {package:15} - {description} [NOT INSTALLED]")
    
    print("\n" + "="*60)

def print_next_steps():
    """Print next steps for the user"""
    print("\n" + "="*60)
    print("NEXT STEPS")
    print("="*60)
    
    print("\n1. Install dependencies (if any are missing):")
    print("   pip install -r requirements.txt")
    
    print("\n2. Train all models:")
    print("   python train_models.py")
    
    print("\n3. Make predictions:")
    print("   python predict.py")
    
    print("\n4. Or use the Jupyter notebook:")
    print("   jupyter notebook BI_Dashboard.ipynb")
    
    print("\n" + "="*60)
    print("For detailed instructions, see QUICKSTART.md")
    print("="*60 + "\n")

if __name__ == "__main__":
    check_files()
    check_imports()
    print_next_steps()
