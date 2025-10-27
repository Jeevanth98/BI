/**
 * Customer Data Loading and Visualization
 */

// Store all customers globally for filtering
let allCustomers = [];

// Load and display customer data
async function loadCustomerData() {
    try {
        // You can load from actual CSV files or use sample data
        const customers = await loadCustomersFromCSV();
        
        if (customers) {
            allCustomers = customers;
            applyCustomerFilters();
        } else {
            // Use sample data if CSV loading fails
            useSampleCustomerData();
        }
    } catch (error) {
        console.error('Error loading customer data:', error);
        useSampleCustomerData();
    }
}

/**
 * Load customers from CSV file
 */
async function loadCustomersFromCSV() {
    try {
        const response = await fetch('/PowerBI_Data/Customer_Analysis.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        return parseCustomerCSV(text);
    } catch (error) {
        console.warn('Could not load Customer_Analysis.csv, using sample data:', error);
        return null;
    }
}

/**
 * Parse customer CSV
 */
function parseCustomerCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const customers = [];
    
    for (let i = 1; i < lines.length && i < 101; i++) { // Limit to 100 rows
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',');
        const customer = {};
        
        headers.forEach((header, index) => {
            customer[header] = values[index]?.trim();
        });
        
        customers.push(customer);
    }
    
    return customers;
}

/**
 * Populate high-risk customers table
 */
function populateHighRiskTable(customers) {
    const tbody = document.getElementById('highRiskTableBody');
    if (!tbody) return;
    
    // Filter high-risk customers
    const highRisk = customers.filter(c => 
        c.churn_risk_level === 'High Risk' || 
        parseFloat(c.churn_probability) > 0.7
    );
    
    if (highRisk.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading">No high-risk customers found</td></tr>';
        return;
    }
    
    tbody.innerHTML = highRisk.slice(0, 20).map(customer => `
        <tr>
            <td>${customer.customer_unique_id?.substring(0, 12)}...</td>
            <td>${customer.segment_name || 'N/A'}</td>
            <td>${dashboardUtils.formatPercentage(parseFloat(customer.churn_probability) || 0)}</td>
            <td>${dashboardUtils.formatCurrency(parseFloat(customer.monetary) || 0)}</td>
            <td>${customer.frequency || 0}</td>
            <td>${customer.recency || 0} days</td>
            <td>
                <button class="btn-small btn-primary" onclick="viewCustomer('${customer.customer_unique_id}')">
                    View
                </button>
            </td>
        </tr>
    `).join('');
    
    // Add button styles
    addButtonStyles();
}

/**
 * Create customer charts
 */
function createCustomerCharts(customers) {
    // Customer Segment Bar Chart
    const segmentCtx = document.getElementById('customerSegmentChart');
    if (segmentCtx) {
        const segmentCounts = {};
        customers.forEach(c => {
            const segment = c.segment_name || 'Unknown';
            segmentCounts[segment] = (segmentCounts[segment] || 0) + 1;
        });
        
        new Chart(segmentCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(segmentCounts),
                datasets: [{
                    label: 'Customer Count',
                    data: Object.values(segmentCounts),
                    backgroundColor: ['#F39C12', '#3498DB', '#E74C3C', '#95A5A6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
    
    // Risk Distribution Pie Chart
    const riskCtx = document.getElementById('customerRiskChart');
    if (riskCtx) {
        const riskCounts = {};
        customers.forEach(c => {
            const risk = c.churn_risk_level || 'Unknown';
            riskCounts[risk] = (riskCounts[risk] || 0) + 1;
        });
        
        new Chart(riskCtx, {
            type: 'pie',
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
    
    // RFM Scatter Chart
    const rfmCtx = document.getElementById('rfmScatterChart');
    if (rfmCtx) {
        const scatterData = customers.map(c => ({
            x: parseFloat(c.recency) || 0,
            y: parseFloat(c.monetary) || 0,
            r: Math.sqrt(parseFloat(c.frequency) || 1) * 3
        }));
        
        new Chart(rfmCtx, {
            type: 'bubble',
            data: {
                datasets: [{
                    label: 'Customers (RFM)',
                    data: scatterData,
                    backgroundColor: 'rgba(52, 152, 219, 0.6)',
                    borderColor: '#3498DB',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: { 
                        title: { display: true, text: 'Recency (days)' },
                        beginAtZero: true
                    },
                    y: { 
                        title: { display: true, text: 'Monetary Value ($)' },
                        beginAtZero: true
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Recency: ${context.parsed.x} days, Monetary: $${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Apply customer filters
 */
function applyCustomerFilters() {
    const segmentFilter = document.getElementById('segmentFilter');
    const riskFilter = document.getElementById('riskFilter');
    
    let filteredCustomers = [...allCustomers];
    
    // Apply segment filter
    if (segmentFilter && segmentFilter.value !== 'all') {
        const segmentMap = {
            'vip': 'VIP Customers',
            'recent': 'Recent Buyers',
            'unhappy': 'Unhappy Customers',
            'inactive': 'Inactive Customers'
        };
        const targetSegment = segmentMap[segmentFilter.value];
        filteredCustomers = filteredCustomers.filter(c => 
            c.segment_name === targetSegment
        );
    }
    
    // Apply risk filter
    if (riskFilter && riskFilter.value !== 'all') {
        const riskMap = {
            'high': 'High Risk',
            'medium': 'Medium Risk',
            'low': 'Low Risk'
        };
        const targetRisk = riskMap[riskFilter.value];
        filteredCustomers = filteredCustomers.filter(c => 
            c.churn_risk_level === targetRisk
        );
    }
    
    // Update displays
    populateHighRiskTable(filteredCustomers);
    createCustomerCharts(filteredCustomers);
}

/**
 * Use sample customer data (fallback)
 */
function useSampleCustomerData() {
    const sampleCustomers = [
        {
            customer_unique_id: '0000366f3b9a7992',
            segment_name: 'Recent Buyers',
            churn_probability: '0.706516',
            monetary: '141.9',
            frequency: '1',
            recency: '116',
            churn_risk_level: 'High Risk'
        },
        {
            customer_unique_id: '0000f46a3911fa3c',
            segment_name: 'Inactive Customers',
            churn_probability: '0.829393',
            monetary: '86.22',
            frequency: '1',
            recency: '542',
            churn_risk_level: 'High Risk'
        }
    ];
    
    allCustomers = sampleCustomers;
    populateHighRiskTable(sampleCustomers);
}

/**
 * View customer details (placeholder)
 */
function viewCustomer(customerId) {
    dashboardUtils.showNotification(`Viewing customer: ${customerId}`, 'info');
}

/**
 * Add button styles
 */
function addButtonStyles() {
    if (document.getElementById('btn-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'btn-styles';
    styles.textContent = `
        .btn-small {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85rem;
            transition: all 0.3s ease;
        }
        .btn-small.btn-primary {
            background-color: var(--primary-color);
            color: white;
        }
        .btn-small.btn-primary:hover {
            background-color: #2980b9;
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(styles);
}

// Initialize customer page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('customers')) {
        loadCustomerData();
        
        // Add filter event listeners
        const segmentFilter = document.getElementById('segmentFilter');
        const riskFilter = document.getElementById('riskFilter');
        
        if (segmentFilter) {
            segmentFilter.addEventListener('change', applyCustomerFilters);
        }
        if (riskFilter) {
            riskFilter.addEventListener('change', applyCustomerFilters);
        }
    }
});
