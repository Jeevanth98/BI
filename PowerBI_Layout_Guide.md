# 📊 Power BI Dashboard - Visual Layout Reference

## Quick Visual Reference for Each Page

---

## PAGE 1: EXECUTIVE SUMMARY 📈

```
┌──────────────────────────────────────────────────────────────────────────┐
│               📊 BUSINESS INTELLIGENCE DASHBOARD                         │
├──────────────┬──────────────┬──────────────┬─────────────────────────────┤
│ Total        │ Churn Rate   │ Customers    │ Forecasted Sales (90d)     │
│ Customers    │              │ at Risk      │                             │
│   100        │    46%       │    46        │    $3,102,392.93           │
│              │              │              │                             │
├──────────────┴──────────────┴──────────────┴─────────────────────────────┤
│                                                                           │
│  Customer Segments        │  Churn Risk        │  90-Day Sales Forecast  │
│  ┌─────────────────┐      │  ┌──────────┐     │  ┌──────────────────┐   │
│  │                 │      │  │          │     │  │                  │   │
│  │  [Donut Chart]  │      │  │   [Pie]  │     │  │   [Line Chart]   │   │
│  │                 │      │  │          │     │  │  with confidence │   │
│  │  VIP: 25%       │      │  │ High:46% │     │  │    intervals     │   │
│  │  Recent: 35%    │      │  │ Med: 30% │     │  │                  │   │
│  │  Unhappy: 20%   │      │  │ Low: 24% │     │  │                  │   │
│  │  Inactive: 20%  │      │  │          │     │  │                  │   │
│  └─────────────────┘      │  └──────────┘     │  └──────────────────┘   │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

**Color Scheme:**
- 🟦 Total Customers: Light Blue (#E8F4F8)
- 🟥 Churn Rate: Light Red (#FFE8E8)
- 🟧 At Risk: Light Orange (#FFF4E8)
- 🟩 Sales: Light Green (#E8FFE8)

---

## PAGE 2: CUSTOMER ANALYSIS 👥

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [Filter: Segment ▼]                                                     │
├──────────────────────────────────┬───────────────────────────────────────┤
│  Customers by Segment            │  High-Risk Customers                  │
│  ┌────────────────────────────┐  │  ┌─────────────────────────────────┐ │
│  │         [Bar Chart]        │  │  │  Customer ID  │ Segment │ Churn │ │
│  │                            │  │  │  ───────────────────────────────│ │
│  │  VIP          ████ 25     │  │  │  0000366f...  │ Recent  │ 70%  │ │
│  │  Recent       ██████ 35   │  │  │  0000f46a...  │ Inactive│ 82%  │ │
│  │  Unhappy      ███ 20      │  │  │  0001fdfa...  │ Unhappy │ 65%  │ │
│  │  Inactive     ███ 20      │  │  │  ...                             │ │
│  │                            │  │  │                                  │ │
│  └────────────────────────────┘  │  └─────────────────────────────────┘ │
├──────────────────────────────────┴───────────────────────────────────────┤
│  RFM Analysis (Recency vs Monetary)                                      │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                        [Scatter Plot]                              │  │
│  │  Monetary $                                                        │  │
│  │    │                    ⚫ ← VIP (large bubble)                    │  │
│  │    │        🔴 ← High churn risk                                   │  │
│  │    │    🟡 ← Medium risk                                           │  │
│  │    │  🟢 ← Low risk                                                │  │
│  │    └──────────────────────────────────────────── Recency (days)   │  │
│  │         (Size = Frequency, Color = Churn Probability)             │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## PAGE 3: PRODUCT ANALYSIS 📦

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Top 10 High-Risk Categories        │  Return Risk Distribution         │
│  ┌───────────────────────────────┐  │  ┌─────────────────────────────┐  │
│  │     [Horizontal Bar Chart]    │  │  │      [Donut Chart]          │  │
│  │                               │  │  │                             │  │
│  │  electronics    ███████ 45%  │  │  │  🔴 High: 31%              │  │
│  │  furniture      ██████ 38%   │  │  │  🟡 Medium: 35%            │  │
│  │  home_decor     █████ 35%    │  │  │  🟢 Low: 34%               │  │
│  │  sports         ████ 32%     │  │  │                             │  │
│  │  toys           ████ 30%     │  │  │                             │  │
│  │  ...                          │  │  └─────────────────────────────┘  │
│  └───────────────────────────────┘  │                                    │
├─────────────────────────────────────┴────────────────────────────────────┤
│  Price vs Return Probability                                             │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                        [Scatter Chart]                             │  │
│  │  Return                                                            │  │
│  │  Prob %│              🔵 furniture                                 │  │
│  │     80 │     🟣 electronics   🟢 books                             │  │
│  │     60 │  🟡 toys                                                  │  │
│  │     40 │         🔴 sports                                         │  │
│  │     20 │                                                           │  │
│  │      0 └────────────────────────────────────────── Price ($)      │  │
│  │            (Bubble size = Freight value)                          │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## PAGE 4: SALES FORECAST 📈

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [Month Filter: All ▼]                                                   │
├──────────────────────────────────────────────────────────────────────────┤
│  Daily Sales Forecast with Confidence Intervals                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                   [Line + Column Chart]                            │  │
│  │  Sales $                                                           │  │
│  │   45K │    ╱╲  ╱╲                 upper bound (dashed)            │  │
│  │   40K │   ╱  ╲╱  ╲  ▇▇▇▇                                          │  │
│  │   35K │  ╱        ╲▇▇▇▇▇▇▇  predicted sales (columns)            │  │
│  │   30K │ ╱          ▇▇▇▇▇▇▇▇                                       │  │
│  │   25K │╱                  ╲  lower bound (dashed)                 │  │
│  │       └──────────────────────────────────────────── Date          │  │
│  └────────────────────────────────────────────────────────────────────┘  │
├──────────────────────────────────┬───────────────────────────────────────┤
│  Sales by Month                  │  KPI Cards                            │
│  ┌────────────────────────────┐  │  ┌─────────────────────────────────┐ │
│  │    [Column Chart]          │  │  │  Total Forecasted Sales         │ │
│  │                            │  │  │  $3,102,392.93                  │ │
│  │  Nov  ████████  $1.2M     │  │  ├─────────────────────────────────┤ │
│  │  Dec  █████████ $1.5M     │  │  │  Average Daily Sales            │ │
│  │  Jan  ██████    $0.4M     │  │  │  $34,471.03                     │ │
│  │                            │  │  ├─────────────────────────────────┤ │
│  └────────────────────────────┘  │  │  Peak Day Sales                 │ │
│                                   │  │  $41,954.36                     │ │
│  Weekly Heatmap (Week x Day)     │  └─────────────────────────────────┘ │
│  ┌────────────────────────────┐  │                                       │
│  │ [Matrix - Color Gradient]  │  │                                       │
│  │     Mon Tue Wed Thu Fri    │  │                                       │
│  │ W1  🟩  🟨  🟨  🟧  🟥    │  │                                       │
│  │ W2  🟨  🟩  🟨  🟨  🟧    │  │                                       │
│  │ W3  🟨  🟨  🟩  🟨  🟧    │  │                                       │
│  └────────────────────────────┘  │                                       │
└──────────────────────────────────┴───────────────────────────────────────┘
```

