/**
 * Sales Forecast Data Loading and Visualization
 */

// Load and display sales forecast data
async function loadSalesData() {
    try {
        const salesData = await loadSalesFromCSV();
        
        if (salesData) {
            populateForecastTable(salesData);
            createSalesCharts(salesData);
        } else {
            useSampleSalesData();
        }
    } catch (error) {
        console.error('Error loading sales data:', error);
        useSampleSalesData();
    }
}

/**
 * Load sales from CSV
 */
async function loadSalesFromCSV() {
    try {
        const response = await fetch('/PowerBI_Data/Sales_Forecast.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        return parseSalesCSV(text);
    } catch (error) {
        console.warn('Could not load Sales_Forecast.csv, using sample data:', error);
        return null;
    }
}

/**
 * Parse sales CSV
 */
function parseSalesCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const salesData = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',');
        const sale = {};
        
        headers.forEach((header, index) => {
            sale[header] = values[index]?.trim();
        });
        
        salesData.push(sale);
    }
    
    return salesData;
}

/**
 * Populate forecast table
 */
function populateForecastTable(salesData) {
    const tbody = document.getElementById('forecastTableBody');
    if (!tbody) return;
    
    if (salesData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">No forecast data available</td></tr>';
        return;
    }
    
    // Show first 30 days
    tbody.innerHTML = salesData.slice(0, 30).map(sale => `
        <tr>
            <td>${dashboardUtils.formatDate(sale.date)}</td>
            <td>${dashboardUtils.formatCurrency(parseFloat(sale.predicted_sales) || 0)}</td>
            <td>${dashboardUtils.formatCurrency(parseFloat(sale.lower_bound) || 0)}</td>
            <td>${dashboardUtils.formatCurrency(parseFloat(sale.upper_bound) || 0)}</td>
            <td>${sale.month_name || 'N/A'}</td>
            <td>${sale.day_of_week || 'N/A'}</td>
        </tr>
    `).join('');
}

/**
 * Create sales charts
 */
function createSalesCharts(salesData) {
    // Daily Sales Forecast Line Chart
    const dailyCtx = document.getElementById('dailySalesChart');
    if (dailyCtx) {
        const dates = salesData.map(s => dashboardUtils.formatDate(s.date));
        const predicted = salesData.map(s => parseFloat(s.predicted_sales) || 0);
        const upper = salesData.map(s => parseFloat(s.upper_bound) || 0);
        const lower = salesData.map(s => parseFloat(s.lower_bound) || 0);
        
        new Chart(dailyCtx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Predicted Sales',
                        data: predicted,
                        borderColor: '#3498DB',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'Upper Bound',
                        data: upper,
                        borderColor: '#BDC3C7',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'Lower Bound',
                        data: lower,
                        borderColor: '#BDC3C7',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + 
                                       dashboardUtils.formatCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000).toFixed(0) + 'K';
                            }
                        }
                    },
                    x: {
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                }
            }
        });
    }
    
    // Monthly Sales Breakdown
    const monthlyCtx = document.getElementById('monthlySalesChart');
    if (monthlyCtx) {
        const monthlyData = aggregateByMonth(salesData);
        
        new Chart(monthlyCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(monthlyData),
                datasets: [{
                    label: 'Monthly Sales',
                    data: Object.values(monthlyData),
                    backgroundColor: '#2ECC71',
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Sales: ' + dashboardUtils.formatCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Weekly Pattern Chart
    const weeklyCtx = document.getElementById('weeklyPatternChart');
    if (weeklyCtx) {
        const weeklyData = aggregateByWeek(salesData);
        
        new Chart(weeklyCtx, {
            type: 'line',
            data: {
                labels: Object.keys(weeklyData),
                datasets: [{
                    label: 'Weekly Sales',
                    data: Object.values(weeklyData),
                    borderColor: '#9B59B6',
                    backgroundColor: 'rgba(155, 89, 182, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000).toFixed(0) + 'K';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Day of Week Chart
    const dayOfWeekCtx = document.getElementById('dayOfWeekChart');
    if (dayOfWeekCtx) {
        const dayData = aggregateByDayOfWeek(salesData);
        
        new Chart(dayOfWeekCtx, {
            type: 'bar',
            data: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: [{
                    label: 'Avg Sales by Day',
                    data: [
                        dayData['Monday'] || 0,
                        dayData['Tuesday'] || 0,
                        dayData['Wednesday'] || 0,
                        dayData['Thursday'] || 0,
                        dayData['Friday'] || 0,
                        dayData['Saturday'] || 0,
                        dayData['Sunday'] || 0
                    ],
                    backgroundColor: ['#3498DB', '#2ECC71', '#F39C12', '#E74C3C', '#9B59B6', '#1ABC9C', '#E67E22'],
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
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000).toFixed(0) + 'K';
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Aggregate sales by month
 */
function aggregateByMonth(salesData) {
    const monthly = {};
    salesData.forEach(sale => {
        const month = sale.month_name || 'Unknown';
        monthly[month] = (monthly[month] || 0) + parseFloat(sale.predicted_sales || 0);
    });
    return monthly;
}

/**
 * Aggregate sales by week
 */
function aggregateByWeek(salesData) {
    const weekly = {};
    salesData.forEach(sale => {
        const week = 'Week ' + (sale.week_number || 'Unknown');
        weekly[week] = (weekly[week] || 0) + parseFloat(sale.predicted_sales || 0);
    });
    return weekly;
}

/**
 * Aggregate sales by day of week
 */
function aggregateByDayOfWeek(salesData) {
    const daily = {};
    const counts = {};
    
    salesData.forEach(sale => {
        const day = sale.day_of_week || 'Unknown';
        daily[day] = (daily[day] || 0) + parseFloat(sale.predicted_sales || 0);
        counts[day] = (counts[day] || 0) + 1;
    });
    
    // Calculate averages
    Object.keys(daily).forEach(day => {
        daily[day] = daily[day] / counts[day];
    });
    
    return daily;
}

/**
 * Use sample sales data (fallback)
 */
function useSampleSalesData() {
    // Generate 90 days of sample data
    const salesData = [];
    const startDate = new Date();
    
    for (let i = 0; i < 90; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        const baseSales = 34000 + Math.sin(i / 10) * 5000 + Math.random() * 3000;
        
        salesData.push({
            date: date.toISOString().split('T')[0],
            predicted_sales: baseSales.toFixed(2),
            upper_bound: (baseSales + 7000).toFixed(2),
            lower_bound: (baseSales - 7000).toFixed(2),
            month_name: date.toLocaleString('en-US', { month: 'short' }),
            day_of_week: date.toLocaleString('en-US', { weekday: 'long' }),
            week_number: Math.ceil(i / 7).toString()
        });
    }
    
    populateForecastTable(salesData);
    createSalesCharts(salesData);
}

// Initialize sales page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('sales')) {
        loadSalesData();
    }
});
