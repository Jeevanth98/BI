/**
 * Product Data Loading and Visualization
 */

// Store all products globally for filtering
let allProducts = [];

// Load and display product data
async function loadProductData() {
    try {
        const products = await loadProductsFromCSV();
        
        if (products) {
            allProducts = products;
            applyProductFilters();
        } else {
            useSampleProductData();
        }
    } catch (error) {
        console.error('Error loading product data:', error);
        useSampleProductData();
    }
}

/**
 * Load products from CSV
 */
async function loadProductsFromCSV() {
    try {
        const response = await fetch('/PowerBI_Data/Product_Analysis.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        return parseProductCSV(text);
    } catch (error) {
        console.warn('Could not load Product_Analysis.csv, using sample data:', error);
        return null;
    }
}

/**
 * Parse product CSV
 */
function parseProductCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const products = [];
    
    for (let i = 1; i < lines.length && i < 101; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',');
        const product = {};
        
        headers.forEach((header, index) => {
            product[header] = values[index]?.trim();
        });
        
        products.push(product);
    }
    
    return products;
}

/**
 * Populate products table (dynamic based on filters)
 */
function populateHighRiskProductsTable(products) {
    const tbody = document.getElementById('highRiskProductsBody');
    const tableTitle = document.getElementById('productTableTitle');
    if (!tbody) return;
    
    // Update table title based on filters
    const returnRiskFilter = document.getElementById('returnRiskFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    
    let titleText = 'Product Details';
    let titleIcon = 'fas fa-box';
    
    if (returnRiskFilter && returnRiskFilter.value !== 'all') {
        const riskLabels = {
            'high': 'High-Risk Products',
            'medium': 'Medium-Risk Products',
            'low': 'Low-Risk Products'
        };
        titleText = riskLabels[returnRiskFilter.value] || 'Product Details';
        titleIcon = returnRiskFilter.value === 'high' ? 'fas fa-exclamation-triangle' : 
                    returnRiskFilter.value === 'medium' ? 'fas fa-exclamation-circle' : 
                    'fas fa-check-circle';
    } else if (categoryFilter && categoryFilter.value !== 'all') {
        const categoryName = categoryFilter.options[categoryFilter.selectedIndex].text;
        titleText = `${categoryName} Products`;
        titleIcon = 'fas fa-boxes';
    }
    
    if (tableTitle) {
        tableTitle.innerHTML = `<i class="${titleIcon}"></i> ${titleText}`;
    }
    
    // Show all filtered products (not just high-risk)
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">No products found matching the selected filters</td></tr>';
        return;
    }
    
    // Sort by return probability (highest first) and limit to top 20
    const sortedProducts = [...products].sort((a, b) => 
        parseFloat(b.return_probability || 0) - parseFloat(a.return_probability || 0)
    );
    
    tbody.innerHTML = sortedProducts.slice(0, 20).map(product => `
        <tr>
            <td>${product.product_category_name || 'N/A'}</td>
            <td>${dashboardUtils.formatCurrency(parseFloat(product.price) || 0)}</td>
            <td>${dashboardUtils.formatPercentage(parseFloat(product.return_probability) || 0)}</td>
            <td>${dashboardUtils.formatCurrency(parseFloat(product.freight_value) || 0)}</td>
            <td>${parseFloat(product.product_weight_g || 0).toFixed(0)}g</td>
            <td>${dashboardUtils.getRiskBadge(product.return_risk_level || 'Unknown')}</td>
        </tr>
    `).join('');
}

/**
 * Create product charts
 */
