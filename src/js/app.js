// Main Application Controller - Enterprise Shop Analyser
class ShopAnalyserApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    async init() {
        console.log('🚀 Enterprise Shop Analyser initializing...');
        
        // Check authentication
        if (window.authSystem && !window.authSystem.requireAuth()) {
            return;
        }
        
        this.setupNavigation();
        await this.loadDashboard();
        
        // Update UI for current user
        if (window.authSystem) {
            window.authSystem.updateUIForUser();
        }
        
        // Setup global event listeners
        this.setupGlobalEventListeners();
        
        console.log('✅ Enterprise Shop Analyser initialized successfully!');
    }

    setupGlobalEventListeners() {
        // Close user menu when clicking outside
        document.addEventListener('click', (e) => {
            const userMenu = document.querySelector('.user-menu');
            const userMenuDropdown = document.getElementById('user-menu-dropdown');
            
            if (userMenu && userMenuDropdown && !userMenu.contains(e.target) && !userMenuDropdown.contains(e.target)) {
                userMenuDropdown.classList.add('hidden');
            }
        });

        // Close notifications when clicking outside
        document.addEventListener('click', (e) => {
            const notificationsPanel = document.getElementById('notifications-panel');
            if (notificationsPanel && !notificationsPanel.contains(e.target)) {
                notificationsPanel.classList.add('hidden');
            }
        });

        // Ensure logout button is always visible
        this.ensureLogoutButtonVisible();
        
        // Set up a periodic check to keep logout button visible
        setInterval(() => {
            this.ensureLogoutButtonVisible();
        }, 1000);
    }

    ensureLogoutButtonVisible() {
        const logoutBtn = document.getElementById('permanent-logout-btn');
        if (logoutBtn) {
            // Force the button to be visible
            logoutBtn.style.display = 'flex !important';
            logoutBtn.style.visibility = 'visible !important';
            logoutBtn.style.opacity = '1 !important';
            logoutBtn.style.position = 'relative !important';
            logoutBtn.style.zIndex = '9999 !important';
            
            // Remove any classes that might hide it
            logoutBtn.classList.remove('hidden', 'invisible', 'd-none');
            
            // Ensure parent container is visible
            const headerCenter = logoutBtn.closest('.header-center');
            if (headerCenter) {
                headerCenter.style.display = 'flex !important';
                headerCenter.style.visibility = 'visible !important';
            }
        }
    }

    setupNavigation() {
        // Handle sidebar navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                if (page) {
                    await this.navigateToPage(page);
                }
            });
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'dashboard';
            this.loadPage(page, false);
        });
    }

    async navigateToPage(page) {
        // Update URL without page reload
        history.pushState({ page }, '', `#${page}`);
        
        // Update active navigation
        this.updateActiveNavigation(page);
        
        // Load the page
        await this.loadPage(page);
    }

    updateActiveNavigation(activePage) {
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current page
        const activeLink = document.querySelector(`[data-page="${activePage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    async loadPage(page) {
        this.currentPage = page;
        
        // Load page content
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        try {
            switch (page) {
                    case 'dashboard':
                    await this.loadDashboard();
                        break;
                    case 'products':
                    await this.loadProducts();
                        break;
                    case 'ai-insights':
                    await this.loadAIInsights();
                    break;
                case 'analytics':
                    await this.loadAnalytics();
                    break;
                case 'accountability':
                    await this.loadAccountability();
                    break;
                case 'taxes':
                    await this.loadTaxes();
                    break;
                case 'wholesalers':
                    await this.loadWholesalers();
                    break;
                case 'adverts':
                    await this.loadAdverts();
                    break;
                case 'sales-entry':
                    this.loadSalesEntry();
                    break;
                case 'daily-summary':
                    this.loadDailySummary();
                    break;
                case 'basic-analytics':
                    this.loadBasicAnalytics();
                    break;
                case 'business-reports':
                    this.loadBusinessReports();
                    break;
                case 'users':
                    this.loadUsers();
                    break;
                case 'settings':
                    this.loadSettings();
                        break;
                default:
                    await this.loadDashboard();
                }
        } catch (error) {
            console.error(`Error loading page ${page}:`, error);
                mainContent.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                    <h2>Error Loading Page</h2>
                    <p>There was an error loading the ${page} page. Please try again.</p>
                    <button class="btn-primary" onclick="location.reload()">
                        <i class="fas fa-refresh"></i> Reload Page
                    </button>
                </div>
            `;
        }
    }

    async loadDashboard() {
        try {
            const response = await fetch('/api/dashboard');
            const data = await response.json();
            
            const mainContent = document.querySelector('.main-content');
            mainContent.innerHTML = `
                <div class="dashboard-enterprise">
                    <div class="executive-summary">
                        <div class="summary-header">
                            <h2><i class="fas fa-chart-line"></i> Executive Summary</h2>
                            <div class="summary-actions">
                                <button class="btn-primary">
                                    <i class="fas fa-download"></i> Export Report
                                </button>
                                <button class="btn-secondary">
                                    <i class="fas fa-share"></i> Share Dashboard
                                </button>
                            </div>
                        </div>
                        
                        <div class="kpi-grid-enterprise">
                            <div class="kpi-card enterprise">
                                <div class="kpi-header">
                                    <div class="kpi-icon revenue">
                                        <i class="fas fa-chart-line"></i>
                                    </div>
                                    <div class="kpi-trend positive">
                                        <i class="fas fa-arrow-up"></i> ${data.revenueGrowth > 0 ? '+' : ''}${data.revenueGrowth.toFixed(1)}%
                                    </div>
                                </div>
                                <div class="kpi-value">UGX ${(data.totalRevenue / 1000000).toFixed(1)}M</div>
                                <div class="kpi-subtitle">Total Revenue</div>
                            </div>
                            
                            <div class="kpi-card enterprise">
                                <div class="kpi-header">
                                    <div class="kpi-icon profit">
                                        <i class="fas fa-coins"></i>
                                    </div>
                                    <div class="kpi-trend positive">
                                        <i class="fas fa-arrow-up"></i> ${data.profitGrowth > 0 ? '+' : ''}${data.profitGrowth.toFixed(1)}%
                                    </div>
                                </div>
                                <div class="kpi-value">UGX ${(data.netProfit / 1000000).toFixed(1)}M</div>
                                <div class="kpi-subtitle">Net Profit</div>
                            </div>
                            
                            <div class="kpi-card enterprise">
                                <div class="kpi-header">
                                    <div class="kpi-icon products">
                                        <i class="fas fa-box"></i>
                                    </div>
                                    <div class="kpi-trend neutral">
                                        <i class="fas fa-minus"></i> 0%
                                    </div>
                                </div>
                                <div class="kpi-value">${data.activeProducts}</div>
                                <div class="kpi-subtitle">Active Products</div>
                            </div>
                            
                            <div class="kpi-card enterprise">
                                <div class="kpi-header">
                                    <div class="kpi-icon margin">
                                        <i class="fas fa-percentage"></i>
                                    </div>
                                    <div class="kpi-trend positive">
                                        <i class="fas fa-arrow-up"></i> +2.1%
                                    </div>
                                </div>
                                <div class="kpi-value">${data.profitMargin.toFixed(1)}%</div>
                                <div class="kpi-subtitle">Profit Margin</div>
                            </div>
                        </div>
                        
                        <div class="charts-section-enterprise">
                            <div class="chart-container">
                                <h3>Monthly Revenue Trends</h3>
                                <canvas id="revenueChart" width="400" height="200"></canvas>
                            </div>
                            <div class="chart-container">
                                <h3>Category Performance</h3>
                                <canvas id="categoryChart" width="400" height="200"></canvas>
                            </div>
                        </div>
                        
                        <div class="recent-activity">
                            <h3><i class="fas fa-clock"></i> Recent Transactions</h3>
                            <div class="activity-list">
                                ${data.recentTransactions.slice(0, 5).map(transaction => `
                                    <div class="activity-item">
                                        <div class="activity-icon">
                                            <i class="fas fa-shopping-cart"></i>
                                        </div>
                                        <div class="activity-details">
                                            <div class="activity-title">${transaction.customer}</div>
                                            <div class="activity-subtitle">${transaction.items} items • ${transaction.paymentMethod}</div>
                                        </div>
                                        <div class="activity-amount">UGX ${transaction.total.toLocaleString()}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    </div>
                `;
            
            // Initialize charts
            this.initDashboardCharts(data);
            
        } catch (error) {
            console.error('Error loading dashboard:', error);
            document.querySelector('.main-content').innerHTML = '<p>Error loading dashboard data</p>';
        }
    }

    initDashboardCharts(data) {
        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: data.monthlyData.map(item => item.month.split(' ')[0]),
                    datasets: [{
                        label: 'Revenue (UGX)',
                        data: data.monthlyData.map(item => item.revenue / 1000000),
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: { display: true, text: 'Monthly Revenue (Millions UGX)' }
                    }
                }
            });
        }

        // Category Chart
        const categoryCtx = document.getElementById('categoryChart');
        if (categoryCtx) {
            new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: data.categoryData.map(item => item.name),
                    datasets: [{
                        data: data.categoryData.map(item => item.revenue / 1000000),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 206, 86, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                            'rgba(153, 102, 255, 0.8)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: { display: true, text: 'Revenue by Category (Millions UGX)' }
                    }
                }
            });
        }
    }

    async loadProducts() {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            
            const mainContent = document.querySelector('.main-content');
            mainContent.innerHTML = `
                <div class="inventory-management-enterprise">
                    <div class="inventory-header">
                        <h2><i class="fas fa-boxes"></i> Enterprise Inventory Management</h2>
                        <div class="inventory-actions">
                            <button class="btn-primary">
                                <i class="fas fa-file-alt"></i> Generate Report
                            </button>
                            <button class="btn-secondary">
                                <i class="fas fa-download"></i> Export Data
                            </button>
                        </div>
                    </div>
                    
                    <div class="inventory-overview">
                        <div class="overview-card">
                            <div class="overview-icon">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div class="overview-content">
                                <h3>Total Products</h3>
                                <div class="overview-value">${data.length}</div>
                                <div class="overview-subtitle">Active Inventory</div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="overview-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div class="overview-content">
                                <h3>Low Stock Alerts</h3>
                                <div class="overview-value">${data.filter(p => p.stock < 20).length}</div>
                                <div class="overview-subtitle">Requires Attention</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="product-analytics">
                        <h3><i class="fas fa-chart-bar"></i> Product Performance Analytics</h3>
                        <div class="analytics-grid">
                            ${data.map(product => `
                                <div class="product-analytics-card">
                                    <div class="product-header">
                                        <h4>${product.name}</h4>
                                        <span class="category-badge">${product.category}</span>
                                    </div>
                                    
                                    <div class="product-metrics">
                                        <div class="metric">
                                            <span class="metric-label">Stock Level</span>
                                            <span class="metric-value ${product.stock < 20 ? 'warning' : 'normal'}">${product.stock}</span>
                                        </div>
                                        <div class="metric">
                                            <span class="metric-label">Profit Margin</span>
                                            <span class="metric-value">${product.profitMargin}%</span>
                                        </div>
                                        <div class="metric">
                                            <span class="metric-label">SKU</span>
                                            <span class="metric-value">${product.sku}</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            
        } catch (error) {
            console.error('Error loading inventory management:', error);
            document.querySelector('.main-content').innerHTML = '<p>Error loading inventory data</p>';
        }
    }

    async loadAIInsights() {
        try {
            const response = await fetch('/api/ai-insights');
            const data = await response.json();
            
            const mainContent = document.querySelector('.main-content');
            mainContent.innerHTML = `
                <div class="ai-insights-page">
                    <div class="page-header">
                        <h2><i class="fas fa-robot"></i> AI Business Intelligence</h2>
                        <p>Advanced AI-powered insights for strategic decision making</p>
                    </div>
                    
                    <div class="ai-insights-grid">
                        ${data.insights.map(insight => `
                            <div class="ai-insight-card ${insight.type}">
                                <div class="insight-header">
                                    <div class="insight-icon">
                                        <i class="fas fa-${this.getInsightIcon(insight.type)}"></i>
                                    </div>
                                    <div class="insight-meta">
                                        <h3>${insight.title}</h3>
                                        <div class="insight-confidence">
                                            <span class="confidence-label">Confidence:</span>
                                            <span class="confidence-value">${insight.confidence}%</span>
                                        </div>
                                    </div>
                                    <div class="insight-impact ${insight.impact.toLowerCase()}">
                                        ${insight.impact}
                                    </div>
                                </div>
                                <div class="insight-message">${insight.message}</div>
                                <div class="insight-action">
                                    <strong>Recommended Action:</strong> ${insight.action}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading AI insights:', error);
        }
    }

    async loadAnalytics() {
        try {
            const response = await fetch('/api/analytics?period=monthly');
            const data = await response.json();
            
            const mainContent = document.querySelector('.main-content');
            mainContent.innerHTML = `
                <div class="analytics-page">
                    <div class="page-header">
                        <h2><i class="fas fa-chart-line"></i> Advanced Analytics</h2>
                        <p>Comprehensive business intelligence and performance metrics</p>
                    </div>
                    
                    <div class="analytics-overview">
                        <div class="overview-card">
                            <h3>Total Revenue</h3>
                            <div class="overview-value">UGX ${(data.summary.totalRevenue / 1000000).toFixed(1)}M</div>
                        </div>
                        <div class="overview-card">
                            <h3>Total Profit</h3>
                            <div class="overview-value">UGX ${(data.summary.totalProfit / 1000000).toFixed(1)}M</div>
                        </div>
                        <div class="overview-card">
                            <h3>Average Margin</h3>
                            <div class="overview-value">${data.summary.averageMargin.toFixed(1)}%</div>
                        </div>
                    </div>
                </div>
            `;
            
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }

    async loadAccountability() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="accountability-page">
                <div class="page-header">
                    <h2><i class="fas fa-calculator"></i> Financial Accountability</h2>
                    <p>Comprehensive income and expense tracking</p>
                </div>
                
                <div class="accountability-summary">
                    <div class="summary-card">
                        <h3>Total Income</h3>
                        <div class="summary-value">UGX 2,850,000</div>
                        <div class="summary-trend positive">+15.2%</div>
                    </div>
                    <div class="summary-card">
                        <h3>Total Expenses</h3>
                        <div class="summary-value">UGX 1,850,000</div>
                        <div class="summary-trend negative">+8.7%</div>
                    </div>
                    <div class="summary-card">
                        <h3>Net Profit</h3>
                        <div class="summary-value">UGX 1,000,000</div>
                        <div class="summary-trend positive">+22.1%</div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadTaxes() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="taxes-page">
                <div class="page-header">
                    <h2><i class="fas fa-file-invoice-dollar"></i> Tax Management</h2>
                    <p>Uganda Revenue Authority (URA) compliance and tax calculations</p>
                </div>
                
                <div class="tax-calculator">
                    <h3>Tax Calculator</h3>
                    <form id="tax-form" class="tax-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Gross Sales (UGX)</label>
                                <input type="number" id="gross-sales" placeholder="0" min="0">
                            </div>
                            <div class="form-group">
                                <label>Cost of Goods Sold (UGX)</label>
                                <input type="number" id="cogs-input" placeholder="0" min="0">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Staff Salaries (UGX)</label>
                                <input type="number" id="staff-salaries" placeholder="0" min="0">
                            </div>
                            <div class="form-group">
                                <label>Other Expenses (UGX)</label>
                                <input type="number" id="other-expenses" placeholder="0" min="0">
                            </div>
                        </div>
                        <button type="button" class="btn-primary" onclick="calculateTaxes()">
                            Calculate Taxes
                        </button>
                    </form>
                </div>
                
                <div class="tax-results">
                    <h3>Tax Breakdown</h3>
                    <div class="tax-grid">
                        <div class="tax-card">
                            <h4>Corporate Tax (30%)</h4>
                            <div class="tax-value" id="corporate-tax">UGX 0</div>
                        </div>
                        <div class="tax-card">
                            <h4>VAT (18%)</h4>
                            <div class="tax-value" id="vat-amount">UGX 0</div>
                        </div>
                        <div class="tax-card">
                            <h4>Withholding Tax (6%)</h4>
                            <div class="tax-value" id="withholding-tax">UGX 0</div>
                        </div>
                        <div class="tax-card total">
                            <h4>Total Tax Due</h4>
                            <div class="tax-value" id="total-tax">UGX 0</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadWholesalers() {
        try {
            const response = await fetch('/api/suppliers');
            const data = await response.json();
            
            const mainContent = document.querySelector('.main-content');
            mainContent.innerHTML = `
                <div class="wholesalers-page">
                    <div class="page-header">
                        <h2><i class="fas fa-truck"></i> Supplier Management</h2>
                        <p>Comprehensive supplier tracking and performance analytics</p>
                    </div>
                    
                    <div class="suppliers-grid">
                        ${data.map(supplier => `
                            <div class="supplier-card">
                                <div class="supplier-header">
                                    <h3>${supplier.name}</h3>
                                    <span class="rating">${supplier.rating} ⭐</span>
                                </div>
                                <div class="supplier-details">
                                    <p><strong>Category:</strong> ${supplier.category}</p>
                                    <p><strong>Contact:</strong> ${supplier.contact}</p>
                                    <p><strong>Email:</strong> ${supplier.email}</p>
                                    <p><strong>Total Orders:</strong> ${supplier.totalOrders}</p>
                                    <p><strong>Total Value:</strong> UGX ${(supplier.totalValue / 1000000).toFixed(1)}M</p>
                                    <p><strong>Reliability:</strong> <span class="reliability ${supplier.reliability.toLowerCase()}">${supplier.reliability}</span></p>
                                </div>
                                <div class="supplier-actions">
                                    <button class="btn-secondary">View History</button>
                                    <button class="btn-secondary">Place Order</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading wholesalers:', error);
        }
    }

    async loadAdverts() {
        try {
            const response = await fetch('/api/campaigns');
            const data = await response.json();
            
            const mainContent = document.querySelector('.main-content');
            mainContent.innerHTML = `
                <div class="adverts-page">
                    <div class="page-header">
                        <h2><i class="fas fa-ad"></i> Marketing Campaigns</h2>
                        <p>Campaign performance tracking and ROI analysis</p>
                    </div>
                    
                    <div class="campaigns-overview">
                        <div class="overview-card">
                            <h3>Active Campaigns</h3>
                            <div class="overview-value">${data.filter(c => c.status === 'Active').length}</div>
                        </div>
                        <div class="overview-card">
                            <h3>Total Budget</h3>
                            <div class="overview-value">UGX ${(data.reduce((sum, c) => sum + c.budget, 0) / 1000000).toFixed(1)}M</div>
                        </div>
                        <div class="overview-card">
                            <h3>Average ROAS</h3>
                            <div class="overview-value">${(data.reduce((sum, c) => sum + c.roas, 0) / data.length).toFixed(1)}x</div>
                        </div>
                    </div>
                    
                    <div class="campaigns-grid">
                        ${data.map(campaign => `
                            <div class="campaign-card">
                                <div class="campaign-header">
                                    <h3>${campaign.name}</h3>
                                    <span class="status ${campaign.status.toLowerCase()}">${campaign.status}</span>
                                </div>
                                <div class="campaign-metrics">
                                    <div class="metric">
                                        <span class="metric-label">Budget</span>
                                        <span class="metric-value">UGX ${campaign.budget.toLocaleString()}</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Spent</span>
                                        <span class="metric-value">UGX ${campaign.spent.toLocaleString()}</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">ROAS</span>
                                        <span class="metric-value">${campaign.roas}x</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">CTR</span>
                                        <span class="metric-value">${campaign.ctr}%</span>
                                    </div>
                                </div>
                                <div class="campaign-dates">
                                    <span>${campaign.startDate} - ${campaign.endDate}</span>
                                </div>
                                <div class="campaign-actions">
                                    <button class="btn-action">Edit</button>
                                    <button class="btn-action">Pause</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading adverts:', error);
        }
    }

    getInsightIcon(type) {
        const icons = {
            'opportunity': 'lightbulb',
            'warning': 'exclamation-triangle',
            'success': 'check-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Role-specific page methods
    loadSalesEntry() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="page-header">
                <h2>Sales Entry</h2>
                <p>Enter daily sales transactions and update inventory</p>
            </div>
            
            <div class="sales-entry-content">
                <div class="sales-form-section">
                    <h3>New Sale Transaction</h3>
                    <form class="sales-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Product</label>
                                <select id="product-select" required>
                                    <option value="">Select Product</option>
                                    <option value="1">Rice (25kg) - $45</option>
                                    <option value="2">Sugar (1kg) - $2.50</option>
                                    <option value="3">Cooking Oil (2L) - $8.00</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Quantity</label>
                                <input type="number" id="quantity" min="1" required>
                            </div>
                            <div class="form-group">
                                <label>Unit Price</label>
                                <input type="number" id="unit-price" step="0.01" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Customer Name</label>
                                <input type="text" id="customer-name" placeholder="Walk-in customer">
                            </div>
                            <div class="form-group">
                                <label>Payment Method</label>
                                <select id="payment-method">
                                    <option value="cash">Cash</option>
                                    <option value="mobile-money">Mobile Money</option>
                                    <option value="card">Card</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" class="btn-primary">Complete Sale</button>
                    </form>
                </div>
                
                <div class="today-sales-summary">
                    <h3>Today's Sales Summary</h3>
                    <div class="summary-cards">
                        <div class="summary-card">
                            <span class="summary-value">$1,247</span>
                            <span class="summary-label">Total Sales</span>
                        </div>
                        <div class="summary-card">
                            <span class="summary-value">47</span>
                            <span class="summary-label">Transactions</span>
                        </div>
                        <div class="summary-card">
                            <span class="summary-value">$26.53</span>
                            <span class="summary-label">Average Sale</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadDailySummary() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="page-header">
                <h2>Daily Summary</h2>
                <p>Overview of today's business activities</p>
            </div>
            
            <div class="daily-summary-content">
                <div class="summary-overview">
                    <div class="summary-card large">
                        <h3>Today's Performance</h3>
                        <div class="performance-metrics">
                            <div class="metric">
                                <span class="metric-value">$1,247</span>
                                <span class="metric-label">Revenue</span>
                            </div>
                            <div class="metric>
                                <span class="metric-value">47</span>
                                <span class="metric-label">Sales</span>
                            </div>
                            <div class="metric">
                                <span class="metric-value">$89</span>
                                <span class="metric-label">Profit</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="recent-transactions">
                    <h3>Recent Transactions</h3>
                    <div class="transactions-list">
                        <div class="transaction-item">
                            <div class="transaction-info">
                                <span class="product-name">Rice (25kg)</span>
                                <span class="transaction-time">2:30 PM</span>
                            </div>
                            <div class="transaction-amount">$45.00</div>
                        </div>
                        <div class="transaction-item">
                            <div class="transaction-info">
                                <span class="product-name">Sugar (1kg) x 3</span>
                                <span class="transaction-time">2:15 PM</span>
                            </div>
                            <div class="transaction-amount">$7.50</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadBasicAnalytics() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="page-header">
                <h2>Basic Analytics</h2>
                <p>Simple insights for daily operations</p>
            </div>
            
            <div class="basic-analytics-content">
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <h3>Top Selling Products</h3>
                        <div class="product-ranking">
                            <div class="ranking-item">
                                <span class="rank">1</span>
                                <span class="product-name">Rice (25kg)</span>
                                <span class="sales-count">12 units</span>
                            </div>
                            <div class="ranking-item">
                                <span class="rank">2</span>
                                <span class="product-name">Sugar (1kg)</span>
                                <span class="sales-count">8 units</span>
                            </div>
                            <div class="ranking-item">
                                <span class="rank">3</span>
                                <span class="product-name">Cooking Oil (2L)</span>
                                <span class="sales-count">6 units</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <h3>Hourly Sales Pattern</h3>
                        <div class="hourly-chart">
                            <div class="hour-bar" style="height: 60%">
                                <span class="hour">9AM</span>
                                <span class="sales">$120</span>
                            </div>
                            <div class="hour-bar" style="height: 80%">
                                <span class="hour">10AM</span>
                                <span class="sales">$180</span>
                            </div>
                            <div class="hour-bar" style="height: 100%">
                                <span class="hour">11AM</span>
                                <span class="sales">$220</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadBusinessReports() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="page-header">
                <h2>Business Reports</h2>
                <p>Comprehensive business intelligence for managers</p>
            </div>
            
            <div class="business-reports-content">
                <div class="reports-grid">
                    <div class="report-card">
                        <h3>Monthly Performance Report</h3>
                        <div class="report-metrics">
                            <div class="metric">
                                <span class="metric-value">$45,230</span>
                                <span class="metric-label">Total Revenue</span>
                            </div>
                            <div class="metric">
                                <span class="metric-value">$8,450</span>
                                <span class="metric-label">Net Profit</span>
                            </div>
                            <div class="metric">
                                <span class="metric-value">+12.5%</span>
                                <span class="metric-label">Growth</span>
                            </div>
                        </div>
                        <button class="btn-secondary">Download Report</button>
                    </div>
                    
                    <div class="report-card">
                        <h3>Inventory Analysis</h3>
                        <div class="inventory-insights">
                            <div class="insight">
                                <i class="fas fa-exclamation-triangle"></i>
                                <span>5 products need restocking</span>
                            </div>
                            <div class="insight">
                                <i class="fas fa-chart-line"></i>
                                <span>Inventory turnover: 2.3x</span>
                            </div>
                        </div>
                        <button class="btn-secondary">View Details</button>
                    </div>
                </div>
            </div>
        `;
    }

    loadUsers() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="page-header">
                <h2>User Management</h2>
                <p>Manage system users and permissions</p>
            </div>
            
            <div class="users-content">
                <div class="users-grid">
                    <div class="user-card admin">
                        <div class="user-avatar">👑</div>
                        <div class="user-info">
                            <h3>John Doe</h3>
                            <span class="user-role">Administrator</span>
                            <span class="user-email">john@shopanalyser.com</span>
                        </div>
                        <div class="user-actions">
                            <button class="btn-secondary">Edit</button>
                            <button class="btn-secondary">Permissions</button>
                        </div>
                    </div>
                    
                    <div class="user-card manager">
                        <div class="user-avatar">👔</div>
                        <div class="user-info">
                            <h3>Sarah Smith</h3>
                            <span class="user-role">Manager</span>
                            <span class="user-email">sarah@shopanalyser.com</span>
                        </div>
                        <div class="user-actions">
                            <button class="btn-secondary">Edit</button>
                            <button class="btn-secondary">Permissions</button>
                        </div>
                    </div>
                    
                    <div class="user-card cashier">
                        <div class="user-avatar">💼</div>
                        <div class="user-info">
                            <h3>Mike Johnson</h3>
                            <span class="user-role">Cashier</span>
                            <span class="user-email">mike@shopanalyser.com</span>
                        </div>
                        <div class="user-actions">
                            <button class="btn-secondary">Edit</button>
                            <button class="btn-secondary">Permissions</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadSettings() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="page-header">
                <h2>System Settings</h2>
                <p>Configure system preferences and security</p>
            </div>
            
            <div class="settings-content">
                <div class="settings-grid">
                    <div class="setting-card">
                        <h3>General Settings</h3>
                        <div class="setting-item">
                            <label>Company Name</label>
                            <input type="text" value="Shop Analyser Enterprise" class="setting-input">
                        </div>
                        <div class="setting-item">
                            <label>Currency</label>
                            <select class="setting-input">
                                <option value="UGX">Uganda Shilling (UGX)</option>
                                <option value="USD">US Dollar (USD)</option>
                                <option value="EUR">Euro (EUR)</option>
                            </select>
                        </div>
                        <button class="btn-primary">Save Changes</button>
                    </div>
                    
                    <div class="setting-card">
                        <h3>Security Settings</h3>
                        <div class="setting-item">
                            <label>Session Timeout (minutes)</label>
                            <input type="number" value="30" class="setting-input">
                        </div>
                        <div class="setting-item">
                            <label>Two-Factor Authentication</label>
                            <input type="checkbox" class="setting-checkbox">
                        </div>
                        <button class="btn-primary">Save Changes</button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Global functions
window.toggleUserMenu = function() {
    const dropdown = document.getElementById('user-menu-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
};

window.showProfile = function() {
    // TODO: Implement profile view
    console.log('Show profile clicked');
};

window.showPreferences = function() {
    // TODO: Implement preferences view
    console.log('Show preferences clicked');
};

window.showHelp = function() {
    // TODO: Implement help view
    console.log('Show help clicked');
};

window.closeNotifications = function() {
    const panel = document.getElementById('notifications-panel');
    if (panel) {
        panel.classList.add('hidden');
    }
};

window.showNotifications = function() {
    const panel = document.getElementById('notifications-panel');
    if (panel) {
        panel.classList.toggle('hidden');
    }
};

window.showHelp = function() {
    // TODO: Implement help view
    console.log('Show help clicked');
};

window.exportData = function() {
    // TODO: Implement data export
    console.log('Export data clicked');
};

// Global function to ensure logout button is always visible
window.forceLogoutButtonVisible = function() {
    const logoutBtn = document.getElementById('permanent-logout-btn');
    if (logoutBtn) {
        logoutBtn.style.display = 'flex !important';
        logoutBtn.style.visibility = 'visible !important';
        logoutBtn.style.opacity = '1 !important';
        logoutBtn.style.position = 'relative !important';
        logoutBtn.style.zIndex = '9999 !important';
        logoutBtn.classList.remove('hidden', 'invisible', 'd-none');
        
        // Also ensure the parent container is visible
        const headerCenter = logoutBtn.closest('.header-center');
        if (headerCenter) {
            headerCenter.style.display = 'flex !important';
            headerCenter.style.visibility = 'visible !important';
        }
    }
};

// Override any attempts to hide the logout button
Object.defineProperty(HTMLElement.prototype, 'style', {
    set: function(value) {
        if (this.id === 'permanent-logout-btn' && value.display === 'none') {
            console.log('🚫 Attempted to hide logout button - BLOCKED!');
            return;
        }
        // Call the original setter
        Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'style').set.call(this, value);
    }
});

window.calculateTaxes = function() {
    const grossSales = parseFloat(document.getElementById('gross-sales').value) || 0;
    const cogs = parseFloat(document.getElementById('cogs-input').value) || 0;
    const staffSalaries = parseFloat(document.getElementById('staff-salaries').value) || 0;
    const otherExpenses = parseFloat(document.getElementById('other-expenses').value) || 0;
    
    // Calculate net profit
    const netProfit = grossSales - cogs - staffSalaries - otherExpenses;
    
    // Calculate taxes (Uganda rates)
    const corporateTax = Math.max(0, netProfit * 0.30); // 30% corporate tax
    const vatAmount = grossSales * 0.18; // 18% VAT
    const withholdingTax = grossSales * 0.06; // 6% withholding tax
    
    const totalTax = corporateTax + vatAmount + withholdingTax;
    
    // Update display
    document.getElementById('corporate-tax').textContent = `UGX ${corporateTax.toLocaleString()}`;
    document.getElementById('vat-amount').textContent = `UGX ${vatAmount.toLocaleString()}`;
    document.getElementById('withholding-tax').textContent = `UGX ${withholdingTax.toLocaleString()}`;
    document.getElementById('total-tax').textContent = `UGX ${totalTax.toLocaleString()}`;
    
    // Show success message
    if (window.authSystem) {
        window.authSystem.showSuccess('Tax calculation completed successfully!');
    }
};

// Authentication functions
window.logout = function() {
    console.log('🔴 Logout button clicked!');
    if (window.authSystem) {
        console.log('✅ AuthSystem found, logging out...');
        window.authSystem.logout();
    } else {
        console.error('❌ AuthSystem not found!');
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.shopAnalyser = new ShopAnalyserApp();
});
