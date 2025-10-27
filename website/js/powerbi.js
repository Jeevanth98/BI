/**
 * Power BI Embedding Configuration
 * To embed your actual Power BI dashboard:
 * 1. Publish your dashboard to Power BI Service
 * 2. Get the embed URL and report ID from Power BI
 * 3. Update the configuration objects below
 */

// Power BI Embed Configuration
const powerBIConfig = {
    // Main report embed URL and ID
    reportId: '167b3656-03a0-48af-87ed-c029d429faea',
    baseEmbedUrl: 'https://app.powerbi.com/reportEmbed?reportId=167b3656-03a0-48af-87ed-c029d429faea&autoAuth=true&ctid=d4963ce2-af94-4122-95a9-644e8b01624d',
    
    executivePage: {
        embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=167b3656-03a0-48af-87ed-c029d429faea&autoAuth=true&ctid=d4963ce2-af94-4122-95a9-644e8b01624d',
        reportId: '167b3656-03a0-48af-87ed-c029d429faea',
        pageName: 'ReportSection', // Change this to your actual page name if different
        accessToken: '' // Using autoAuth, so access token not needed
    },
    customerPage: {
        embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=167b3656-03a0-48af-87ed-c029d429faea&autoAuth=true&ctid=d4963ce2-af94-4122-95a9-644e8b01624d',
        reportId: '167b3656-03a0-48af-87ed-c029d429faea',
        pageName: 'ReportSection1', // Change to your customer page name
        accessToken: ''
    },
    productPage: {
        embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=167b3656-03a0-48af-87ed-c029d429faea&autoAuth=true&ctid=d4963ce2-af94-4122-95a9-644e8b01624d',
        reportId: '167b3656-03a0-48af-87ed-c029d429faea',
        pageName: 'ReportSection2', // Change to your product page name
        accessToken: ''
    },
    salesPage: {
        embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=167b3656-03a0-48af-87ed-c029d429faea&autoAuth=true&ctid=d4963ce2-af94-4122-95a9-644e8b01624d',
        reportId: '167b3656-03a0-48af-87ed-c029d429faea',
        pageName: 'ReportSection3', // Change to your sales page name
        accessToken: ''
    }
};

/**
 * Initialize Power BI Embed
 * This function will embed the Power BI report when configuration is complete
 */
function initPowerBIEmbed(containerSelector, config) {
    const container = document.querySelector(containerSelector);
    
    if (!container) {
        console.warn('Power BI container not found');
        return;
    }

    // Check if configuration is complete
    if (!config.embedUrl || !config.reportId) {
        console.info('Power BI configuration not complete. Showing instructions.');
        return;
    }

    // Use iframe embedding (simpler and works with autoAuth)
    embedPowerBIIframe(containerSelector, config.embedUrl);
}

/**
 * Embed Power BI Report
 */
function embedReport(container, config) {
    // Clear the container
    container.innerHTML = '';

    // Create embed configuration
    const embedConfig = {
        type: 'report',
        id: config.reportId,
        embedUrl: config.embedUrl,
        accessToken: config.accessToken,
        tokenType: window.models.TokenType.Aad, // or Embed
        settings: {
            panes: {
                filters: {
                    visible: true
                },
                pageNavigation: {
                    visible: true
                }
            },
            background: window.models.BackgroundType.Transparent,
            filterPaneEnabled: true,
            navContentPaneEnabled: true
        }
    };

    // If specific page is defined
    if (config.pageName) {
        embedConfig.pageName = config.pageName;
    }

    // Embed the report
    const powerbi = new window.powerbi.service.Service(
        window.powerbi.factories.hpmFactory,
        window.powerbi.factories.wpmpFactory,
        window.powerbi.factories.routerFactory
    );
    
    const report = powerbi.embed(container, embedConfig);

    // Handle errors
    report.on('error', (event) => {
        console.error('Power BI Error:', event.detail);
        showEmbedError(container, event.detail);
    });

    // Report loaded successfully
    report.on('loaded', () => {
        console.log('Power BI report loaded successfully');
    });

    // Report rendered
    report.on('rendered', () => {
        console.log('Power BI report rendered');
    });
}

/**
 * Show embed error message
 */
function showEmbedError(container, error) {
    container.innerHTML = `
        <div class="embed-instructions">
            <i class="fas fa-exclamation-triangle" style="color: var(--danger-color);"></i>
            <h3>Error Loading Power BI Report</h3>
            <p>${error.message || 'Unable to load the report. Please check your configuration.'}</p>
            <p class="note">Check the console for more details.</p>
        </div>
    `;
}

/**
 * Alternative: Embed using iframe (simpler but less features)
 * Use this if you have the public embed link from Power BI
 */
function embedPowerBIIframe(containerSelector, iframeUrl) {
    const container = document.querySelector(containerSelector);
    
    if (!container || !iframeUrl) return;

    container.innerHTML = `
        <iframe 
            title="Power BI Report" 
            width="100%" 
            height="600" 
            src="${iframeUrl}" 
            frameborder="0" 
            allowFullScreen="true"
            style="border: none; min-height: 600px;">
        </iframe>
    `;
}

/**
 * Export functions for use in pages
 */
window.powerBIEmbed = {
    init: initPowerBIEmbed,
    embedIframe: embedPowerBIIframe,
    config: powerBIConfig
};

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check which page we're on and initialize accordingly
    const currentPage = document.body.id || getPageFromURL();
    
    switch(currentPage) {
        case 'executive':
        case 'index':
            initPowerBIEmbed('#powerbi-embed', powerBIConfig.executivePage);
            break;
        case 'customers':
            initPowerBIEmbed('#powerbi-customer-embed', powerBIConfig.customerPage);
            break;
        case 'products':
            initPowerBIEmbed('#powerbi-product-embed', powerBIConfig.productPage);
            break;
        case 'sales':
            initPowerBIEmbed('#powerbi-sales-embed', powerBIConfig.salesPage);
            break;
    }
});

/**
 * Helper function to get page from URL
 */
function getPageFromURL() {
    const path = window.location.pathname;
    if (path.includes('customers')) return 'customers';
    if (path.includes('products')) return 'products';
    if (path.includes('sales')) return 'sales';
    return 'index';
}