async function createProductCharts(products) {
    // Top 10 High-Risk Categories Bar Chart
    const categoryCtx = document.getElementById('categoryRiskChart');
    if (categoryCtx) {
        // Load category analysis data
        const categories = await loadCategoryData();
        
        if (categories) {
            // Sort by average return probability
            const sorted = categories.sort((a, b) => 
                parseFloat(b.Avg_Return_Probability) - parseFloat(a.Avg_Return_Probability)
            ).slice(0, 10);
            
            new Chart(categoryCtx, {
                type: 'bar',
                data: {
                    labels: sorted.map(c => c.Category || 'Unknown'),
                    datasets: [{
                        label: 'Avg Return Probability',
                        data: sorted.map(c => (parseFloat(c.Avg_Return_Probability) || 0) * 100),
                        backgroundColor: '#E74C3C',
                        borderWidth: 0
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: { 
                            beginAtZero: true,
                            title: { display: true, text: 'Return Probability (%)' }
                        }
                    }
                }
            });
        }
    }
    
    // Return Risk Distribution Pie Chart
    const riskCtx = document.getElementById('productRiskChart');
    if (riskCtx) {
        const riskCounts = {};
        products.forEach(p => {
            const risk = p.return_risk_level || 'Unknown';
            riskCounts[risk] = (riskCounts[risk] || 0) + 1;
        });
        
        new Chart(riskCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(riskCounts),
                datasets: [{
                    data: Object.values(riskCounts),
                    backgroundColor: ['#2ECC71', '#F39C12', '#E74C3C'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
    
    // Price vs Return Probability Scatter
    const scatterCtx = document.getElementById('priceReturnScatter');
    if (scatterCtx) {
        const scatterData = products.map(p => ({
            x: parseFloat(p.price) || 0,
            y: parseFloat(p.return_probability) || 0,
            r: Math.sqrt(parseFloat(p.freight_value) || 1) * 5
        }));
        
        new Chart(scatterCtx, {
            type: 'bubble',
            data: {
                datasets: [{
                    label: 'Products (Price vs Return)',
                    data: scatterData,
                    backgroundColor: 'rgba(231, 76, 60, 0.6)',
                    borderColor: '#E74C3C',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: { 
                        title: { display: true, text: 'Price ($)' },
                        beginAtZero: true
                    },
                    y: { 
                        title: { display: true, text: 'Return Probability' },
                        beginAtZero: true,
                        max: 1,
                        ticks: {
                            callback: function(value) {
                                return (value * 100).toFixed(0) + '%';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Price: $${context.parsed.x.toFixed(2)}, Return Prob: ${(context.parsed.y * 100).toFixed(1)}%`;
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Load category analysis data
 */
async function loadCategoryData() {
    try {
        const response = await fetch('/PowerBI_Data/Category_Analysis.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const categories = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',');
            const category = {};
            
            headers.forEach((header, index) => {
                category[header] = values[index]?.trim();
            });
            
            categories.push(category);
        }
        
        return categories;
    } catch (error) {
        console.warn('Could not load Category_Analysis.csv:', error);
        return null;
    }
}

/**
 * Apply product filters
 */
function applyProductFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const returnRiskFilter = document.getElementById('returnRiskFilter');
    
    let filteredProducts = [...allProducts];
    
    // Apply category filter
    if (categoryFilter && categoryFilter.value !== 'all') {
        filteredProducts = filteredProducts.filter(p => 
            p.product_category_name === categoryFilter.value
        );
    }
    
    // Apply return risk filter
    if (returnRiskFilter && returnRiskFilter.value !== 'all') {
        const riskMap = {
            'high': 'High Risk',
            'medium': 'Medium Risk',
            'low': 'Low Risk'
        };
        const targetRisk = riskMap[returnRiskFilter.value];
        filteredProducts = filteredProducts.filter(p => 
            p.return_risk_level === targetRisk
        );
    }
    
    // Update displays
    populateHighRiskProductsTable(filteredProducts);
    createProductCharts(filteredProducts);
}

/**
 * Populate category filter dropdown
 */
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter || allProducts.length === 0) return;
    
    // Get unique categories
    const categories = [...new Set(allProducts.map(p => p.product_category_name))];
    categories.sort();
    
    // Clear existing options except "All Categories"
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    // Add category options
    categories.forEach(category => {
        if (category && category !== 'N/A') {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.appendChild(option);
        }
    });
}

/**
 * Use sample product data (fallback)
 */
function useSampleProductData() {
    const sampleProducts = [
        {
            product_category_name: 'electronics',
            price: '299.99',
            return_probability: '0.45',
            freight_value: '15.50',
            product_weight_g: '1200',
            return_risk_level: 'High Risk',
            predicted_return: '1'
        },
        {
            product_category_name: 'furniture',
            price: '599.00',
            return_probability: '0.38',
            freight_value: '45.00',
            product_weight_g: '8500',
            return_risk_level: 'Medium Risk',
            predicted_return: '0'
        }
    ];
    
    allProducts = sampleProducts;
    populateHighRiskProductsTable(sampleProducts);
}

// Initialize product page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('products')) {
        loadProductData().then(() => {
            populateCategoryFilter();
            
            // Add filter event listeners
            const categoryFilter = document.getElementById('categoryFilter');
            const returnRiskFilter = document.getElementById('returnRiskFilter');
            
            if (categoryFilter) {
                categoryFilter.addEventListener('change', applyProductFilters);
            }
            if (returnRiskFilter) {
                returnRiskFilter.addEventListener('change', applyProductFilters);
            }
        });
    }
});
