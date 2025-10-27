/**
 * Product Data Loading and Visualization
 */

// Load and display product data
async function loadProductData() {
    try {
        const products = await loadProductsFromCSV();
        
        if (products) {
            populateHighRiskProductsTable(products);
            createProductCharts(products);
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
        const response = await fetch('../PowerBI_Data/Product_Analysis.csv');
        const text = await response.text();
        return parseProductCSV(text);
    } catch (error) {
        console.warn('Could not load Product_Analysis.csv, using sample data');
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
 * Populate high-risk products table
 */
function populateHighRiskProductsTable(products) {
    const tbody = document.getElementById('highRiskProductsBody');
    if (!tbody) return;
    
    // Filter high-risk products
    const highRisk = products.filter(p => 
        p.return_risk_level === 'High Risk' || 
        parseInt(p.predicted_return) === 1
    );
    
    if (highRisk.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">No high-risk products found</td></tr>';
        return;
    }
    
    tbody.innerHTML = highRisk.slice(0, 20).map(product => `
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
        const response = await fetch('../PowerBI_Data/Category_Analysis.csv');
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
        console.warn('Could not load Category_Analysis.csv');
        return null;
    }
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
    
    populateHighRiskProductsTable(sampleProducts);
}

// Initialize product page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('products')) {
        loadProductData();
    }
});
