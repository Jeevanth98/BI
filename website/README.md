# BI Dashboard Website

A professional, responsive web application for visualizing Business Intelligence data with Power BI integration.

## 🌟 Features

- **4 Interactive Pages:**
  - Executive Summary - KPIs and overall business metrics
  - Customer Analysis - Churn prediction and segmentation
  - Product Analysis - Return prediction and category insights
  - Sales Forecast - 90-day sales predictions with confidence intervals

- **Power BI Integration:**
  - Embedded Power BI dashboards
  - Interactive filters and cross-filtering
  - Responsive iframe embedding

- **Fallback Visualizations:**
  - Chart.js visualizations when Power BI is not configured
  - Loads data from CSV files in PowerBI_Data folder
  - Beautiful, interactive charts

- **Responsive Design:**
  - Mobile-friendly navigation
  - Adaptive layouts for all screen sizes
  - Touch-optimized interactions

## 📂 Project Structure

```
website/
├── index.html          # Executive Summary page
├── customers.html      # Customer Analysis page
├── products.html       # Product Analysis page
├── sales.html          # Sales Forecast page
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   ├── main.js         # Main JavaScript & utilities
│   ├── powerbi.js      # Power BI embedding logic
│   ├── charts.js       # Chart.js visualizations
│   ├── customer-data.js # Customer data loading
│   ├── product-data.js  # Product data loading
│   └── sales-data.js    # Sales data loading
└── assets/             # Images and other assets
```

## 🚀 Quick Start

### Option 1: Simple Local Hosting (No Server Needed)

1. **Open directly in browser:**
   ```
   Double-click index.html
   ```
   
   Note: Some features (CSV loading) may not work due to CORS restrictions.

### Option 2: Use Python HTTP Server (Recommended)

1. **Navigate to website folder:**
   ```powershell
   cd website
   ```

2. **Start Python server:**
   ```powershell
   python -m http.server 8000
   ```

3. **Open in browser:**
   ```
   http://localhost:8000
   ```

### Option 3: Use Node.js HTTP Server

1. **Install http-server (one time):**
   ```powershell
   npm install -g http-server
   ```

2. **Start server:**
   ```powershell
   cd website
   http-server -p 8000
   ```

3. **Open in browser:**
   ```
   http://localhost:8000
   ```

### Option 4: Use VS Code Live Server

1. **Install "Live Server" extension in VS Code**
2. **Right-click on index.html**
3. **Select "Open with Live Server"**

## 🔧 Power BI Configuration

To embed your actual Power BI dashboards:

### Step 1: Publish to Power BI Service

1. Open your .pbix file in Power BI Desktop
2. Click **File → Publish → Publish to Power BI**
3. Select your workspace
4. Wait for publish to complete

### Step 2: Get Embed Information

1. Go to https://app.powerbi.com
2. Open your published report
3. Click **File → Embed report → Website or portal**
4. Copy the **iframe URL** or get the **embed URL** and **Report ID**

### Step 3: Configure in Website

Edit `js/powerbi.js` and update the configuration:

```javascript
const powerBIConfig = {
    executivePage: {
        embedUrl: 'YOUR_EMBED_URL_HERE',
        reportId: 'YOUR_REPORT_ID_HERE',
        pageName: 'ExecutiveSummary',
        accessToken: 'YOUR_ACCESS_TOKEN_HERE'
    },
    // ... repeat for other pages
};
```

### Step 4: Using iframe (Simpler Alternative)

If you have the public iframe URL, you can use the simpler method:

```javascript
// In your HTML or JavaScript
window.powerBIEmbed.embedIframe('#powerbi-embed', 'YOUR_IFRAME_URL');
```

## 📊 Data Loading

The website automatically loads data from the `PowerBI_Data/` folder:

- `Customer_Analysis.csv` → Customer page
- `Product_Analysis.csv` → Product page
- `Sales_Forecast.csv` → Sales page
- `Category_Analysis.csv` → Category charts
- `KPI_Metrics.csv` → KPI cards
- `Segment_Distribution.csv` → Segment distribution

### Generate Fresh Data

To update the visualizations with new predictions:

```powershell
cd ..
python predict.py
python prepare_powerbi_data.py
```

Then refresh your browser.

## 🎨 Customization

### Colors

Edit CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #3498db;
    --secondary-color: #2c3e50;
    --success-color: #2ecc71;
    --danger-color: #e74c3c;
    --warning-color: #f39c12;
}
```

### Layout

- Modify grid layouts in CSS
- Adjust chart sizes in HTML
- Update responsive breakpoints

### Charts

- Chart configurations in `js/charts.js`, `customer-data.js`, `product-data.js`, `sales-data.js`
- Uses Chart.js library (https://www.chartjs.org/)
- Customize colors, labels, and data formats

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Edge
- Safari
- Mobile browsers

## 📱 Mobile Responsive

The website is fully responsive:
- ✅ Mobile navigation hamburger menu
- ✅ Stacked card layouts on small screens
- ✅ Touch-optimized interactions
- ✅ Readable text sizes

## 🔒 Security Notes

### For Production Deployment:

1. **Never commit access tokens to Git**
2. **Use Azure AD authentication for Power BI**
3. **Implement server-side token generation**
4. **Use HTTPS in production**
5. **Set appropriate CORS headers**

### Recommended Architecture:

```
Browser → Your Web Server → Azure AD → Power BI Service
```

## 🐛 Troubleshooting

### Charts not showing?

- Check browser console for errors
- Verify Chart.js is loading (check network tab)
- Ensure data files are in correct location

### Power BI not embedding?

- Check configuration in `powerbi.js`
- Verify you have proper Power BI license
- Check browser console for errors
- Ensure iframe URL is correct

### CSV data not loading?

- Use a local server (not file://)
- Check file paths are correct
- Verify CSV files exist in PowerBI_Data folder

### Mobile menu not working?

- Check JavaScript is enabled
- Clear browser cache
- Try different browser

## 📚 Dependencies

- **Chart.js** - 4.x (loaded from CDN)
- **Font Awesome** - 6.4.0 (loaded from CDN)
- **Power BI Client** - 2.22.0 (loaded dynamically when needed)

No build process required! Everything loads from CDNs or local files.

## 🚀 Deployment

### Deploy to GitHub Pages:

1. **Push website folder to repository**
2. **Go to repository Settings → Pages**
3. **Select branch and /website folder**
4. **Save and wait for deployment**
5. **Visit your site at: `https://yourusername.github.io/BI/website/`**

### Deploy to Netlify:

1. **Drag and drop website folder to Netlify**
2. **Or connect GitHub repository**
3. **Set publish directory to `website`**
4. **Deploy!**

### Deploy to Azure Static Web Apps:

1. **Create Static Web App in Azure Portal**
2. **Connect to GitHub**
3. **Set app location to `/website`**
4. **Deploy automatically via GitHub Actions**

## 📞 Support

For issues or questions:
- Check the main `PowerBI_Guide.md`
- Review `PowerBI_Dashboard_Template.md`
- Check browser console for errors
- Verify data files exist and are formatted correctly

## 📄 License

Part of the BI Dashboard project. See main repository for license information.

---

**Built with ❤️ using HTML, CSS, JavaScript, Chart.js, and Power BI**