---

## 🎨 COLOR PALETTE REFERENCE

### **Risk Levels:**
- 🟢 **Low Risk**: #2ECC71 (Green)
- 🟡 **Medium Risk**: #F39C12 (Orange)
- 🔴 **High Risk**: #E74C3C (Red)

### **Customer Segments:**
- 🏆 **VIP Customers**: #F39C12 (Gold)
- 🔵 **Recent Buyers**: #3498DB (Blue)
- 🔴 **Unhappy Customers**: #E74C3C (Red)
- ⚫ **Inactive Customers**: #95A5A6 (Gray)

### **General:**
- 🔵 **Primary**: #3498DB (Blue)
- 🟢 **Success**: #2ECC71 (Green)
- 🟣 **Info**: #9B59B6 (Purple)
- ⚪ **Background**: #F5F5F5 (Light Gray)
- ⚫ **Text**: #2C3E50 (Dark Gray)

---

## 📱 RESPONSIVE LAYOUT TIPS

### **Desktop (1920x1080):**
- Use full width for charts
- 3-4 columns for KPI cards
- Large fonts (16-24px for titles)

### **Tablet (1024x768):**
- Stack visuals vertically
- 2 columns maximum
- Medium fonts (14-18px)

### **Mobile (Phone):**
- Single column layout
- Essential visuals only
- Touch-friendly buttons (min 44px)

