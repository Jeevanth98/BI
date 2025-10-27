# 📊 Power BI Dashboard Guide

## Overview
This guide will help you create interactive dashboards in Power BI using the ML prediction data from your BI Dashboard project.

---

## 📁 Data Files for Power BI

All data files are prepared in the **`PowerBI_Data/`** folder:

1. **Customer_Analysis.csv** - Customer segmentation and churn predictions
2. **Product_Analysis.csv** - Product return risk analysis  
3. **Sales_Forecast.csv** - 90-day sales forecast with time dimensions
4. **KPI_Metrics.csv** - Key performance indicators
5. **Segment_Distribution.csv** - Customer segment breakdown
6. **Category_Analysis.csv** - Product category insights

---

## 🚀 Getting Started with Power BI

### Step 1: Open Power BI Desktop
- Download Power BI Desktop (free): https://powerbi.microsoft.com/desktop/
- Install and open Power BI Desktop

### Step 2: Import Data

1. Click **"Get Data"** → **"Text/CSV"**
2. Navigate to the `PowerBI_Data/` folder
3. Select and import all 6 CSV files
4. Click **"Load"** to import the data

### Step 3: Set Up Relationships (if needed)
- Power BI may auto-detect relationships
- Manual relationships are generally not needed for these independent datasets

---

## 📊 Recommended Dashboard Pages

### **Page 1: Executive Summary**

**KPIs to Display:**
- Total Customers (Card visual)
- Churn Rate (Card visual with % format)
- Total Forecasted Sales (Card visual with $ format)
- Customers at Risk (Card visual with conditional formatting)

**Visuals:**
- **Gauge Chart**: Churn Rate with target threshold
- **Line Chart**: Sales Forecast (90 days)
- **Donut Chart**: Customer Segment Distribution

**Data Sources:**
- Use `KPI_Metrics.csv` for the cards
- Use `Sales_Forecast.csv` for line chart
- Use `Segment_Distribution.csv` for donut chart

---

### **Page 2: Customer Analysis**

**Visuals:**

1. **Clustered Column Chart**: Customer Segments
   - **Axis**: segment_name
   - **Values**: Count of customers
   - **Data**: Customer_Analysis.csv

2. **Pie Chart**: Churn Risk Distribution
   - **Legend**: churn_risk_level
   - **Values**: Count
   - **Data**: Customer_Analysis.csv
   - **Colors**: Green (Low), Yellow (Medium), Red (High)

3. **Table**: High-Risk Customers
   - **Columns**: customer_unique_id, churn_probability, segment_name, monetary
   - **Filter**: churn_risk_level = "High Risk"
   - **Data**: Customer_Analysis.csv

4. **Scatter Plot**: RFM Analysis
   - **X-Axis**: recency
   - **Y-Axis**: monetary
   - **Size**: frequency
   - **Color**: churn_probability
   - **Data**: Customer_Analysis.csv

**Slicers:**
- Segment Name
- Churn Risk Level

---

### **Page 3: Product Analysis**

**Visuals:**

1. **Bar Chart**: Top 10 High-Risk Categories
   - **Axis**: Category (from Category_Analysis.csv)
   - **Values**: Avg_Return_Probability
   - **Sort**: Descending by Avg_Return_Probability
   - **Show Top**: 10

2. **Donut Chart**: Return Risk Distribution
   - **Legend**: return_risk_level
   - **Values**: Count
   - **Data**: Product_Analysis.csv

3. **Scatter Chart**: Price vs Return Risk
   - **X-Axis**: price
   - **Y-Axis**: return_probability
   - **Color**: product_category_name
   - **Data**: Product_Analysis.csv

4. **Table**: High-Risk Products
   - **Columns**: product_category_name, price, return_probability, freight_value
   - **Filter**: predicted_return = 1
   - **Data**: Product_Analysis.csv

**Slicers:**
- Product Category
- Return Risk Level
- Price Range

---

### **Page 4: Sales Forecast**

**Visuals:**

1. **Line Chart with Confidence Interval**
   - **X-Axis**: date
   - **Values**: 
     - predicted_sales (Line)
     - upper_bound (Area - lighter shade)
     - lower_bound (Area - lighter shade)
   - **Data**: Sales_Forecast.csv

2. **Clustered Column Chart**: Monthly Sales Forecast
   - **Axis**: month_name
   - **Values**: Sum of predicted_sales
   - **Data**: Sales_Forecast.csv

3. **Matrix**: Weekly Breakdown
   - **Rows**: week_number
   - **Columns**: day_of_week
   - **Values**: Sum of predicted_sales
   - **Data**: Sales_Forecast.csv

4. **Card Visuals**:
   - Total Forecasted Sales (90 days)
   - Average Daily Sales
   - Peak Day Sales

**Slicers:**
- Month
- Week Number

---

## 🎨 Design Best Practices

### Color Scheme
Use consistent colors for risk levels:
- **Low Risk**: #2ecc71 (Green)
- **Medium Risk**: #f39c12 (Yellow/Orange)
- **High Risk**: #e74c3c (Red)

### Segments
- **Segment 0 (Inactive)**: #95a5a6 (Gray)
- **Segment 1 (Unhappy)**: #e74c3c (Red)
- **Segment 2 (Recent)**: #3498db (Blue)
- **Segment 3 (VIP)**: #f39c12 (Gold)

