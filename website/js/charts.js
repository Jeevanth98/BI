/**
 * Chart.js Visualizations for BI Dashboard
 */

// Sample data based on your ML predictions
const sampleData = {
    segments: {
        labels: ['VIP Customers', 'Recent Buyers', 'Unhappy', 'Inactive'],
        data: [25, 35, 20, 20],
        colors: ['#F39C12', '#3498DB', '#E74C3C', '#95A5A6']
    },
    churnRisk: {
        labels: ['Low Risk', 'Medium Risk', 'High Risk'],
        data: [24, 30, 46],
        colors: ['#2ECC71', '#F39C12', '#E74C3C']
    },
    salesForecast: {
        labels: [], // Will be populated with dates
        predicted: [],
        upper: [],
        lower: []
    }
};

/**
 * Initialize all charts on Executive Summary page
 */
function initExecutiveCharts() {
    // Customer Segment Donut Chart
    const segmentCtx = document.getElementById('segmentChart');
    if (segmentCtx) {
        new Chart(segmentCtx, {
            type: 'doughnut',
            data: {
                labels: sampleData.segments.labels,
                datasets: [{
                    data: sampleData.segments.data,
                    backgroundColor: sampleData.segments.colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: { size: 12 },
                            padding: 15
                        }
                    },
                    title: {
                        display: false
                    }
                }
            }
        });
    }

    // Churn Risk Pie Chart
    const churnCtx = document.getElementById('churnChart');
    if (churnCtx) {
        new Chart(churnCtx, {
            type: 'pie',
            data: {
                labels: sampleData.churnRisk.labels,
                datasets: [{
                    data: sampleData.churnRisk.data,
                    backgroundColor: sampleData.churnRisk.colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 12 },
                            padding: 10
                        }
                    }
                }
            }
        });
    }

    // Sales Forecast Line Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        // Generate 90 days of sample data
        const days = 90;
        const dates = [];
        const predicted = [];
        const upper = [];
        const lower = [];
        
        const startDate = new Date();
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            
            // Generate sample sales data with some variation
            const baseSales = 34000 + Math.sin(i / 10) * 5000 + Math.random() * 3000;
            predicted.push(baseSales);
            upper.push(baseSales + 7000);
            lower.push(baseSales - 7000);
        }

        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Predicted Sales',
                        data: predicted,
                        borderColor: '#2ECC71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Upper Bound',
                        data: upper,
                        borderColor: '#BDC3C7',
                        borderWidth: 1,
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'Lower Bound',
                        data: lower,
                        borderColor: '#BDC3C7',
                        borderWidth: 1,
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
                                return context.dataset.label + ': $' + 
                                       context.parsed.y.toLocaleString();
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
}

/**
 * Animate KPI values on page load
 */
function animateKPIValues() {
    const kpiValues = document.querySelectorAll('.kpi-value');
    
    kpiValues.forEach(element => {
        const text = element.textContent;
        const hasPercent = text.includes('%');
        const hasDollar = text.includes('$');
        const hasPlus = text.includes('+');
        
        // Extract number
        const num = parseFloat(text.replace(/[^0-9.]/g, ''));
        
        if (isNaN(num)) return;
        
        let current = 0;
        const increment = num / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
                current = num;
                clearInterval(timer);
            }
            
            let displayValue = current.toFixed(hasPercent ? 0 : 1);
            if (hasDollar) displayValue = '$' + displayValue + (num >= 1000000 ? 'M' : 'K');
            if (hasPercent) displayValue += '%';
            if (hasPlus) displayValue = '+' + displayValue;
            
            element.textContent = displayValue;
        }, 20);
    });
}

/**
 * Load data from CSV files (if needed)
 */
async function loadDataFromCSV(filename) {
    try {
        const response = await fetch(`../PowerBI_Data/${filename}`);
        const text = await response.text();
        return parseCSV(text);
    } catch (error) {
        console.error('Error loading CSV:', error);
        return null;
    }
}

/**
 * Simple CSV parser
 */
function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim();
        });
        data.push(row);
    }
    
    return data;
}

// Initialize charts when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check which page we're on
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path.endsWith('/') || path.endsWith('/website')) {
        initExecutiveCharts();
    }
    
    // Animate KPI values on all pages
    setTimeout(animateKPIValues, 300);
});