---

## 🔧 POWER BI VISUAL TYPES USED

| Visual Name | Power BI Icon | Purpose |
|-------------|---------------|---------|
| Card | 📊 | Display single KPI value |
| Donut Chart | 🍩 | Show proportions with center hole |
| Pie Chart | 🥧 | Show percentage breakdown |
| Line Chart | 📈 | Show trends over time |
| Column Chart | 📊 | Compare values across categories |
| Bar Chart | ▬ | Horizontal comparison (good for many categories) |
| Scatter Plot | ⚫ | Show relationships between 2+ variables |
| Table | ▦ | Display detailed data rows |
| Matrix | ▦ | Cross-tabulation with conditional formatting |
| Slicer | 🎚️ | Filter dashboard data |

---

## ⌨️ KEYBOARD SHORTCUTS

- **Ctrl + S**: Save
- **Ctrl + N**: New report
- **Ctrl + D**: Duplicate visual
- **Ctrl + C/V**: Copy/Paste visual
- **Ctrl + G**: Group visuals
- **Alt + Drag**: Duplicate while dragging
- **Shift + Drag**: Maintain aspect ratio
- **Ctrl + Click**: Multi-select visuals
- **F5**: View in reading mode

---

## ✅ VISUAL PLACEMENT CHECKLIST

**Page 1 (Executive Summary):**
- [ ] 4 KPI cards at top (equal width)
- [ ] 3 charts below KPIs (donut, pie, line)
- [ ] Page title centered at very top
- [ ] Balanced layout (no empty spaces)

**Page 2 (Customer Analysis):**
- [ ] Filter slicer at top
- [ ] 2 visuals in first row (chart + table)
- [ ] 1 large scatter plot at bottom
- [ ] Consistent spacing (20px gaps)

**Page 3 (Product Analysis):**
- [ ] 2 visuals in first row
- [ ] 1 large scatter at bottom
- [ ] Optional table on right side
- [ ] Category filter slicer

**Page 4 (Sales Forecast):**
- [ ] 1 large line chart at top (full width)
- [ ] 3 smaller visuals below (2 charts + KPIs)
- [ ] Month filter slicer
- [ ] Even distribution of space

---

## 🎯 QUICK START CHECKLIST

- [ ] Download and install Power BI Desktop
- [ ] Import all 6 CSV files from PowerBI_Data folder
- [ ] Verify no relationships in Model view
- [ ] Create 4 pages (Executive, Customer, Product, Sales)
- [ ] Follow layout diagrams above
- [ ] Apply color scheme consistently
- [ ] Add slicers for interactivity
- [ ] Test all filters and cross-highlighting
- [ ] Save as BI_Dashboard.pbix
- [ ] Test data refresh

---

## 📚 REFERENCE

- **Detailed Instructions**: See `PowerBI_Dashboard_Template.md`
- **Data Guide**: See `PowerBI_Guide.md`
- **Data Location**: `PowerBI_Data/` folder
- **Power BI Docs**: https://learn.microsoft.com/power-bi/

---

**Total Visuals to Create: 20+**
**Estimated Build Time: 45-60 minutes**
**Skill Level: Beginner-Friendly**

🎉 **Good luck building your dashboard!**
