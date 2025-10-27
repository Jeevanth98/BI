"""
Summary Statistics and Data Preparation for Power BI Visualization
This script prepares prediction data for Power BI dashboards
"""

import pandas as pd
import os

def prepare_powerbi_datasets():
    """Prepare optimized datasets for Power BI visualization"""
    
    print("\n" + "="*70)
    print("PREPARING DATA FOR POWER BI")
    print("="*70)
    
    # Load prediction data
    customer_df = pd.read_csv('Predictions_Customer.csv')
    product_df = pd.read_csv('Predictions_Product.csv')
    sales_df = pd.read_csv('Predictions_Sales.csv')
    
    # Create PowerBI folder if it doesn't exist
    powerbi_folder = 'PowerBI_Data'
    if not os.path.exists(powerbi_folder):
        os.makedirs(powerbi_folder)
    
    # 1. Customer Summary for Power BI
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
    print(f"✓ Created {powerbi_folder}/Customer_Analysis.csv")
    
    # 2. Product Summary for Power BI
    product_summary = product_df.copy()
    product_summary['return_risk_level'] = pd.cut(
        product_summary['return_probability'], 
        bins=[0, 0.3, 0.7, 1.0], 
        labels=['Low Risk', 'Medium Risk', 'High Risk']
    )
    product_summary.to_csv(f'{powerbi_folder}/Product_Analysis.csv', index=False)
    print(f"✓ Created {powerbi_folder}/Product_Analysis.csv")
    
    # 3. Sales Forecast for Power BI
    sales_summary = sales_df.copy()
    sales_summary['date'] = pd.to_datetime(sales_summary['date'])
    sales_summary['year'] = sales_summary['date'].dt.year
    sales_summary['month'] = sales_summary['date'].dt.month
    sales_summary['month_name'] = sales_summary['date'].dt.strftime('%B')
    sales_summary['day_of_week'] = sales_summary['date'].dt.day_name()
    sales_summary['week_number'] = sales_summary['date'].dt.isocalendar().week
    sales_summary.to_csv(f'{powerbi_folder}/Sales_Forecast.csv', index=False)
    print(f"✓ Created {powerbi_folder}/Sales_Forecast.csv")
    
    # 4. Create aggregated metrics for KPIs
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
    print(f"✓ Created {powerbi_folder}/KPI_Metrics.csv")
    
    # 5. Segment distribution for charts
    segment_dist = customer_summary.groupby(['segment_name', 'predicted_segment']).size().reset_index(name='count')
    segment_dist.to_csv(f'{powerbi_folder}/Segment_Distribution.csv', index=False)
    print(f"✓ Created {powerbi_folder}/Segment_Distribution.csv")
    
    # 6. Product category analysis
    category_analysis = product_summary.groupby('product_category_name').agg({
        'return_probability': 'mean',
        'predicted_return': 'sum',
        'price': 'mean'
    }).reset_index()
    category_analysis.columns = ['Category', 'Avg_Return_Probability', 'Total_Returns', 'Avg_Price']
    category_analysis = category_analysis.sort_values('Avg_Return_Probability', ascending=False)
    category_analysis.to_csv(f'{powerbi_folder}/Category_Analysis.csv', index=False)
    print(f"✓ Created {powerbi_folder}/Category_Analysis.csv")
    
    print("\n" + "="*70)
    print("✅ All Power BI datasets prepared successfully!")
    print("="*70)
    print(f"\nFiles created in '{powerbi_folder}/' folder:")
    print("  1. Customer_Analysis.csv - Customer segmentation and churn data")
    print("  2. Product_Analysis.csv - Product return predictions")
    print("  3. Sales_Forecast.csv - 90-day sales forecast with time dimensions")
    print("  4. KPI_Metrics.csv - Key performance indicators")
    print("  5. Segment_Distribution.csv - Customer segment breakdown")
    print("  6. Category_Analysis.csv - Product category insights")
    print("\n📊 Import these files into Power BI to create your dashboard!")
    print("="*70)

def print_summary_statistics():
    """Print comprehensive summary statistics"""
    customer_df = pd.read_csv('Predictions_Customer.csv')
    product_df = pd.read_csv('Predictions_Product.csv')
    sales_df = pd.read_csv('Predictions_Sales.csv')
    
    print("\n" + "="*70)
    print("BI DASHBOARD - PREDICTION SUMMARY STATISTICS")
    print("="*70)
    
    print("\n📊 CUSTOMER ANALYSIS")
    print("-" * 70)
    print(f"Total Customers Analyzed: {len(customer_df)}")
    print(f"\nSegment Distribution:")
    for segment, count in customer_df['predicted_segment'].value_counts().sort_index().items():
        pct = (count / len(customer_df)) * 100
        print(f"  Segment {segment}: {count} customers ({pct:.1f}%)")
    
    print(f"\nChurn Analysis:")
    churn_count = customer_df['predicted_churn'].sum()
    churn_rate = (churn_count / len(customer_df)) * 100
    print(f"  Customers at Risk: {churn_count} ({churn_rate:.1f}%)")
    print(f"  Average Churn Probability: {customer_df['churn_probability'].mean():.2%}")
    print(f"  High Risk (>70% churn prob): {(customer_df['churn_probability'] > 0.7).sum()}")
    
    print("\n📦 PRODUCT ANALYSIS")
    print("-" * 70)
    print(f"Total Products Analyzed: {len(product_df)}")
    return_count = product_df['predicted_return'].sum()
    return_rate = (return_count / len(product_df)) * 100
    print(f"Predicted Returns: {return_count} ({return_rate:.1f}%)")
    print(f"Average Return Probability: {product_df['return_probability'].mean():.2%}")
    print(f"High Risk Products (>50% return prob): {(product_df['return_probability'] > 0.5).sum()}")
    
    print("\n💰 SALES FORECAST")
    print("-" * 70)
    print(f"Forecast Period: 90 days")
    print(f"Total Predicted Sales: ${sales_df['predicted_sales'].sum():,.2f}")
    print(f"Average Daily Sales: ${sales_df['predicted_sales'].mean():,.2f}")
    print(f"Peak Day Sales: ${sales_df['predicted_sales'].max():,.2f}")
    print(f"Lowest Day Sales: ${sales_df['predicted_sales'].min():,.2f}")
    
    print("\n" + "="*70)
    print("✅ Analysis Complete!")
    print("="*70 + "\n")

if __name__ == "__main__":
    # Print summary statistics
    print_summary_statistics()
    
    # Prepare Power BI datasets
    prepare_powerbi_datasets()
    
    print("\n🎉 All done! Ready for Power BI visualization!")