### Formatting
- **Currency**: $#,##0.00
- **Percentages**: 0.00%
- **Dates**: MMM DD, YYYY

---

## 📈 DAX Measures (Optional Advanced Features)

### Create these calculated measures in Power BI:

```dax
// Churn Rate
Churn Rate = 
DIVIDE(
    COUNTROWS(FILTER('Customer_Analysis', 'Customer_Analysis'[predicted_churn] = 1)),
    COUNTROWS('Customer_Analysis')
)

// Average Customer Value
Avg Customer Value = AVERAGE('Customer_Analysis'[monetary])

// High Risk Customer Count
High Risk Customers = 
COUNTROWS(FILTER('Customer_Analysis', 'Customer_Analysis'[churn_risk_level] = "High Risk"))

// Total Return Risk
Total Return Risk = 
SUMX('Product_Analysis', 'Product_Analysis'[return_probability])

// Sales Growth (Month over Month)
MoM Sales Growth = 
VAR CurrentMonth = SUM('Sales_Forecast'[predicted_sales])
VAR PreviousMonth = CALCULATE(SUM('Sales_Forecast'[predicted_sales]), DATEADD('Sales_Forecast'[date], -1, MONTH))
RETURN
DIVIDE(CurrentMonth - PreviousMonth, PreviousMonth)
```

---

## 🔄 Refreshing Data

### Manual Refresh:
1. Run `python predict.py` to generate new predictions
2. Run `python prepare_powerbi_data.py` to update Power BI datasets
3. In Power BI Desktop, click **"Refresh"** to reload the data

### Automated Refresh (Power BI Service):
1. Publish your dashboard to Power BI Service
2. Set up a scheduled refresh
3. Use Power BI Gateway if data is on-premises
4. Configure refresh schedule (daily, weekly, etc.)

---

## 📊 Sample Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  BI DASHBOARD - EXECUTIVE SUMMARY                    📊     │
├──────────────┬──────────────┬──────────────┬────────────────┤
│ Total        │ Churn Rate   │ Customers at │ Forecasted     │
│ Customers    │              │ Risk         │ Sales (90d)    │
│   100        │    46%       │    46        │  $3.1M         │
├──────────────┴──────────────┴──────────────┴────────────────┤
│                                                               │
│  Customer Segment Distribution    │  Churn Risk Level       │
│  ┌────────────────────┐           │  ┌──────────────┐       │
│  │   [Donut Chart]    │           │  │ [Pie Chart]  │       │
│  └────────────────────┘           │  └──────────────┘       │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│  Sales Forecast (90 Days)                                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                [Line Chart with Confidence Interval]   │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Insights to Highlight

### Customer Insights:
- **Segment 3 (VIP)**: High monetary value, low churn risk
- **Segment 1 (Unhappy)**: High churn risk, needs retention strategy
- **High-Risk Customers**: Target for proactive retention campaigns

### Product Insights:
- Categories with highest return rates
- Products that need quality improvement
- Freight cost impact on returns

### Sales Insights:
- Seasonal trends in forecast
- Peak and low sales periods
- Revenue opportunities

---

## 🔗 Interactive Features

### Enable Drill-Through:
1. Right-click on a customer segment
2. "Drill through" → View individual customers
3. See detailed customer profile

### Cross-Filtering:
- Click on a segment in one visual
- Watch other visuals filter automatically
- Explore relationships between metrics

### Bookmarks:
- Create bookmarks for different views
- "High Risk Customers" view
- "VIP Customers" view
- "Product Issues" view

---

## 📱 Publishing Options

### Option 1: Power BI Desktop (Local)
- Keep the .pbix file locally
- Share with team via email or network drive

### Option 2: Power BI Service (Cloud)
- Publish to PowerBI.com
- Share with stakeholders via link
- Enable mobile viewing
- Set up automated email reports

### Option 3: Embedded in Website
- Use Power BI Embedded
- Integrate into your web application
- Requires Power BI Premium

---

## 🛠️ Troubleshooting

### Data Not Loading?
- Check file paths are correct
- Ensure CSV files exist in PowerBI_Data/
- Try "Edit Queries" → "Refresh Preview"

### Visuals Not Working?
- Verify correct fields are selected
- Check data types (dates, numbers, text)
- Remove any blank rows from CSV

### Performance Issues?
- Reduce data granularity if needed
- Use aggregated tables
- Optimize DAX measures

---

## 📚 Additional Resources

- **Power BI Learning**: https://learn.microsoft.com/power-bi/
- **Community Forums**: https://community.powerbi.com/
- **Video Tutorials**: https://www.youtube.com/powerbi
- **DAX Guide**: https://dax.guide/

---

## ✅ Checklist

Before creating your dashboard:
- [ ] All CSV files generated in PowerBI_Data/
- [ ] Power BI Desktop installed
- [ ] Data imported successfully
- [ ] Sample visuals working
- [ ] Color scheme applied
- [ ] KPIs displaying correctly

After creating your dashboard:
- [ ] All pages created
- [ ] Filters and slicers added
- [ ] Cross-filtering working
- [ ] Dashboard published (if using Service)
- [ ] Stakeholders have access

---

## 🎉 You're Ready!

Import your data into Power BI and start building amazing interactive dashboards!

For questions or issues, refer to the main `README.md` or `QUICKSTART.md` files.

**Happy Visualizing! 📊**
