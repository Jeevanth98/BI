# 🎨 Power BI Dashboard - Step-by-Step Implementation Guide

## 📦 **What You'll Build**

A professional 4-page interactive dashboard with:
- Executive KPI Summary
- Customer Churn Analysis
- Product Return Analysis
- Sales Forecasting

---

## 🚀 **STEP-BY-STEP INSTRUCTIONS**

### **STEP 1: Install Power BI Desktop**

1. Download Power BI Desktop (FREE): https://powerbi.microsoft.com/desktop/
2. Install and open the application
3. Sign in with Microsoft account (or create one - it's free)

---

### **STEP 2: Import Your Data**

1. Click **"Get Data"** button (top left)
2. Select **"Text/CSV"**
3. Navigate to: `C:\Users\jeeva\Desktop\BI_Dashboard\BI\PowerBI_Data\`
4. Select **Customer_Analysis.csv** → Click **"Open"** → Click **"Load"**
5. Repeat for all 6 files:
   - ✅ Customer_Analysis.csv
   - ✅ Product_Analysis.csv
   - ✅ Sales_Forecast.csv
   - ✅ KPI_Metrics.csv
   - ✅ Segment_Distribution.csv
   - ✅ Category_Analysis.csv

**✓ You should see all 6 tables in the Fields pane (right side)**

---

### **STEP 3: Verify Data Model (No Relationships)**

1. Click **"Model"** icon (left sidebar - looks like three connected tables)
2. If you see any relationship lines connecting tables, **delete them**:
   - Right-click the line → **Delete**
3. Our tables work independently - no relationships needed!

---

## 📊 **PAGE 1: EXECUTIVE SUMMARY**

### **Create the Page**

1. Click **"Report"** icon (left sidebar - looks like a bar chart)
2. Rename page: Right-click **"Page 1"** at bottom → Rename → Type: **"Executive Summary"**

---

### **Visual 1: Total Customers Card**

1. Click blank canvas
2. In **Visualizations** pane → Click **"Card"** icon
3. In **Fields** pane → Expand **KPI_Metrics**
4. Drag **"Value"** to the **"Fields"** well
5. Click **Filters on this visual** → **Metric** → Check **"Total Customers"**

**Format the Card:**
- Select the card → Click **"Format"** (paint roller icon)
- **Callout value** → Font size: **48**
- **Category label** → Toggle **On** → Text: **"Total Customers"**
- Background color: **#E8F4F8** (light blue)

**Position:** Top-left corner, resize to ~250px x 150px

---

### **Visual 2: Churn Rate Card**

1. Repeat same steps as Visual 1
2. Filter by **Metric = "Churn Rate"**
3. Format:
   - Font size: **48**
   - Label: **"Churn Rate"**
   - Background: **#FFE8E8** (light red)
   - Value format: Click **"Format"** → **Data labels** → Display units: **None**, Value decimal places: **2**

**Position:** Next to Total Customers card

---

### **Visual 3: Customers at Risk Card**

1. Same steps, filter by **Metric = "High Risk Customers"**
2. Format:
   - Font size: **48**
   - Label: **"Customers at Risk"**
   - Background: **#FFF4E8** (light orange)

**Position:** Next to Churn Rate card

---

### **Visual 4: Forecasted Sales Card**

1. Same steps, filter by **Metric = "Total Forecasted Sales"**
2. Format:
   - Font size: **48**
   - Label: **"Forecasted Sales (90d)"**
   - Background: **#E8FFE8** (light green)
   - Value format: Display units: **None**, Decimal places: **2**

**Position:** Next to Customers at Risk card

---

### **Visual 5: Customer Segment Distribution (Donut Chart)**

1. Click **"Donut chart"** in Visualizations
2. From **Segment_Distribution** table:
   - Drag **"segment_name"** → **Legend**
   - Drag **"count"** → **Values**

**Format:**
- **Legend**: Position: **Right**, Font size: **12**
- **Data labels**: Toggle **On**, Font size: **14**
- **Title**: Text: **"Customer Segments"**, Font size: **16**
- **Colors**: 
  - VIP Customers: **#F39C12** (Gold)
  - Recent Buyers: **#3498DB** (Blue)
  - Unhappy Customers: **#E74C3C** (Red)
  - Inactive Customers: **#95A5A6** (Gray)

**Position:** Below KPI cards, left side, ~400px x 300px

---

### **Visual 6: Churn Risk Distribution (Pie Chart)**

1. Click **"Pie chart"** in Visualizations
2. From **Customer_Analysis** table:
   - Drag **"churn_risk_level"** → **Legend**
   - Drag **"customer_unique_id"** → **Values** (will show count)

**Format:**
- **Title**: **"Churn Risk Levels"**, Font size: **16**
- **Colors**:
  - Low Risk: **#2ECC71** (Green)
  - Medium Risk: **#F39C12** (Orange)
  - High Risk: **#E74C3C** (Red)

**Position:** Center, below KPI cards, ~400px x 300px

---

### **Visual 7: Sales Forecast (Line Chart)**

1. Click **"Line chart"** in Visualizations
2. From **Sales_Forecast** table:
   - Drag **"date"** → **X-axis**
   - Drag **"predicted_sales"** → **Y-axis**
   - Drag **"upper_bound"** → **Y-axis** (adds second line)
   - Drag **"lower_bound"** → **Y-axis** (adds third line)

**Format:**
- **Title**: **"90-Day Sales Forecast"**, Font size: **16**
- **X-axis**: Title: **"Date"**, Font size: **11**
- **Y-axis**: Title: **"Sales ($)"**, Font size: **11**, Display units: **Thousands (K)**
- **Legend**: Position: **Top**, Font size: **11**
- **Lines**:
  - predicted_sales: Color **#2ECC71** (Green), Line width: **3**
  - upper_bound: Color **#BDC3C7** (Gray), Line style: **Dashed**
  - lower_bound: Color **#BDC3C7** (Gray), Line style: **Dashed**

**Position:** Right side, below KPI cards, ~600px x 300px

---

### **Add Page Title**

1. Insert → **Text box**
2. Type: **"📊 BUSINESS INTELLIGENCE DASHBOARD"**
3. Format: Font **Segoe UI**, Size **24**, Bold, Color **#2C3E50**
4. Position: Top center above KPI cards

---

## 👥 **PAGE 2: CUSTOMER ANALYSIS**

### **Create the Page**

1. Click **"+"** at bottom to add new page
2. Rename: **"Customer Analysis"**

---

### **Visual 1: Customer Segment Bar Chart**

1. Click **"Clustered column chart"**
2. From **Customer_Analysis**:
   - Drag **"segment_name"** → **X-axis**
   - Drag **"customer_unique_id"** → **Y-axis** (Count)

**Format:**
- **Title**: **"Customers by Segment"**, Font size: **16**
- **Data labels**: Toggle **On**
- **Colors**: Use same segment colors from Page 1

**Position:** Top-left, ~450px x 300px

---

### **Visual 2: High-Risk Customers Table**

1. Click **"Table"** visualization
2. From **Customer_Analysis**, drag these columns in order:
   - customer_unique_id
   - segment_name
   - churn_probability
   - monetary
   - frequency

**Add Filter:**
- Click **Filters on this visual**
- Drag **"churn_risk_level"** to filter area
- Check **"High Risk"** only

**Format:**
- **Title**: **"High-Risk Customers"**, Font size: **16**
- **Column headers**: Font size: **12**, Bold
- **Values**: Font size: **11**
- **Grid**: Alternate rows: **On**, Row padding: **5**

**Position:** Top-right, ~550px x 300px

---

### **Visual 3: RFM Scatter Plot**

1. Click **"Scatter chart"**
2. From **Customer_Analysis**:
   - Drag **"recency"** → **X-axis**
   - Drag **"monetary"** → **Y-axis**
   - Drag **"frequency"** → **Size**
   - Drag **"churn_probability"** → **Legend** (creates color gradient)

**Format:**
- **Title**: **"RFM Analysis (Recency vs Monetary)"**, Font size: **16**
- **X-axis**: Title: **"Recency (days)"**
- **Y-axis**: Title: **"Monetary Value ($)"**
- **Data colors**: Gradient from **#2ECC71** (low) to **#E74C3C** (high)

**Position:** Bottom section, full width, ~1000px x 350px

---

### **Add Slicers**

1. Click **"Slicer"** visualization
2. Drag **"segment_name"** from Customer_Analysis

**Format:**
- **Style**: Dropdown
- **Title**: **"Filter by Segment"**

**Position:** Top-left corner, above bar chart

---

## 📦 **PAGE 3: PRODUCT ANALYSIS**

### **Create the Page**

1. Add new page → Rename: **"Product Analysis"**

---

### **Visual 1: Top Categories by Return Risk**

1. Click **"Bar chart"** (horizontal bars)
2. From **Category_Analysis**:
   - Drag **"product_category_name"** → **Y-axis**
   - Drag **"Avg_Return_Probability"** → **X-axis**

**Add Top N Filter:**
- Click **Filters on this visual**
- Drag **"product_category_name"** to filter
- Change filter type: **Top N**
- Show items: **Top 10**
- By value: **Avg_Return_Probability**

**Format:**
- **Title**: **"Top 10 High-Risk Categories"**, Font size: **16**
- **Data labels**: Toggle **On**
- **Bars**: Color **#E74C3C** (Red)
- **Sort**: Descending by Avg_Return_Probability

**Position:** Left side, ~500px x 400px

---

### **Visual 2: Return Risk Distribution (Donut)**

1. Click **"Donut chart"**
2. From **Product_Analysis**:
   - Drag **"return_risk_level"** → **Legend**
   - Drag **"price"** → **Values** (Count)

**Format:**
- **Title**: **"Product Return Risk Distribution"**, Font size: **16**
- **Colors**: Low (Green), Medium (Orange), High (Red)

**Position:** Top-right, ~400px x 250px

---

### **Visual 3: Price vs Return Probability Scatter**

1. Click **"Scatter chart"**
2. From **Product_Analysis**:
   - Drag **"price"** → **X-axis**
   - Drag **"return_probability"** → **Y-axis**
   - Drag **"product_category_name"** → **Legend**
   - Drag **"freight_value"** → **Size**

**Format:**
- **Title**: **"Price vs Return Risk"**, Font size: **16**
- **X-axis**: Title: **"Price ($)"**
- **Y-axis**: Title: **"Return Probability"**

**Position:** Bottom, ~1000px x 350px

---

### **Visual 4: High-Risk Products Table**

1. Click **"Table"**
2. From **Product_Analysis**:
   - product_category_name
   - price
   - return_probability
   - freight_value
   - product_weight_g

**Filter**: predicted_return = 1

**Format:**
- **Title**: **"High-Risk Products (Predicted Returns)"**, Font size: **16**
- Sort by: **return_probability** descending

**Position:** Bottom-right, ~500px x 350px

---

## 📈 **PAGE 4: SALES FORECAST**

### **Create the Page**

1. Add new page → Rename: **"Sales Forecast"**

---

### **Visual 1: Daily Sales Forecast Line Chart**

1. Click **"Line and stacked column chart"**
2. From **Sales_Forecast**:
   - Drag **"date"** → **X-axis**
   - Drag **"predicted_sales"** → **Column values**
   - Drag **"upper_bound"** → **Line values**
   - Drag **"lower_bound"** → **Line values**

**Format:**
- **Title**: **"Daily Sales Forecast with Confidence Intervals"**, Font size: **18**
- **Columns**: Color **#3498DB** (Blue)
- **Lines**: Upper/Lower bounds in **#BDC3C7** (Gray), Dashed

**Position:** Top, full width, ~1200px x 400px

---

### **Visual 2: Monthly Sales Forecast**

1. Click **"Clustered column chart"**
2. From **Sales_Forecast**:
   - Drag **"month_name"** → **X-axis**
   - Drag **"predicted_sales"** → **Y-axis** (Sum)

**Format:**
- **Title**: **"Sales by Month"**, Font size: **16**
- **Data labels**: On
- **Bars**: Gradient from **#1ABC9C** to **#16A085**

**Position:** Bottom-left, ~500px x 300px

---

### **Visual 3: Weekly Heatmap Matrix**

1. Click **"Matrix"**
2. From **Sales_Forecast**:
   - Drag **"week_number"** → **Rows**
   - Drag **"day_of_week"** → **Columns**
   - Drag **"predicted_sales"** → **Values** (Sum)

**Format:**
- **Title**: **"Sales Heatmap (Week x Day)"**, Font size: **16**
- **Values**: Background color gradient (low to high sales)
- **Style**: Conditional formatting → Background color → Based on Sum of predicted_sales

**Position:** Bottom-center, ~400px x 300px

---

### **Visual 4: KPI Cards**

Create 3 cards from **KPI_Metrics**:

1. **Total Forecasted Sales** (filter: Metric = "Total Forecasted Sales")
2. **Average Daily Sales** (filter: Metric = "Avg Daily Sales")
3. **Peak Day Sales** (filter: Metric = "Peak Day Sales")

**Format:** Font size 36, with labels

**Position:** Top-right, stacked vertically

---

### **Add Slicer**

1. **Slicer** → **"month_name"** from Sales_Forecast
2. Style: Tile
3. Position: Top-left corner

---

## 🎨 **FINAL TOUCHES**

### **1. Add Navigation Buttons** (Optional)

On each page:
1. Insert → **Buttons** → **Navigator** → **Page navigator**
2. Position: Left sidebar
3. Shows all 4 pages for easy navigation

---

### **2. Apply Consistent Theme**

1. **View** tab → **Themes** → Choose **Executive** or **Innovate**
2. Or customize:
   - Background: **#F5F5F5** (light gray)
   - Text: **#2C3E50** (dark gray)
   - Accent: **#3498DB** (blue)

---

### **3. Add Company Branding** (Optional)

1. Insert → **Image** → Upload your logo
2. Position: Top-left of each page
3. Set as background or header

---

### **4. Enable Cross-Filtering**

- Click any visual → **Format** → **Edit interactions**
- Choose how other visuals respond (filter, highlight, or none)

---

## 💾 **SAVE YOUR DASHBOARD**

1. **File** → **Save As**
2. Name: **"BI_Dashboard.pbix"**
3. Location: `C:\Users\jeeva\Desktop\BI_Dashboard\BI\`

---

## 🔄 **REFRESH DATA**

When you update predictions:

1. Run: `python predict.py`
2. Run: `python prepare_powerbi_data.py`
3. In Power BI: **Home** → **Refresh**

---

## 📱 **PUBLISH TO POWER BI SERVICE** (Optional)

1. **Home** → **Publish**
2. Sign in to PowerBI.com
3. Select workspace
4. Share link with stakeholders
5. Set up scheduled refresh (requires Power BI Pro)

---

## ✅ **CHECKLIST**

- [ ] Power BI Desktop installed
- [ ] All 6 CSV files imported
- [ ] No relationships in Model view
- [ ] Page 1: Executive Summary created with 7 visuals
- [ ] Page 2: Customer Analysis created with slicers
- [ ] Page 3: Product Analysis created
- [ ] Page 4: Sales Forecast created
- [ ] Consistent colors and formatting applied
- [ ] Dashboard saved as .pbix file
- [ ] Data refresh tested

---

## 🎉 **YOU'RE DONE!**

You now have a professional, interactive Power BI dashboard!

**Estimated Time:** 45-60 minutes for first-time users

**Questions?** Refer to PowerBI_Guide.md or visit https://learn.microsoft.com/power-bi/

---

## 📸 **Expected Result**

Your dashboard will have:
- ✅ 4 interactive pages
- ✅ 20+ professional visualizations
- ✅ Color-coded risk levels
- ✅ Filters and slicers for exploration
- ✅ KPIs, charts, tables, and forecasts
- ✅ Mobile-responsive layout

**Happy Dashboard Building! 🚀**
