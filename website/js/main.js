/**
 * Main JavaScript for BI Dashboard
 * Handles navigation, mobile menu, and common functionality
 */

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    });
});

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

/**
 * Add loading state to tables
 */
function showTableLoading(tableId) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="100%" class="loading">
                    <i class="fas fa-spinner fa-spin"></i> Loading data...
                </td>
            </tr>
        `;
    }
}

/**
 * Show error in table
 */
function showTableError(tableId, message) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="100%" class="loading" style="color: var(--danger-color);">
                    <i class="fas fa-exclamation-triangle"></i> ${message}
                </td>
            </tr>
        `;
    }
}

/**
 * Format currency
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Format percentage
 */
function formatPercentage(value) {
    return (value * 100).toFixed(2) + '%';
}

/**
 * Format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Get risk badge HTML
 */
function getRiskBadge(riskLevel) {
    const badges = {
        'High Risk': '<span class="badge badge-danger">High Risk</span>',
        'Medium Risk': '<span class="badge badge-warning">Medium Risk</span>',
        'Low Risk': '<span class="badge badge-success">Low Risk</span>'
    };
    return badges[riskLevel] || riskLevel;
}

/**
 * Add badge styles dynamically
 */
const badgeStyles = document.createElement('style');
badgeStyles.textContent = `
    .badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 600;
        text-align: center;
    }
    .badge-danger {
        background-color: rgba(231, 76, 60, 0.1);
        color: #E74C3C;
        border: 1px solid #E74C3C;
    }
    .badge-warning {
        background-color: rgba(243, 156, 18, 0.1);
        color: #F39C12;
        border: 1px solid #F39C12;
    }
    .badge-success {
        background-color: rgba(46, 204, 113, 0.1);
        color: #2ECC71;
        border: 1px solid #2ECC71;
    }
`;
document.head.appendChild(badgeStyles);

/**
 * Show notification (toast)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Add notification styles
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 15px 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        }
        .notification-error {
            border-left: 4px solid #E74C3C;
        }
        .notification-success {
            border-left: 4px solid #2ECC71;
        }
        .notification-info {
            border-left: 4px solid #3498DB;
        }
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(notificationStyles);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

/**
 * Export utility functions
 */
window.dashboardUtils = {
    showTableLoading,
    showTableError,
    formatCurrency,
    formatPercentage,
    formatDate,
    getRiskBadge,
    showNotification
};

// Log that main.js is loaded
console.log('BI Dashboard initialized successfully');
