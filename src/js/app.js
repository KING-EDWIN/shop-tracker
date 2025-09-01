// Main Application Controller - Next.js-like SPA
class ShopAnalyserApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.dashboard = null;
        this.analytics = null;
        this.products = [];
        this.init();
    }

    async init() {
        console.log("🚀 Shop Analyser is initializing...");
        
        // Load initial data
        await this.loadData();
        
        // Setup navigation
        this.setupNavigation();
        
        // Setup theme toggle
        this.setupThemeToggle();
        
        // Load default page
        await this.loadPage('dashboard');
        
        console.log("✅ Shop Analyser initialized successfully!");
    }

    async loadData() {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.products = await response.json();
            console.log(`📊 Loaded ${this.products.length} products`);
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = [];
            // Show user-friendly error message
            this.showErrorMessage('Failed to load product data. Please refresh the page.');
        }
    }

    showErrorMessage(message) {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h2>Connection Error</h2>
                    <p>${message}</p>
                    <button class="btn-primary" onclick="location.reload()">
                        <i class="fas fa-refresh"></i> Refresh Page
                    </button>
                </div>
            `;
        }
    }

    setupNavigation() {
        // Handle sidebar navigation
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
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

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const icon = themeToggle.querySelector('i');
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
            });
        }
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
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current page
        const activeLink = document.querySelector(`[data-page="${activePage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    async loadPage(page, updateHistory = true) {
        console.log(`📄 Loading page: ${page}`);
        
        this.currentPage = page;
        
        // Show loading state
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                    <p>Loading ${page}...</p>
                </div>
            `;
        }
            
            // Update page title
            const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            const titles = {
                'dashboard': 'Dashboard',
                'products': 'Add Products',
                'ai-insights': 'AI Insights',
                'analytics': 'Analytics',
                'accountability': 'My Accountability',
                'taxes': 'Manage Taxes',
                'wholesalers': 'Add Wholesalers',
                'adverts': 'My Adverts'
            };
            pageTitle.textContent = titles[page] || 'Dashboard';
        }

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
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <!-- Dashboard Content -->
            <div class="dashboard-content">
                <!-- KPI Cards -->
                <div class="kpi-grid">
                    <div class="kpi-card revenue">
                        <div class="kpi-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="kpi-content">
                            <h3>Total Revenue</h3>
                            <div class="kpi-value" id="total-revenue">UGX 0</div>
                            <div class="kpi-trend positive" id="revenue-trend">
                                <i class="fas fa-arrow-up"></i> +12.5%
                            </div>
                        </div>
                    </div>
                    
                    <div class="kpi-card profit">
                        <div class="kpi-icon">
                            <i class="fas fa-coins"></i>
                        </div>
                        <div class="kpi-content">
                            <h3>Net Profit</h3>
                            <div class="kpi-value" id="net-profit">UGX 0</div>
                            <div class="kpi-trend positive" id="profit-trend">
                                <i class="fas fa-arrow-up"></i> +8.3%
                            </div>
                        </div>
                    </div>
                    
                    <div class="kpi-card products">
                        <div class="kpi-icon">
                            <i class="fas fa-box"></i>
                        </div>
                        <div class="kpi-content">
                            <h3>Active Products</h3>
                            <div class="kpi-value" id="active-products">0</div>
                            <div class="kpi-trend neutral" id="products-trend">
                                <i class="fas fa-minus"></i> 0%
                            </div>
                        </div>
                    </div>
                    
                    <div class="kpi-card margin">
                        <div class="kpi-icon">
                            <i class="fas fa-percentage"></i>
                        </div>
                        <div class="kpi-content">
                            <h3>Profit Margin</h3>
                            <div class="kpi-value" id="profit-margin">0%</div>
                            <div class="kpi-trend positive" id="margin-trend">
                                <i class="fas fa-arrow-up"></i> +2.1%
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="charts-section">
                    <div class="chart-container main-chart">
                        <div class="chart-header">
                            <h3><i class="fas fa-chart-bar"></i> Sales Performance</h3>
                            <div class="chart-controls">
                                <select id="chart-type" class="chart-select">
                                    <option value="revenue">Revenue</option>
                                    <option value="profit">Profit</option>
                                    <option value="units">Units Sold</option>
                                </select>
                                <div class="time-controls">
                                    <button class="btn-control active" data-time="day">Day</button>
                                    <button class="btn-control" data-time="week">Week</button>
                                    <button class="btn-control" data-time="month">Month</button>
                                    <button class="btn-control" data-time="year">Year</button>
                                </div>
                            </div>
                        </div>
                        <canvas id="profitChart"></canvas>
                    </div>
                    
                    <div class="chart-container category-chart">
                        <div class="chart-header">
                            <h3><i class="fas fa-pie-chart"></i> Category Performance</h3>
                        </div>
                        <canvas id="categoryChart"></canvas>
                    </div>
                </div>

                <!-- AI Insights and Top Products -->
                <div class="insights-section">
                    <div class="ai-messages">
                        <div class="section-header">
                            <h2><i class="fas fa-robot"></i> AI Business Insights</h2>
                            <button class="btn-primary" id="refresh-ai">
                                <i class="fas fa-sync-alt"></i> Refresh
                            </button>
                        </div>
                        <div class="message-list" id="ai-messages">
                            <!-- AI messages will be inserted here -->
                        </div>
                    </div>

                    <div class="top-products">
                        <div class="section-header">
                            <h2><i class="fas fa-trophy"></i> Top Performers</h2>
                            <div class="sort-controls">
                                <button class="btn-control active" data-sort="profit-high">Highest Profit</button>
                                <button class="btn-control" data-sort="revenue-high">Highest Revenue</button>
                                <button class="btn-control" data-sort="units-high">Most Sold</button>
                            </div>
                        </div>
                        <div id="top-products-list" class="top-products-grid">
                            <!-- Top products will be inserted here -->
                        </div>
                    </div>
                </div>

                <!-- Inventory Alerts -->
                <div class="alerts-section">
                    <div class="alert-card low-stock">
                        <div class="alert-header">
                            <h3><i class="fas fa-exclamation-triangle"></i> Low Stock Alert</h3>
                            <span class="alert-count" id="low-stock-count">0</span>
                        </div>
                        <div id="low-stock-items" class="alert-items">
                            <!-- Low stock items will be inserted here -->
                        </div>
                    </div>
                    
                    <div class="alert-card slow-moving">
                        <div class="alert-header">
                            <h3><i class="fas fa-clock"></i> Slow Moving Items</h3>
                            <span class="alert-count" id="slow-moving-count">0</span>
                        </div>
                        <div id="slow-moving-items" class="alert-items">
                            <!-- Slow moving items will be inserted here -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Initialize dashboard components
        await this.initializeDashboard();
    }

    async initializeDashboard() {
        try {
            // Import and initialize enhanced dashboard
            const { initializeEnhancedDashboard } = await import('./enhancedDashboard.js');
            this.dashboard = await initializeEnhancedDashboard();
            
            // Initialize AI messages
        const { initializeAiMessages } = await import('./aiMessages.js');
            initializeAiMessages();
            
            console.log("✅ Dashboard initialized successfully");
        } catch (error) {
            console.error("Error initializing dashboard:", error);
        }
    }

    async loadProducts() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="page-content">
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-box"></i> Add New Product</h2>
                    </div>
                    <div class="card-body">
                        <form id="product-form" class="modern-form">
                            <div class="form-group">
                                <label><i class="fas fa-image"></i> Product Photo</label>
                                <input type="file" id="product-photo" accept="image/*">
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-tag"></i> Product Name</label>
                                <input type="text" id="product-name" required placeholder="Enter product name">
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-list"></i> Category</label>
                                <select id="product-category" required>
                                    <option value="">Select Category</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Footwear">Footwear</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Children">Children's Items</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Home & Garden">Home & Garden</option>
                                    <option value="Health & Beauty">Health & Beauty</option>
                                    <option value="Sports & Outdoors">Sports & Outdoors</option>
                                    <option value="Books & Media">Books & Media</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label><i class="fas fa-money-bill"></i> Wholesale Cost (UGX)</label>
                                    <input type="number" id="wholesale-cost" required placeholder="0" min="0">
                                </div>
                                <div class="form-group">
                                    <label><i class="fas fa-tag"></i> Retail Cost (UGX)</label>
                                    <input type="number" id="retail-cost" required placeholder="0" min="0">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label><i class="fas fa-boxes"></i> Current Stock</label>
                                    <input type="number" id="current-stock" required placeholder="0" min="0">
                                </div>
                                <div class="form-group">
                                    <label><i class="fas fa-sort-numeric-up"></i> Quantity Sold</label>
                                    <input type="number" id="quantity-sold" required placeholder="0" min="0">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label><i class="fas fa-barcode"></i> SKU/Barcode</label>
                                    <input type="text" id="product-sku" placeholder="Optional">
                                </div>
                                <div class="form-group">
                                    <label><i class="fas fa-warehouse"></i> Supplier</label>
                                    <input type="text" id="supplier" placeholder="Supplier name">
                                </div>
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-info-circle"></i> Description</label>
                                <textarea id="product-description" rows="3" placeholder="Product description (optional)"></textarea>
                            </div>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-plus"></i> Add Product
                            </button>
                        </form>
                    </div>
                </div>
                <div class="card mt-4">
                    <div class="card-header">
                        <h2><i class="fas fa-list"></i> Product List</h2>
                    </div>
                    <div class="card-body">
                        <div id="product-list" class="grid-list"></div>
                    </div>
                </div>
            </div>
        `;

        // Initialize product manager
        await this.initializeProductManager();
    }

    async initializeProductManager() {
        try {
            const { initializeProductManager } = await import('./productManager.js');
            await initializeProductManager();
            
            // Add form submission handler
            const form = document.getElementById('product-form');
            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await this.handleProductSubmission();
                });
            }
            
            console.log("✅ Product manager initialized");
        } catch (error) {
            console.error("Error initializing product manager:", error);
        }
    }

    async handleProductSubmission() {
        try {
            const formData = {
                name: document.getElementById('product-name').value.trim(),
                category: document.getElementById('product-category').value,
                wholesaleCost: Number(document.getElementById('wholesale-cost').value),
                retailCost: Number(document.getElementById('retail-cost').value),
                currentStock: Number(document.getElementById('current-stock').value),
                quantitySold: Number(document.getElementById('quantity-sold').value),
                sku: document.getElementById('product-sku').value.trim(),
                supplier: document.getElementById('supplier').value.trim(),
                description: document.getElementById('product-description').value.trim()
            };

            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Product added successfully!');
                document.getElementById('product-form').reset();
                // Refresh the product list
                const { initializeProductManager } = await import('./productManager.js');
                await initializeProductManager();
            } else {
                throw new Error('Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error adding product. Please try again.');
        }
    }

    async loadAIInsights() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="page-content">
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-robot"></i> AI Business Assistant</h2>
                    </div>
                    <div class="card-body">
                        <div class="ai-chat-container">
                            <div class="ai-question-box">
                                <input type="text" id="ai-question-input" placeholder="Ask the AI about your business..." style="width:70%;padding:0.75rem;margin-right:0.5rem;border:1px solid #ddd;border-radius:8px;">
                                <button id="ai-question-btn" class="btn-primary"><i class="fas fa-paper-plane"></i> Ask</button>
                            </div>
                            <div id="ai-answer" class="ai-answer-box" style="margin-top:1rem; min-height:48px; background:var(--white); border-radius:8px; box-shadow:var(--shadow); padding:1rem; font-size:1.1em; color:var(--gray-800);"></div>
                        </div>
                        <div class="message-list" id="ai-messages">
                            <!-- AI messages will be inserted here -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Initialize AI messages
        try {
            const { initializeAiMessages } = await import('./aiMessages.js');
        initializeAiMessages();
            console.log("✅ AI insights initialized");
        } catch (error) {
            console.error("Error initializing AI insights:", error);
        }
    }

    async loadAnalytics() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-chart-line"></i> Advanced Analytics</h1>
                    <div class="header-actions">
                        <button class="btn-primary" onclick="exportReport()">
                            <i class="fas fa-download"></i> Export Report
                        </button>
                        <button class="btn-primary" onclick="printReport()">
                            <i class="fas fa-print"></i> Print
                        </button>
                    </div>
                </div>

                <!-- Analytics Filters -->
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-filter"></i> Analytics Filters</h2>
                    </div>
                    <div class="card-body">
                        <div class="filters-grid">
                            <div class="filter-group">
                                <label>Date Range</label>
                                <select id="date-range">
                                    <option value="7">Last 7 Days</option>
                                    <option value="30" selected>Last 30 Days</option>
                                    <option value="90">Last 90 Days</option>
                                    <option value="365">Last Year</option>
                                </select>
                            </div>
                            <div class="filter-group">
                                <label>Category</label>
                                <select id="category-filter">
                                    <option value="">All Categories</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Footwear">Footwear</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Children">Children's Items</option>
                                    <option value="Electronics">Electronics</option>
                                </select>
                            </div>
                            <div class="filter-group">
                                <label>Metric</label>
                                <select id="metric-filter">
                                    <option value="revenue">Revenue</option>
                                    <option value="profit">Profit</option>
                                    <option value="units">Units Sold</option>
                                    <option value="margin">Profit Margin</option>
                                </select>
                            </div>
                            <div class="filter-group">
                                <button class="btn-primary" onclick="applyFilters()">
                                    <i class="fas fa-search"></i> Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Key Metrics -->
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-icon revenue">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="metric-content">
                            <h3>Total Revenue</h3>
                            <div class="metric-value" id="total-revenue-metric">UGX 0</div>
                            <div class="metric-change positive" id="revenue-change">+0%</div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-icon profit">
                            <i class="fas fa-coins"></i>
                        </div>
                        <div class="metric-content">
                            <h3>Net Profit</h3>
                            <div class="metric-value" id="net-profit-metric">UGX 0</div>
                            <div class="metric-change positive" id="profit-change">+0%</div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-icon margin">
                            <i class="fas fa-percentage"></i>
                        </div>
                        <div class="metric-content">
                            <h3>Profit Margin</h3>
                            <div class="metric-value" id="profit-margin-metric">0%</div>
                            <div class="metric-change positive" id="margin-change">+0%</div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-icon units">
                            <i class="fas fa-box"></i>
                        </div>
                        <div class="metric-content">
                            <h3>Units Sold</h3>
                            <div class="metric-value" id="units-sold-metric">0</div>
                            <div class="metric-change positive" id="units-change">+0%</div>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="charts-grid">
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3><i class="fas fa-chart-area"></i> Revenue Trend</h3>
                            <div class="chart-controls">
                                <button class="btn-control active" data-chart="line">Line</button>
                                <button class="btn-control" data-chart="bar">Bar</button>
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas id="revenueChart"></canvas>
                        </div>
                    </div>
                    
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3><i class="fas fa-chart-pie"></i> Category Distribution</h3>
                        </div>
                        <div class="chart-container">
                            <canvas id="categoryChart"></canvas>
                        </div>
                    </div>
                    
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3><i class="fas fa-chart-bar"></i> Top Products</h3>
                        </div>
                        <div class="chart-container">
                            <canvas id="topProductsChart"></canvas>
                        </div>
                    </div>
                    
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3><i class="fas fa-chart-line"></i> Profit Analysis</h3>
                        </div>
                        <div class="chart-container">
                            <canvas id="profitAnalysisChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Detailed Reports -->
                <div class="reports-section">
                    <div class="card">
                        <div class="card-header">
                            <h2><i class="fas fa-table"></i> Detailed Product Analysis</h2>
                        </div>
                        <div class="card-body">
                            <div class="table-container">
                                <table class="analytics-table" id="product-analysis-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Category</th>
                                            <th>Revenue</th>
                                            <th>Profit</th>
                                            <th>Margin</th>
                                            <th>Units Sold</th>
                                            <th>Stock</th>
                                            <th>Performance</th>
                                        </tr>
                                    </thead>
                                    <tbody id="product-analysis-body">
                                        <!-- Data will be populated by JavaScript -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Insights and Recommendations -->
                <div class="insights-section">
                    <div class="card">
                        <div class="card-header">
                            <h2><i class="fas fa-lightbulb"></i> Business Insights</h2>
                        </div>
                        <div class="card-body">
                            <div id="business-insights" class="insights-grid">
                                <!-- Insights will be populated by JavaScript -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Initialize analytics
        try {
            const { initializeAnalytics } = await import('./analytics.js');
            this.analytics = await initializeAnalytics();
            console.log("✅ Analytics initialized");
        } catch (error) {
            console.error("Error initializing analytics:", error);
        }
    }

    async loadAccountability() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-chart-line"></i> Financial Accountability</h1>
                    <div class="header-actions">
                        <button class="btn-primary" onclick="printAccountabilityReport()">
                            <i class="fas fa-print"></i> Print Report
                        </button>
                        <button class="btn-primary" onclick="exportAccountabilityData()">
                            <i class="fas fa-download"></i> Export Data
                        </button>
                    </div>
                </div>

                <!-- Financial Summary Cards -->
                <div class="accountability-summary">
                    <div class="summary-card income">
                        <div class="summary-icon">
                            <i class="fas fa-arrow-up"></i>
                        </div>
                        <div class="summary-content">
                            <h3>Total Income</h3>
                            <div class="summary-value" id="total-income">UGX 0</div>
                            <div class="summary-period">This Month</div>
                        </div>
                    </div>
                    
                    <div class="summary-card expenses">
                        <div class="summary-icon">
                            <i class="fas fa-arrow-down"></i>
                        </div>
                        <div class="summary-content">
                            <h3>Total Expenses</h3>
                            <div class="summary-value" id="total-expenses">UGX 0</div>
                            <div class="summary-period">This Month</div>
                        </div>
                    </div>
                    
                    <div class="summary-card profit">
                        <div class="summary-icon">
                            <i class="fas fa-coins"></i>
                        </div>
                        <div class="summary-content">
                            <h3>Net Profit</h3>
                            <div class="summary-value" id="net-profit-accountability">UGX 0</div>
                            <div class="summary-period">This Month</div>
                        </div>
                    </div>
                    
                    <div class="summary-card margin">
                        <div class="summary-icon">
                            <i class="fas fa-percentage"></i>
                        </div>
                        <div class="summary-content">
                            <h3>Profit Margin</h3>
                            <div class="summary-value" id="profit-margin-accountability">0%</div>
                            <div class="summary-period">This Month</div>
                        </div>
                    </div>
                </div>

                <!-- Expense Tracking -->
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-receipt"></i> Expense Tracking</h2>
                        <button class="btn-primary" onclick="showAddExpenseModal()">
                            <i class="fas fa-plus"></i> Add Expense
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="expense-categories">
                            <div class="category-item">
                                <div class="category-header">
                                    <h4><i class="fas fa-bolt"></i> Utilities</h4>
                                    <span class="category-amount" id="utilities-amount">UGX 0</span>
                                </div>
                                <div class="category-breakdown" id="utilities-breakdown">
                                    <!-- Utilities expenses will be listed here -->
                                </div>
                            </div>
                            
                            <div class="category-item">
                                <div class="category-header">
                                    <h4><i class="fas fa-truck"></i> Transportation</h4>
                                    <span class="category-amount" id="transport-amount">UGX 0</span>
                                </div>
                                <div class="category-breakdown" id="transport-breakdown">
                                    <!-- Transportation expenses will be listed here -->
                                </div>
                            </div>
                            
                            <div class="category-item">
                                <div class="category-header">
                                    <h4><i class="fas fa-bullhorn"></i> Marketing</h4>
                                    <span class="category-amount" id="marketing-amount">UGX 0</span>
                                </div>
                                <div class="category-breakdown" id="marketing-breakdown">
                                    <!-- Marketing expenses will be listed here -->
                                </div>
                            </div>
                            
                            <div class="category-item">
                                <div class="category-header">
                                    <h4><i class="fas fa-tools"></i> Maintenance</h4>
                                    <span class="category-amount" id="maintenance-amount">UGX 0</span>
                                </div>
                                <div class="category-breakdown" id="maintenance-breakdown">
                                    <!-- Maintenance expenses will be listed here -->
                                </div>
                            </div>
                            
                            <div class="category-item">
                                <div class="category-header">
                                    <h4><i class="fas fa-users"></i> Staff</h4>
                                    <span class="category-amount" id="staff-amount">UGX 0</span>
                                </div>
                                <div class="category-breakdown" id="staff-breakdown">
                                    <!-- Staff expenses will be listed here -->
                                </div>
                            </div>
                            
                            <div class="category-item">
                                <div class="category-header">
                                    <h4><i class="fas fa-ellipsis-h"></i> Other</h4>
                                    <span class="category-amount" id="other-amount">UGX 0</span>
                                </div>
                                <div class="category-breakdown" id="other-breakdown">
                                    <!-- Other expenses will be listed here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Financial Charts -->
                <div class="charts-section">
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3><i class="fas fa-chart-pie"></i> Expense Breakdown</h3>
                        </div>
                        <div class="chart-container">
                            <canvas id="expenseChart"></canvas>
                        </div>
                    </div>
                    
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3><i class="fas fa-chart-line"></i> Income vs Expenses</h3>
                        </div>
                        <div class="chart-container">
                            <canvas id="incomeExpenseChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Monthly Report -->
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-calendar-alt"></i> Monthly Financial Report</h2>
                    </div>
                    <div class="card-body">
                        <div class="monthly-report">
                            <div class="report-section">
                                <h4>Revenue Analysis</h4>
                                <div class="report-item">
                                    <span>Total Sales Revenue:</span>
                                    <span id="total-sales-revenue">UGX 0</span>
                                </div>
                                <div class="report-item">
                                    <span>Average Daily Revenue:</span>
                                    <span id="avg-daily-revenue">UGX 0</span>
                                </div>
                                <div class="report-item">
                                    <span>Best Selling Day:</span>
                                    <span id="best-selling-day">N/A</span>
                                </div>
                            </div>
                            
                            <div class="report-section">
                                <h4>Cost Analysis</h4>
                                <div class="report-item">
                                    <span>Cost of Goods Sold:</span>
                                    <span id="cogs">UGX 0</span>
                                </div>
                                <div class="report-item">
                                    <span>Operating Expenses:</span>
                                    <span id="operating-expenses">UGX 0</span>
                                </div>
                                <div class="report-item">
                                    <span>Total Expenses:</span>
                                    <span id="total-expenses-report">UGX 0</span>
                                </div>
                            </div>
                            
                            <div class="report-section">
                                <h4>Profitability</h4>
                                <div class="report-item">
                                    <span>Gross Profit:</span>
                                    <span id="gross-profit">UGX 0</span>
                                </div>
                                <div class="report-item">
                                    <span>Net Profit:</span>
                                    <span id="net-profit-report">UGX 0</span>
                                </div>
                                <div class="report-item">
                                    <span>Profit Margin:</span>
                                    <span id="profit-margin-report">0%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Initialize accountability features
        await this.initializeAccountability();
    }

    async initializeAccountability() {
        try {
            // Calculate financial data from products
            const totalRevenue = this.products.reduce((sum, p) => sum + (p.retailCost * p.quantitySold), 0);
            const totalCost = this.products.reduce((sum, p) => sum + (p.wholesaleCost * p.quantitySold), 0);
            const netProfit = totalRevenue - totalCost;
            const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

            // Update summary cards
            document.getElementById('total-income').textContent = `UGX ${totalRevenue.toLocaleString()}`;
            document.getElementById('total-expenses').textContent = `UGX ${totalCost.toLocaleString()}`;
            document.getElementById('net-profit-accountability').textContent = `UGX ${netProfit.toLocaleString()}`;
            document.getElementById('profit-margin-accountability').textContent = `${profitMargin.toFixed(1)}%`;

            // Simulate expense data
            this.loadExpenseData();
            this.loadMonthlyReport();
            this.initializeAccountabilityCharts();
            
            console.log("✅ Accountability initialized");
        } catch (error) {
            console.error("Error initializing accountability:", error);
        }
    }

    loadExpenseData() {
        // Simulate expense data
        const expenses = {
            utilities: [
                { name: 'Electricity Bill', amount: 150000, date: '2024-01-15' },
                { name: 'Water Bill', amount: 45000, date: '2024-01-10' },
                { name: 'Internet', amount: 80000, date: '2024-01-05' }
            ],
            transport: [
                { name: 'Fuel', amount: 200000, date: '2024-01-20' },
                { name: 'Vehicle Maintenance', amount: 120000, date: '2024-01-12' }
            ],
            marketing: [
                { name: 'Facebook Ads', amount: 100000, date: '2024-01-18' },
                { name: 'Print Materials', amount: 50000, date: '2024-01-08' }
            ],
            maintenance: [
                { name: 'Shop Repairs', amount: 80000, date: '2024-01-14' },
                { name: 'Equipment', amount: 150000, date: '2024-01-06' }
            ],
            staff: [
                { name: 'Salaries', amount: 500000, date: '2024-01-31' },
                { name: 'Bonuses', amount: 100000, date: '2024-01-25' }
            ],
            other: [
                { name: 'Insurance', amount: 75000, date: '2024-01-01' },
                { name: 'Bank Charges', amount: 25000, date: '2024-01-15' }
            ]
        };

        // Update expense categories
        Object.entries(expenses).forEach(([category, items]) => {
            const total = items.reduce((sum, item) => sum + item.amount, 0);
            document.getElementById(`${category}-amount`).textContent = `UGX ${total.toLocaleString()}`;
            
            const breakdown = document.getElementById(`${category}-breakdown`);
            breakdown.innerHTML = items.map(item => `
                <div class="expense-item">
                    <span class="expense-name">${item.name}</span>
                    <span class="expense-amount">UGX ${item.amount.toLocaleString()}</span>
                    <span class="expense-date">${item.date}</span>
                </div>
            `).join('');
        });
    }

    loadMonthlyReport() {
        const totalRevenue = this.products.reduce((sum, p) => sum + (p.retailCost * p.quantitySold), 0);
        const totalCost = this.products.reduce((sum, p) => sum + (p.wholesaleCost * p.quantitySold), 0);
        const netProfit = totalRevenue - totalCost;
        const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

        // Update report values
        document.getElementById('total-sales-revenue').textContent = `UGX ${totalRevenue.toLocaleString()}`;
        document.getElementById('avg-daily-revenue').textContent = `UGX ${Math.round(totalRevenue / 30).toLocaleString()}`;
        document.getElementById('best-selling-day').textContent = 'Monday';
        document.getElementById('cogs').textContent = `UGX ${totalCost.toLocaleString()}`;
        document.getElementById('operating-expenses').textContent = 'UGX 1,200,000';
        document.getElementById('total-expenses-report').textContent = `UGX ${(totalCost + 1200000).toLocaleString()}`;
        document.getElementById('gross-profit').textContent = `UGX ${netProfit.toLocaleString()}`;
        document.getElementById('net-profit-report').textContent = `UGX ${(netProfit - 1200000).toLocaleString()}`;
        document.getElementById('profit-margin-report').textContent = `${profitMargin.toFixed(1)}%`;
    }

    initializeAccountabilityCharts() {
        // Initialize expense pie chart
        const expenseCtx = document.getElementById('expenseChart');
        if (expenseCtx) {
            new Chart(expenseCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Utilities', 'Transport', 'Marketing', 'Maintenance', 'Staff', 'Other'],
                    datasets: [{
                        data: [275000, 320000, 150000, 230000, 600000, 100000],
                        backgroundColor: [
                            '#FF7F2A',
                            '#1E90FF',
                            '#32CD32',
                            '#FFD700',
                            '#FF69B4',
                            '#9370DB'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Initialize income vs expense chart
        const incomeExpenseCtx = document.getElementById('incomeExpenseChart');
        if (incomeExpenseCtx) {
            const totalRevenue = this.products.reduce((sum, p) => sum + (p.retailCost * p.quantitySold), 0);
            new Chart(incomeExpenseCtx, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Income',
                        data: [totalRevenue * 0.2, totalRevenue * 0.3, totalRevenue * 0.25, totalRevenue * 0.25],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true
                    }, {
                        label: 'Expenses',
                        data: [400000, 450000, 380000, 420000],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return `UGX ${value.toLocaleString()}`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    async loadTaxes() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-receipt"></i> Tax Management</h1>
                    <div class="header-actions">
                        <button class="btn-primary" onclick="generateTaxReport()">
                            <i class="fas fa-file-alt"></i> Generate Report
                        </button>
                        <button class="btn-primary" onclick="printTaxReport()">
                            <i class="fas fa-print"></i> Print for URA
                        </button>
                    </div>
                </div>

                <!-- Tax Summary -->
                <div class="tax-summary">
                    <div class="tax-card corporate">
                        <div class="tax-icon">
                            <i class="fas fa-building"></i>
                        </div>
                        <div class="tax-content">
                            <h3>Corporate Tax</h3>
                            <div class="tax-amount" id="corporate-tax">UGX 0</div>
                            <div class="tax-rate">30% of Net Profit</div>
                        </div>
                    </div>
                    
                    <div class="tax-card vat">
                        <div class="tax-icon">
                            <i class="fas fa-percentage"></i>
                        </div>
                        <div class="tax-content">
                            <h3>VAT (18%)</h3>
                            <div class="tax-amount" id="vat-amount">UGX 0</div>
                            <div class="tax-rate">18% of Sales</div>
                        </div>
                    </div>
                    
                    <div class="tax-card withholding">
                        <div class="tax-icon">
                            <i class="fas fa-hand-holding-usd"></i>
                        </div>
                        <div class="tax-content">
                            <h3>Withholding Tax</h3>
                            <div class="tax-amount" id="withholding-tax">UGX 0</div>
                            <div class="tax-rate">6% of Payments</div>
                        </div>
                    </div>
                    
                    <div class="tax-card total">
                        <div class="tax-icon">
                            <i class="fas fa-calculator"></i>
                        </div>
                        <div class="tax-content">
                            <h3>Total Tax Due</h3>
                            <div class="tax-amount" id="total-tax">UGX 0</div>
                            <div class="tax-rate">Monthly Total</div>
                        </div>
                    </div>
                </div>

                <!-- Tax Calculator -->
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-calculator"></i> Tax Calculator</h2>
                    </div>
                    <div class="card-body">
                        <div class="tax-calculator">
                            <div class="calculator-section">
                                <h4>Business Information</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Annual Turnover (UGX)</label>
                                        <input type="number" id="annual-turnover" placeholder="Enter annual turnover">
                                    </div>
                                    <div class="form-group">
                                        <label>Business Type</label>
                                        <select id="business-type">
                                            <option value="retail">Retail Business</option>
                                            <option value="wholesale">Wholesale Business</option>
                                            <option value="service">Service Business</option>
                                            <option value="manufacturing">Manufacturing</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="calculator-section">
                                <h4>Monthly Sales</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Gross Sales (UGX)</label>
                                        <input type="number" id="gross-sales" placeholder="Enter gross sales">
                                    </div>
                                    <div class="form-group">
                                        <label>Cost of Goods Sold (UGX)</label>
                                        <input type="number" id="cogs-input" placeholder="Enter COGS">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="calculator-section">
                                <h4>Operating Expenses</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Staff Salaries (UGX)</label>
                                        <input type="number" id="staff-salaries" placeholder="Enter staff costs">
                                    </div>
                                    <div class="form-group">
                                        <label>Other Expenses (UGX)</label>
                                        <input type="number" id="other-expenses" placeholder="Enter other expenses">
                                    </div>
                                </div>
                            </div>
                            
                            <button class="btn-primary" onclick="calculateTaxes()">
                                <i class="fas fa-calculator"></i> Calculate Taxes
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Tax Breakdown -->
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-chart-pie"></i> Tax Breakdown</h2>
                    </div>
                    <div class="card-body">
                        <div class="tax-breakdown">
                            <div class="breakdown-item">
                                <div class="breakdown-label">
                                    <span>Gross Sales</span>
                                    <span class="breakdown-amount" id="breakdown-gross-sales">UGX 0</span>
                                </div>
                                <div class="breakdown-bar">
                                    <div class="breakdown-fill" style="width: 100%; background: #10b981;"></div>
                                </div>
                            </div>
                            
                            <div class="breakdown-item">
                                <div class="breakdown-label">
                                    <span>Cost of Goods Sold</span>
                                    <span class="breakdown-amount" id="breakdown-cogs">UGX 0</span>
                                </div>
                                <div class="breakdown-bar">
                                    <div class="breakdown-fill" style="width: 60%; background: #ef4444;"></div>
                                </div>
                            </div>
                            
                            <div class="breakdown-item">
                                <div class="breakdown-label">
                                    <span>Gross Profit</span>
                                    <span class="breakdown-amount" id="breakdown-gross-profit">UGX 0</span>
                                </div>
                                <div class="breakdown-bar">
                                    <div class="breakdown-fill" style="width: 40%; background: #3b82f6;"></div>
                                </div>
                            </div>
                            
                            <div class="breakdown-item">
                                <div class="breakdown-label">
                                    <span>Operating Expenses</span>
                                    <span class="breakdown-amount" id="breakdown-operating-expenses">UGX 0</span>
                                </div>
                                <div class="breakdown-bar">
                                    <div class="breakdown-fill" style="width: 25%; background: #f59e0b;"></div>
                                </div>
                            </div>
                            
                            <div class="breakdown-item">
                                <div class="breakdown-label">
                                    <span>Net Profit (Taxable Income)</span>
                                    <span class="breakdown-amount" id="breakdown-net-profit">UGX 0</span>
                                </div>
                                <div class="breakdown-bar">
                                    <div class="breakdown-fill" style="width: 15%; background: #8b5cf6;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- URA Compliance -->
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-shield-alt"></i> URA Compliance</h2>
                    </div>
                    <div class="card-body">
                        <div class="compliance-checklist">
                            <div class="compliance-item">
                                <div class="compliance-check">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <div class="compliance-content">
                                    <h4>VAT Registration</h4>
                                    <p>Register for VAT if annual turnover exceeds UGX 150M</p>
                                    <span class="compliance-status" id="vat-status">Not Required</span>
                                </div>
                            </div>
                            
                            <div class="compliance-item">
                                <div class="compliance-check">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <div class="compliance-content">
                                    <h4>Tax Returns</h4>
                                    <p>File monthly tax returns by the 15th of each month</p>
                                    <span class="compliance-status" id="returns-status">Up to Date</span>
                                </div>
                            </div>
                            
                            <div class="compliance-item">
                                <div class="compliance-check">
                                    <i class="fas fa-exclamation-triangle"></i>
                                </div>
                                <div class="compliance-content">
                                    <h4>Record Keeping</h4>
                                    <p>Maintain proper books of accounts for 7 years</p>
                                    <span class="compliance-status" id="records-status">Good</span>
                                </div>
                            </div>
                            
                            <div class="compliance-item">
                                <div class="compliance-check">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <div class="compliance-content">
                                    <h4>Tax Payments</h4>
                                    <p>Pay taxes due by the 15th of each month</p>
                                    <span class="compliance-status" id="payments-status">Current</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tax Calendar -->
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-calendar"></i> Tax Calendar</h2>
                    </div>
                    <div class="card-body">
                        <div class="tax-calendar">
                            <div class="calendar-item">
                                <div class="calendar-date">15th</div>
                                <div class="calendar-content">
                                    <h4>Monthly Tax Returns</h4>
                                    <p>File VAT and Withholding Tax returns</p>
                                </div>
                                <div class="calendar-status due">Due</div>
                            </div>
                            
                            <div class="calendar-item">
                                <div class="calendar-date">31st</div>
                                <div class="calendar-content">
                                    <h4>Corporate Tax</h4>
                                    <p>Annual corporate tax return</p>
                                </div>
                                <div class="calendar-status upcoming">Upcoming</div>
                            </div>
                            
                            <div class="calendar-item">
                                <div class="calendar-date">30th</div>
                                <div class="calendar-content">
                                    <h4>PAYE Returns</h4>
                                    <p>Monthly PAYE returns for employees</p>
                                </div>
                                <div class="calendar-status completed">Completed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Initialize tax management
        await this.initializeTaxManagement();
    }

    async initializeTaxManagement() {
        try {
            // Calculate taxes from product data
            const totalRevenue = this.products.reduce((sum, p) => sum + (p.retailCost * p.quantitySold), 0);
            const totalCost = this.products.reduce((sum, p) => sum + (p.wholesaleCost * p.quantitySold), 0);
            const netProfit = totalRevenue - totalCost;
            
            // Calculate taxes
            const corporateTax = netProfit * 0.30; // 30% corporate tax
            const vatAmount = totalRevenue * 0.18; // 18% VAT
            const withholdingTax = totalRevenue * 0.06; // 6% withholding tax
            const totalTax = corporateTax + vatAmount + withholdingTax;

            // Update tax cards
            document.getElementById('corporate-tax').textContent = `UGX ${corporateTax.toLocaleString()}`;
            document.getElementById('vat-amount').textContent = `UGX ${vatAmount.toLocaleString()}`;
            document.getElementById('withholding-tax').textContent = `UGX ${withholdingTax.toLocaleString()}`;
            document.getElementById('total-tax').textContent = `UGX ${totalTax.toLocaleString()}`;

            // Update breakdown
            document.getElementById('breakdown-gross-sales').textContent = `UGX ${totalRevenue.toLocaleString()}`;
            document.getElementById('breakdown-cogs').textContent = `UGX ${totalCost.toLocaleString()}`;
            document.getElementById('breakdown-gross-profit').textContent = `UGX ${netProfit.toLocaleString()}`;
            document.getElementById('breakdown-operating-expenses').textContent = 'UGX 1,200,000';
            document.getElementById('breakdown-net-profit').textContent = `UGX ${(netProfit - 1200000).toLocaleString()}`;

            console.log("✅ Tax management initialized");
        } catch (error) {
            console.error("Error initializing tax management:", error);
        }
    }

    async loadWholesalers() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-store"></i> Wholesaler Management</h1>
                    <div class="header-actions">
                        <button class="btn-primary" onclick="showAddWholesalerModal()">
                            <i class="fas fa-plus"></i> Add Wholesaler
                        </button>
                        <button class="btn-primary" onclick="exportWholesalerData()">
                            <i class="fas fa-download"></i> Export Data
                        </button>
                    </div>
                </div>

                <!-- Wholesaler Summary -->
                <div class="wholesaler-summary">
                    <div class="summary-card total">
                        <div class="summary-icon">
                            <i class="fas fa-store"></i>
                        </div>
                        <div class="summary-content">
                            <h3>Total Wholesalers</h3>
                            <div class="summary-value" id="total-wholesalers">0</div>
                            <div class="summary-period">Active Suppliers</div>
                        </div>
                    </div>
                    
                    <div class="summary-card orders">
                        <div class="summary-icon">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <div class="summary-content">
                            <h3>Monthly Orders</h3>
                            <div class="summary-value" id="monthly-orders">0</div>
                            <div class="summary-period">This Month</div>
                        </div>
                    </div>
                    
                    <div class="summary-card value">
                        <div class="summary-icon">
                            <i class="fas fa-money-bill-wave"></i>
                        </div>
                        <div class="summary-content">
                            <h3>Purchase Value</h3>
                            <div class="summary-value" id="purchase-value">UGX 0</div>
                            <div class="summary-period">This Month</div>
                        </div>
                    </div>
                    
                    <div class="summary-card savings">
                        <div class="summary-icon">
                            <i class="fas fa-piggy-bank"></i>
                        </div>
                        <div class="summary-content">
                            <h3>Cost Savings</h3>
                            <div class="summary-value" id="cost-savings">UGX 0</div>
                            <div class="summary-period">vs Retail Prices</div>
                        </div>
                    </div>
                </div>

                <!-- Add Wholesaler Form -->
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-plus-circle"></i> Add New Wholesaler</h2>
                    </div>
                    <div class="card-body">
                        <form id="wholesaler-form" class="modern-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label><i class="fas fa-building"></i> Company Name</label>
                                    <input type="text" id="company-name" required placeholder="Enter company name">
                                </div>
                                <div class="form-group">
                                    <label><i class="fas fa-user"></i> Contact Person</label>
                                    <input type="text" id="contact-person" required placeholder="Contact person name">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label><i class="fas fa-phone"></i> Phone Number</label>
                                    <input type="tel" id="phone-number" required placeholder="+256 XXX XXX XXX">
                                </div>
                                <div class="form-group">
                                    <label><i class="fas fa-envelope"></i> Email</label>
                                    <input type="email" id="email" placeholder="company@email.com">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label><i class="fas fa-map-marker-alt"></i> Location</label>
                                    <input type="text" id="location" required placeholder="City, District">
                                </div>
                                <div class="form-group">
                                    <label><i class="fas fa-list"></i> Specialization</label>
                                    <select id="specialization" required>
                                        <option value="">Select Category</option>
                                        <option value="Clothing">Clothing & Fashion</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Food & Beverages">Food & Beverages</option>
                                        <option value="Home & Garden">Home & Garden</option>
                                        <option value="Health & Beauty">Health & Beauty</option>
                                        <option value="Sports">Sports & Outdoors</option>
                                        <option value="General">General Merchandise</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label><i class="fas fa-percentage"></i> Discount Rate (%)</label>
                                    <input type="number" id="discount-rate" min="0" max="50" placeholder="e.g., 15">
                                </div>
                                <div class="form-group">
                                    <label><i class="fas fa-clock"></i> Delivery Time (Days)</label>
                                    <input type="number" id="delivery-time" min="1" placeholder="e.g., 3">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label><i class="fas fa-info-circle"></i> Notes</label>
                                <textarea id="wholesaler-notes" rows="3" placeholder="Additional information about this wholesaler..."></textarea>
                            </div>
                            
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-plus"></i> Add Wholesaler
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Wholesaler List -->
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-list"></i> Wholesaler Directory</h2>
                        <div class="header-controls">
                            <input type="text" id="wholesaler-search" placeholder="Search wholesalers..." class="search-input">
                            <select id="category-filter-wholesaler" class="filter-select">
                                <option value="">All Categories</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Food & Beverages">Food & Beverages</option>
                                <option value="Home & Garden">Home & Garden</option>
                                <option value="Health & Beauty">Health & Beauty</option>
                                <option value="Sports">Sports</option>
                                <option value="General">General</option>
                            </select>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="wholesaler-list" class="wholesaler-grid">
                            <!-- Wholesalers will be populated here -->
                        </div>
                    </div>
                </div>

                <!-- Purchase History -->
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-history"></i> Recent Purchases</h2>
                    </div>
                    <div class="card-body">
                        <div class="table-container">
                            <table class="analytics-table" id="purchase-history-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Wholesaler</th>
                                        <th>Products</th>
                                        <th>Quantity</th>
                                        <th>Total Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="purchase-history-body">
                                    <!-- Purchase history will be populated here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Performance Analytics -->
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-chart-bar"></i> Wholesaler Performance</h2>
                    </div>
                    <div class="card-body">
                        <div class="performance-metrics">
                            <div class="metric-item">
                                <h4>Top Performing Wholesaler</h4>
                                <div class="metric-value" id="top-wholesaler">N/A</div>
                            </div>
                            <div class="metric-item">
                                <h4>Average Order Value</h4>
                                <div class="metric-value" id="avg-order-value">UGX 0</div>
                            </div>
                            <div class="metric-item">
                                <h4>On-Time Delivery Rate</h4>
                                <div class="metric-value" id="delivery-rate">0%</div>
                            </div>
                            <div class="metric-item">
                                <h4>Cost Savings This Month</h4>
                                <div class="metric-value" id="monthly-savings">UGX 0</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Initialize wholesaler management
        await this.initializeWholesalerManagement();
    }

    async initializeWholesalerManagement() {
        try {
            // Simulate wholesaler data
            const wholesalers = [
                {
                    id: 1,
                    companyName: 'Fashion Wholesale Ltd',
                    contactPerson: 'John Mukasa',
                    phone: '+256 700 123 456',
                    email: 'john@fashionwholesale.ug',
                    location: 'Kampala, Central',
                    specialization: 'Clothing',
                    discountRate: 15,
                    deliveryTime: 3,
                    notes: 'Reliable supplier for clothing items'
                },
                {
                    id: 2,
                    companyName: 'Tech Solutions Uganda',
                    contactPerson: 'Sarah Nakato',
                    phone: '+256 701 234 567',
                    email: 'sarah@techsolutions.ug',
                    location: 'Entebbe, Wakiso',
                    specialization: 'Electronics',
                    discountRate: 12,
                    deliveryTime: 5,
                    notes: 'Specializes in electronics and gadgets'
                },
                {
                    id: 3,
                    companyName: 'Home & Garden Supplies',
                    contactPerson: 'Peter Okello',
                    phone: '+256 702 345 678',
                    email: 'peter@homesupplies.ug',
                    location: 'Jinja, Eastern',
                    specialization: 'Home & Garden',
                    discountRate: 18,
                    deliveryTime: 2,
                    notes: 'Fast delivery for home items'
                }
            ];

            // Update summary cards
            document.getElementById('total-wholesalers').textContent = wholesalers.length;
            document.getElementById('monthly-orders').textContent = '24';
            document.getElementById('purchase-value').textContent = 'UGX 2,400,000';
            document.getElementById('cost-savings').textContent = 'UGX 360,000';

            // Populate wholesaler list
            this.renderWholesalerList(wholesalers);
            this.renderPurchaseHistory();
            this.updatePerformanceMetrics();

            console.log("✅ Wholesaler management initialized");
        } catch (error) {
            console.error("Error initializing wholesaler management:", error);
        }
    }

    renderWholesalerList(wholesalers) {
        const container = document.getElementById('wholesaler-list');
        container.innerHTML = wholesalers.map(wholesaler => `
            <div class="wholesaler-card">
                <div class="wholesaler-header">
                    <h4>${wholesaler.companyName}</h4>
                    <span class="specialization-badge">${wholesaler.specialization}</span>
                </div>
                <div class="wholesaler-details">
                    <div class="detail-item">
                        <i class="fas fa-user"></i>
                        <span>${wholesaler.contactPerson}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone"></i>
                        <span>${wholesaler.phone}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${wholesaler.location}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-percentage"></i>
                        <span>${wholesaler.discountRate}% Discount</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${wholesaler.deliveryTime} days delivery</span>
                    </div>
                </div>
                <div class="wholesaler-actions">
                    <button class="btn-action" onclick="editWholesaler(${wholesaler.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-action" onclick="placeOrder(${wholesaler.id})">
                        <i class="fas fa-shopping-cart"></i> Order
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderPurchaseHistory() {
        const tbody = document.getElementById('purchase-history-body');
        const purchases = [
            { date: '2024-01-25', wholesaler: 'Fashion Wholesale Ltd', products: 'T-Shirts, Jeans', quantity: 50, amount: 750000, status: 'Delivered' },
            { date: '2024-01-22', wholesaler: 'Tech Solutions Uganda', products: 'Smartphones, Tablets', quantity: 15, amount: 1200000, status: 'In Transit' },
            { date: '2024-01-20', wholesaler: 'Home & Garden Supplies', products: 'Garden Tools', quantity: 25, amount: 450000, status: 'Delivered' }
        ];

        tbody.innerHTML = purchases.map(purchase => `
            <tr>
                <td>${purchase.date}</td>
                <td>${purchase.wholesaler}</td>
                <td>${purchase.products}</td>
                <td>${purchase.quantity}</td>
                <td>UGX ${purchase.amount.toLocaleString()}</td>
                <td><span class="status-badge ${purchase.status.toLowerCase().replace(' ', '-')}">${purchase.status}</span></td>
                <td>
                    <button class="btn-action" onclick="viewPurchaseDetails('${purchase.date}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `).join('');
    }

    updatePerformanceMetrics() {
        document.getElementById('top-wholesaler').textContent = 'Fashion Wholesale Ltd';
        document.getElementById('avg-order-value').textContent = 'UGX 800,000';
        document.getElementById('delivery-rate').textContent = '92%';
        document.getElementById('monthly-savings').textContent = 'UGX 360,000';
    }

    async loadAdverts() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-ad"></i> Advertising Management</h1>
                    <div class="header-actions">
                        <button class="btn-primary" onclick="createNewAd()">
                            <i class="fas fa-plus"></i> Create Ad
                        </button>
                        <button class="btn-primary" onclick="exportAdData()">
                            <i class="fas fa-download"></i> Export Data
                        </button>
                    </div>
                </div>

                <!-- Ad Performance Summary -->
                <div class="ad-summary">
                    <div class="summary-card active">
                        <div class="summary-icon">
                            <i class="fas fa-play"></i>
                        </div>
                        <div class="summary-content">
                            <h3>Active Campaigns</h3>
                            <div class="summary-value" id="active-campaigns">0</div>
                            <div class="summary-period">Currently Running</div>
                        </div>
                    </div>
                    
                    <div class="summary-card reach">
                        <div class="summary-icon">
                            <i class="fas fa-eye"></i>
                        </div>
                        <div class="summary-content">
                            <h3>Total Reach</h3>
                            <div class="summary-value" id="total-reach">0</div>
                            <div class="summary-period">People Reached</div>
                        </div>
                    </div>
                    
                    <div class="summary-card clicks">
                        <div class="summary-icon">
                            <i class="fas fa-mouse-pointer"></i>
                        </div>
                        <div class="summary-content">
                            <h3>Total Clicks</h3>
                            <div class="summary-value" id="total-clicks">0</div>
                            <div class="summary-period">Link Clicks</div>
                        </div>
                    </div>
                    
                    <div class="summary-card spend">
                        <div class="summary-icon">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="summary-content">
                            <h3>Total Spend</h3>
                            <div class="summary-value" id="total-spend">UGX 0</div>
                            <div class="summary-period">This Month</div>
                        </div>
                    </div>
                </div>

                <!-- Create New Ad -->
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-plus-circle"></i> Create New Advertisement</h2>
                    </div>
                    <div class="card-body">
                        <form id="ad-form" class="modern-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label><i class="fas fa-heading"></i> Ad Title</label>
                                    <input type="text" id="ad-title" required placeholder="Enter ad title">
                                </div>
                                <div class="form-group">
                                    <label><i class="fas fa-list"></i> Ad Type</label>
                                    <select id="ad-type" required>
                                        <option value="">Select Ad Type</option>
                                        <option value="facebook">Facebook Ads</option>
                                        <option value="google">Google Ads</option>
                                        <option value="instagram">Instagram Ads</option>
                                        <option value="whatsapp">WhatsApp Business</option>
                                        <option value="print">Print Media</option>
                                        <option value="radio">Radio</option>
                                        <option value="billboard">Billboard</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label><i class="fas fa-align-left"></i> Ad Description</label>
                                <textarea id="ad-description" rows="4" required placeholder="Write your ad copy here..."></textarea>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label><i class="fas fa-image"></i> Ad Image/Video</label>
                                    <input type="file" id="ad-media" accept="image/*,video/*">
                                </div>
                                <div class="form-group">
                                    <label><i class="fas fa-link"></i> Landing Page URL</label>
                                    <input type="url" id="landing-url" placeholder="https://yourwebsite.com">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label><i class="fas fa-users"></i> Target Audience</label>
                                    <select id="target-audience">
                                        <option value="general">General Public</option>
                                        <option value="youth">Youth (18-35)</option>
                                        <option value="families">Families</option>
                                        <option value="professionals">Professionals</option>
                                        <option value="students">Students</option>
                                        <option value="elderly">Elderly (50+)</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label><i class="fas fa-map-marker-alt"></i> Target Location</label>
                                    <select id="target-location">
                                        <option value="kampala">Kampala</option>
                                        <option value="entebbe">Entebbe</option>
                                        <option value="jinja">Jinja</option>
                                        <option value="mbarara">Mbarara</option>
                                        <option value="gulu">Gulu</option>
                                        <option value="all">All Uganda</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label><i class="fas fa-calendar"></i> Start Date</label>
                                    <input type="date" id="start-date" required>
                                </div>
                                <div class="form-group">
                                    <label><i class="fas fa-calendar"></i> End Date</label>
                                    <input type="date" id="end-date" required>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label><i class="fas fa-dollar-sign"></i> Budget (UGX)</label>
                                    <input type="number" id="ad-budget" required placeholder="Enter budget amount" min="0">
                                </div>
                                <div class="form-group">
                                    <label><i class="fas fa-bullseye"></i> Campaign Goal</label>
                                    <select id="campaign-goal">
                                        <option value="awareness">Brand Awareness</option>
                                        <option value="traffic">Website Traffic</option>
                                        <option value="sales">Sales/Conversions</option>
                                        <option value="engagement">Engagement</option>
                                        <option value="app-installs">App Installs</option>
                                    </select>
                                </div>
                            </div>
                            
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-rocket"></i> Launch Campaign
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Active Campaigns -->
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-play-circle"></i> Active Campaigns</h2>
                    </div>
                    <div class="card-body">
                        <div id="active-campaigns-list" class="campaigns-grid">
                            <!-- Active campaigns will be populated here -->
                        </div>
                    </div>
                </div>

                <!-- Campaign Performance -->
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-chart-line"></i> Campaign Performance</h2>
                    </div>
                    <div class="card-body">
                        <div class="performance-metrics">
                            <div class="metric-item">
                                <h4>Click-Through Rate (CTR)</h4>
                                <div class="metric-value" id="ctr">0%</div>
                            </div>
                            <div class="metric-item">
                                <h4>Cost Per Click (CPC)</h4>
                                <div class="metric-value" id="cpc">UGX 0</div>
                            </div>
                            <div class="metric-item">
                                <h4>Return on Ad Spend (ROAS)</h4>
                                <div class="metric-value" id="roas">0%</div>
                            </div>
                            <div class="metric-item">
                                <h4>Conversion Rate</h4>
                                <div class="metric-value" id="conversion-rate">0%</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Ad Analytics -->
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-chart-bar"></i> Ad Analytics</h2>
                    </div>
                    <div class="card-body">
                        <div class="analytics-charts">
                            <div class="chart-container">
                                <canvas id="adPerformanceChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Initialize advertising management
        await this.initializeAdvertisingManagement();
    }

    async initializeAdvertisingManagement() {
        try {
            // Simulate advertising data
            const campaigns = [
                {
                    id: 1,
                    title: 'Summer Sale Campaign',
                    type: 'Facebook',
                    status: 'Active',
                    reach: 15000,
                    clicks: 450,
                    spend: 75000,
                    startDate: '2024-01-15',
                    endDate: '2024-02-15'
                },
                {
                    id: 2,
                    title: 'New Product Launch',
                    type: 'Instagram',
                    status: 'Active',
                    reach: 8500,
                    clicks: 280,
                    spend: 45000,
                    startDate: '2024-01-20',
                    endDate: '2024-02-20'
                }
            ];

            // Update summary cards
            document.getElementById('active-campaigns').textContent = campaigns.length;
            document.getElementById('total-reach').textContent = '23,500';
            document.getElementById('total-clicks').textContent = '730';
            document.getElementById('total-spend').textContent = 'UGX 120,000';

            // Populate campaigns
            this.renderActiveCampaigns(campaigns);
            this.updateAdPerformanceMetrics();

            console.log("✅ Advertising management initialized");
        } catch (error) {
            console.error("Error initializing advertising management:", error);
        }
    }

    renderActiveCampaigns(campaigns) {
        const container = document.getElementById('active-campaigns-list');
        container.innerHTML = campaigns.map(campaign => `
            <div class="campaign-card">
                <div class="campaign-header">
                    <h4>${campaign.title}</h4>
                    <span class="campaign-type">${campaign.type}</span>
                    <span class="campaign-status ${campaign.status.toLowerCase()}">${campaign.status}</span>
                </div>
                <div class="campaign-metrics">
                    <div class="metric">
                        <span class="metric-label">Reach</span>
                        <span class="metric-value">${campaign.reach.toLocaleString()}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Clicks</span>
                        <span class="metric-value">${campaign.clicks}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Spend</span>
                        <span class="metric-value">UGX ${campaign.spend.toLocaleString()}</span>
                    </div>
                </div>
                <div class="campaign-dates">
                    <span>${campaign.startDate} - ${campaign.endDate}</span>
                </div>
                <div class="campaign-actions">
                    <button class="btn-action" onclick="editCampaign(${campaign.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-action" onclick="pauseCampaign(${campaign.id})">
                        <i class="fas fa-pause"></i> Pause
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateAdPerformanceMetrics() {
        document.getElementById('ctr').textContent = '3.1%';
        document.getElementById('cpc').textContent = 'UGX 164';
        document.getElementById('roas').textContent = '320%';
        document.getElementById('conversion-rate').textContent = '2.8%';
    }
}

// Global functions for buttons
window.exportReport = function() {
    alert('Export functionality would generate a comprehensive business report here.');
};

window.printReport = function() {
    window.print();
};

window.applyFilters = function() {
    console.log('Filters applied');
};

// Accountability functions
window.printAccountabilityReport = function() {
    window.print();
};

window.exportAccountabilityData = function() {
    alert('Exporting accountability data to Excel...');
};

window.showAddExpenseModal = function() {
    alert('Add Expense modal would open here.');
};

// Tax functions
window.generateTaxReport = function() {
    alert('Generating comprehensive tax report for URA submission...');
};

window.printTaxReport = function() {
    window.print();
};

window.calculateTaxes = function() {
    const grossSales = parseFloat(document.getElementById('gross-sales').value) || 0;
    const cogs = parseFloat(document.getElementById('cogs-input').value) || 0;
    const staffSalaries = parseFloat(document.getElementById('staff-salaries').value) || 0;
    const otherExpenses = parseFloat(document.getElementById('other-expenses').value) || 0;
    
    const grossProfit = grossSales - cogs;
    const operatingExpenses = staffSalaries + otherExpenses;
    const netProfit = grossProfit - operatingExpenses;
    
    const corporateTax = netProfit * 0.30;
    const vatAmount = grossSales * 0.18;
    const withholdingTax = grossSales * 0.06;
    const totalTax = corporateTax + vatAmount + withholdingTax;
    
    // Update tax cards
    document.getElementById('corporate-tax').textContent = `UGX ${corporateTax.toLocaleString()}`;
    document.getElementById('vat-amount').textContent = `UGX ${vatAmount.toLocaleString()}`;
    document.getElementById('withholding-tax').textContent = `UGX ${withholdingTax.toLocaleString()}`;
    document.getElementById('total-tax').textContent = `UGX ${totalTax.toLocaleString()}`;
    
    // Update breakdown
    document.getElementById('breakdown-gross-sales').textContent = `UGX ${grossSales.toLocaleString()}`;
    document.getElementById('breakdown-cogs').textContent = `UGX ${cogs.toLocaleString()}`;
    document.getElementById('breakdown-gross-profit').textContent = `UGX ${grossProfit.toLocaleString()}`;
    document.getElementById('breakdown-operating-expenses').textContent = `UGX ${operatingExpenses.toLocaleString()}`;
    document.getElementById('breakdown-net-profit').textContent = `UGX ${netProfit.toLocaleString()}`;
    
    alert(`Tax calculation complete!\n\nTotal Tax Due: UGX ${totalTax.toLocaleString()}`);
};

// Wholesaler functions
window.showAddWholesalerModal = function() {
    alert('Add Wholesaler modal would open here.');
};

window.exportWholesalerData = function() {
    alert('Exporting wholesaler data to Excel...');
};

window.editWholesaler = function(id) {
    alert(`Edit wholesaler ${id} functionality would open here.`);
};

window.placeOrder = function(id) {
    alert(`Place order with wholesaler ${id} functionality would open here.`);
};

window.viewPurchaseDetails = function(date) {
    alert(`View purchase details for ${date} functionality would open here.`);
};

// Advertising functions
window.createNewAd = function() {
    alert('Create new ad functionality would open here.');
};

window.exportAdData = function() {
    alert('Exporting advertising data to Excel...');
};

window.editCampaign = function(id) {
    alert(`Edit campaign ${id} functionality would open here.`);
};

window.pauseCampaign = function(id) {
    alert(`Pause campaign ${id} functionality would open here.`);
};

// Product management functions
window.editProduct = function(productName) {
    alert(`Edit product "${productName}" functionality would open here.`);
};

window.deleteProduct = function(productName) {
    if (confirm(`Are you sure you want to delete "${productName}"?`)) {
        alert(`Product "${productName}" would be deleted here.`);
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.shopAnalyser = new ShopAnalyserApp();
});
