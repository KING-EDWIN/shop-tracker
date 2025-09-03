// Main Application Controller - Enterprise Shop Analyser
// Ensure mobile sidebar toggle exists globally
(function ensureSidebarToggle() {
  if (typeof window !== 'undefined' && !window.toggleSidebar) {
    window.toggleSidebar = function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
      if (!sidebar) return;
      sidebar.classList.toggle('open');
    };
  }
})();

// Lightweight cashier tools (inventory + sales entry) with immediate feedback
(function cashierTools() {
  if (typeof window === 'undefined') return;
  if (!window.salesRecords) window.salesRecords = [];

  function renderSalesEntryUI() {
    const el = document.getElementById('content-area');
    if (!el) return;
    el.innerHTML = `
      <div class="sales-entry-content">
        <div class="page-header">
          <h2><i class="fas fa-cash-register"></i> Record Daily Sales</h2>
          <p>Cashier can quickly capture sales; insights update automatically.</p>
        </div>
        <div class="sales-form-section">
          <form id="sales-entry-form" class="sales-form">
            <div class="form-row">
              <div class="form-group">
                <label><i class="fas fa-box"></i> Product Name</label>
                <input required name="productName" placeholder="e.g. Wireless Earbuds" />
              </div>
              <div class="form-group">
                <label><i class="fas fa-hashtag"></i> Quantity Sold</label>
                <input required type="number" min="1" name="quantity" placeholder="e.g. 3" />
              </div>
              <div class="form-group">
                <label><i class="fas fa-tag"></i> Unit Price (UGX)</label>
                <input required type="number" min="0" name="unitPrice" placeholder="e.g. 120000" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label><i class="fas fa-barcode"></i> SKU (optional)</label>
                <input name="sku" placeholder="e.g. EAR-004" />
              </div>
              <div class="form-group">
                <label><i class="fas fa-layer-group"></i> Category</label>
                <select name="category">
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Footwear</option>
                  <option>Accessories</option>
                  <option>Health</option>
                </select>
              </div>
            </div>
            <button class="btn-primary" type="submit"><i class="fas fa-save"></i> Save Sale</button>
          </form>
        </div>

        <div class="daily-summary-content">
          <div class="page-header"><h2><i class="fas fa-list"></i> Today\'s Transactions</h2></div>
          <div id="sales-transactions" class="transactions-list"></div>
        </div>
      </div>
    `;

    const form = document.getElementById('sales-entry-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const sale = {
        id: Date.now(),
        productName: fd.get('productName').trim(),
        quantity: Number(fd.get('quantity')),
        unitPrice: Number(fd.get('unitPrice')),
        sku: (fd.get('sku') || '').trim(),
        category: fd.get('category'),
        amount: Number(fd.get('quantity')) * Number(fd.get('unitPrice')),
        time: new Date().toLocaleTimeString()
      };
      window.salesRecords.unshift(sale);

      // Attempt to update in-memory inventory if available
      try {
        if (window.inventoryManager && Array.isArray(window.inventoryManager.products)) {
          const p = window.inventoryManager.products.find(pr => pr.name.toLowerCase() === sale.productName.toLowerCase());
          if (p) {
            p.sold = (p.sold || 0) + sale.quantity;
            p.stock = Math.max(0, (p.stock || 0) - sale.quantity);
          }
        }
      } catch {}

      form.reset();
      renderTransactions();
      // Quick feedback
      alert('Sale saved');
    });

    renderTransactions();
  }

  function renderTransactions() {
    const list = document.getElementById('sales-transactions');
    if (!list) return;
    if (window.salesRecords.length === 0) {
      list.innerHTML = '<div class="transaction-item">No sales recorded yet.</div>';
      return;
    }
    list.innerHTML = window.salesRecords.slice(0, 10).map(t => `
      <div class="transaction-item">
        <div class="transaction-info">
          <span class="product-name">${t.productName} (${t.quantity} @ UGX ${t.unitPrice.toLocaleString()})</span>
          <span class="transaction-time">${t.time}</span>
        </div>
        <div class="transaction-amount">UGX ${t.amount.toLocaleString()}</div>
      </div>
    `).join('');
  }

  function renderInventoryEntryUI() {
    const el = document.getElementById('content-area');
    if (!el) return;
    el.innerHTML = `
      <div class="sales-entry-content">
        <div class="page-header">
          <h2><i class="fas fa-boxes"></i> Add/Update Inventory</h2>
          <p>Capture new stock arrivals and adjust quantities.</p>
        </div>
        <div class="sales-form-section">
          <form id="inventory-entry-form" class="sales-form">
            <div class="form-row">
              <div class="form-group"><label>Product Name</label><input required name="name" /></div>
              <div class="form-group"><label>Category</label>
                <select name="category">
                  <option>Electronics</option><option>Clothing</option><option>Footwear</option>
                  <option>Accessories</option><option>Health</option>
                </select>
              </div>
              <div class="form-group"><label>Supplier</label><input name="supplier" placeholder="e.g. Nile Traders" /></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Stock Qty</label><input required type="number" min="0" name="stock" /></div>
              <div class="form-group"><label>Wholesale Cost (UGX)</label><input required type="number" min="0" name="wholesaleCost" /></div>
              <div class="form-group"><label>Profit Margin (%)</label><input required type="number" min="0" max="100" name="profitMargin" value="20" /></div>
            </div>
            <button class="btn-primary" type="submit"><i class="fas fa-save"></i> Save Inventory</button>
          </form>
        </div>

        <div class="inventory-list-section">
          <div class="page-header"><h2><i class="fas fa-clipboard-list"></i> Current Inventory</h2></div>
          <div id="inventory-list"></div>
        </div>
      </div>
    `;

    document.getElementById('inventory-entry-form').addEventListener('submit', (e) => {
            e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const product = {
        id: Date.now(),
        name: fd.get('name').trim(),
        category: fd.get('category'),
        supplier: (fd.get('supplier') || '').trim(),
        stock: Number(fd.get('stock')),
        sold: 0,
        wholesaleCost: Number(fd.get('wholesaleCost')),
        profitMargin: Number(fd.get('profitMargin'))
      };
      try {
        if (window.inventoryManager) {
          // If product exists, update; else add
          const existing = window.inventoryManager.products.find(p => p.name.toLowerCase() === product.name.toLowerCase());
          if (existing) {
            Object.assign(existing, product, { id: existing.id });
          } else {
            window.inventoryManager.products.push(product);
          }
          window.inventoryManager.processInventoryData();
        }
      } catch {}
      e.currentTarget.reset();
      alert('Inventory saved');
      renderInventoryList();
    });
    renderInventoryList();
  }

  // Hook navigation clicks
  document.addEventListener('click', (e) => {
    const salesLink = e.target.closest('.nav-link[data-page="sales-entry"]');
    const invEntryLink = e.target.closest('.nav-link[data-page="inventory-entry"]');
    const productsLink = e.target.closest('.nav-link[data-page="products"]');
    if (salesLink) { e.preventDefault(); renderSalesEntryUI(); }
    if (invEntryLink) { e.preventDefault(); renderInventoryEntryUI(); }
    if (productsLink) { /* show inventory management page enhancements */ setTimeout(enhanceInventoryManagementUI, 200); }
  });

  // Expose for programmatic routing
  window.renderSalesEntry = renderSalesEntryUI;
  window.renderInventoryEntry = renderInventoryEntryUI;

  // Helpers: render and adjust inventory rows
  function renderInventoryList() {
    const container = document.getElementById('inventory-list');
    if (!container) return;
    const products = (window.inventoryManager && window.inventoryManager.products) || [];
    if (products.length === 0) {
      container.innerHTML = '<div class="transaction-item">No inventory yet.</div>';
      return;
    }
    container.innerHTML = products.map(p => `
      <div class="transaction-item">
        <div class="transaction-info">
          <span class="product-name">${p.name} <small style="color:#64748b">(${p.category || 'N/A'})</small></span>
          <span class="transaction-time">Stock: <b>${p.stock ?? 0}</b> • Sold: <b>${p.sold ?? 0}</b></span>
        </div>
        <div style="display:flex; gap:8px; align-items:center">
          <button class="btn-secondary" onclick="window.adjustStock(${p.id}, 'add')"><i class="fas fa-plus"></i> Stock</button>
          <button class="btn-secondary" onclick="window.adjustStock(${p.id}, 'sub')"><i class="fas fa-minus"></i> Stock</button>
        </div>
      </div>
    `).join('');
  }

  // Legacy function for compatibility - redirects to new app method
  window.adjustStock = function(id, action) {
    console.log('🔄 Legacy adjustStock called, redirecting to window.app.adjustStock');
    if (window.app && window.app.adjustStock) {
      return window.app.adjustStock(id, action);
    } else {
      console.error('❌ window.app.adjustStock not available');
      alert('Inventory management not ready. Please refresh the page.');
    }
  }

  // Global delete function for compatibility
  window.deleteProduct = function(id, name) {
    console.log('🔄 Global deleteProduct called, redirecting to window.app.deleteProduct');
    if (window.app && window.app.deleteProduct) {
      return window.app.deleteProduct(id, name);
    } else {
      console.error('❌ window.app.deleteProduct not available');
      alert('Inventory management not ready. Please refresh the page.');
    }
  }

  // Lightweight hash router so #inventory-entry shows the editor instead of dashboard
  function handleRoute() {
    const hash = (window.location.hash || '').replace('#', '');
    if (hash === 'inventory-entry') {
      renderInventoryEntryUI();
    } else if (hash === 'sales-entry') {
      renderSalesEntryUI();
    }
  }
  window.addEventListener('hashchange', handleRoute);
  document.addEventListener('DOMContentLoaded', handleRoute);

  // Enhance Inventory Management page with inline stock controls
  function enhanceInventoryManagementUI() {
    const content = document.getElementById('content-area');
    if (!content) return;
    // Only proceed if inventory section exists
    const analyticsContainer = content.querySelector('.product-analytics');
    if (!analyticsContainer) return;

    const cards = content.querySelectorAll('.product-analytics-card, .inventory-card, .kpi-card');
    if (cards.length === 0 && analyticsContainer) {
      // Fallback: try card-like items inside analytics grid
      enhanceByHeaders(content);
      return;
    }
    attachControlsToCards(cards);
  }

  function enhanceByHeaders(root) {
    const headers = root.querySelectorAll('.product-header h4, h4, h3');
    const used = new Set();
    headers.forEach(h => {
      const name = (h.textContent || '').trim();
      if (!name || used.has(name)) return;
      used.add(name);
      const wrapper = h.closest('.product-analytics-card') || h.parentElement;
      if (!wrapper) return;
      injectToolbar(wrapper, name);
    });
  }

  function attachControlsToCards(cards) {
    cards.forEach(card => {
      const titleEl = card.querySelector('h4, .product-name, .product-header h4');
      const name = titleEl ? (titleEl.textContent || '').trim() : '';
      if (!name) return;
      injectToolbar(card, name);
    });
  }

  function injectToolbar(container, productName) {
    if (container.querySelector('.inline-stock-toolbar')) return;
    const p = findProductByName(productName);
    const stock = p ? (p.stock || 0) : 0;
    const bar = document.createElement('div');
    bar.className = 'inline-stock-toolbar';
    bar.style.marginTop = '8px';
    bar.style.display = 'flex';
    bar.style.gap = '8px';
    bar.innerHTML = `
      <span style="font-size:12px;color:#64748b">Stock: <b id="stock-val-${cssSafe(productName)}">${stock}</b></span>
      <button class="btn-secondary" data-action="add">+ Stock</button>
      <button class="btn-secondary" data-action="sub">- Stock</button>
    `;
    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      adjustStockByName(productName, action);
    });
    container.appendChild(bar);
  }

  function cssSafe(s) { return s.replace(/[^a-z0-9_-]/gi, '_'); }

  function findProductByName(name) {
    if (!window.inventoryManager) return null;
    return window.inventoryManager.products.find(p => (p.name || '').toLowerCase() === name.toLowerCase());
  }

  function adjustStockByName(name, action) {
    const p = findProductByName(name);
    if (!p) { alert('Product not found'); return; }
    const qtyStr = prompt(action === 'add' ? 'Add how many units to stock?' : 'Subtract how many units (sold/adjustment)?', '1');
    const qty = Number(qtyStr);
    if (!qty || qty < 0) return;
    if (action === 'add') {
      p.stock = (p.stock || 0) + qty;
    } else {
      p.sold = (p.sold || 0) + qty;
      p.stock = Math.max(0, (p.stock || 0) - qty);
    }
    try { window.inventoryManager.processInventoryData(); } catch {}
    const label = document.getElementById(`stock-val-${cssSafe(name)}`);
    if (label) label.textContent = String(p.stock || 0);
  }
})();
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
                            <button class="btn-primary" onclick="window.app.showAddProductForm()">
                                <i class="fas fa-plus"></i> Add New Product
                            </button>
                            <button class="btn-secondary" onclick="window.app.generateInventoryReport()">
                                <i class="fas fa-file-alt"></i> Generate Report
                            </button>
                            <button class="btn-secondary" onclick="window.app.exportInventoryData()">
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
                        
                        <div class="overview-card">
                            <div class="overview-icon">
                                <i class="fas fa-dollar-sign"></i>
                            </div>
                            <div class="overview-content">
                                <h3>Total Inventory Value</h3>
                                <div class="overview-value">UGX ${data.reduce((sum, p) => sum + (p.stock * p.wholesaleCost), 0).toLocaleString()}</div>
                                <div class="overview-subtitle">At Cost</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Add New Product Form (Hidden by default) -->
                    <div id="add-product-form" class="add-product-section" style="display: none;">
                        <div class="form-header">
                            <h3><i class="fas fa-plus-circle"></i> Add New Product</h3>
                            <button class="btn-close" onclick="window.app.hideAddProductForm()">&times;</button>
                        </div>
                        <form id="new-product-form" class="product-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label><i class="fas fa-tag"></i> Product Name *</label>
                                    <input type="text" name="name" required placeholder="e.g. Premium T-Shirt">
                                </div>
                                <div class="form-group">
                                    <label><i class="fas fa-layer-group"></i> Category *</label>
                                    <select name="category" required>
                                        <option value="">Select Category</option>
                                        <option value="Clothing">Clothing</option>
                                        <option value="Footwear">Footwear</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Health">Health</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label><i class="fas fa-barcode"></i> SKU *</label>
                                    <input type="text" name="sku" required placeholder="e.g. TSH-001">
                                </div>
                                <div class="form-group">
                                    <label><i class="fas fa-truck"></i> Supplier</label>
                                    <input type="text" name="supplier" placeholder="e.g. Fashion Forward Ltd">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label><i class="fas fa-shopping-cart"></i> Wholesale Cost (UGX) *</label>
                                    <input type="number" name="wholesaleCost" required min="0" placeholder="e.g. 8000">
                                </div>
                                <div class="form-group">
                                    <label><i class="fas fa-tag"></i> Retail Price (UGX) *</label>
                                    <input type="number" name="retailCost" required min="0" placeholder="e.g. 15000">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label><i class="fas fa-boxes"></i> Initial Stock *</label>
                                    <input type="number" name="stock" required min="0" placeholder="e.g. 100">
                                </div>
                                <div class="form-group">
                                    <label><i class="fas fa-info-circle"></i> Description</label>
                                    <input type="text" name="description" placeholder="Product description">
                                </div>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn-primary">
                                    <i class="fas fa-save"></i> Add Product
                                </button>
                                <button type="button" class="btn-secondary" onclick="window.app.hideAddProductForm()">
                                    <i class="fas fa-times"></i> Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div class="product-analytics">
                        <h3><i class="fas fa-chart-bar"></i> Product Performance Analytics</h3>
                        <div class="analytics-grid">
                            ${data.map(product => `
                                <div class="product-analytics-card" data-product-id="${product.id}">
                                    <div class="product-header">
                                        <h4>${product.name}</h4>
                                        <div class="product-actions">
                                            <span class="category-badge">${product.category}</span>
                                            <button class="btn-delete" onclick="window.app.deleteProduct(${product.id}, '${product.name}')" title="Delete Product">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="product-metrics">
                                        <div class="metric">
                                            <span class="metric-label">Stock Level</span>
                                            <div class="metric-value-container">
                                                <span class="metric-value ${product.stock < 20 ? 'warning' : 'normal'}" id="stock-${product.id}">${product.stock}</span>
                                                <div class="stock-controls">
                                                    <button class="btn-stock btn-add" onclick="window.app.adjustStock(${product.id}, 'add')" title="Add Stock">
                                                        <i class="fas fa-plus"></i>
                                                    </button>
                                                    <button class="btn-stock btn-subtract" onclick="window.app.adjustStock(${product.id}, 'subtract')" title="Subtract Stock">
                                                        <i class="fas fa-minus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="metric">
                                            <span class="metric-label">Sold</span>
                                            <span class="metric-value" id="sold-${product.id}">${product.sold || 0}</span>
                                        </div>
                                        <div class="metric">
                                            <span class="metric-label">Profit Margin</span>
                                            <span class="metric-value">${product.profitMargin}%</span>
                                        </div>
                                        <div class="metric">
                                            <span class="metric-label">SKU</span>
                                            <span class="metric-value">${product.sku}</span>
                                        </div>
                                        <div class="metric">
                                            <span class="metric-label">Wholesale Cost</span>
                                            <span class="metric-value">UGX ${product.wholesaleCost.toLocaleString()}</span>
                                        </div>
                                        <div class="metric">
                                            <span class="metric-label">Retail Price</span>
                                            <span class="metric-value">UGX ${product.retailCost.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            // Setup form event listener
            this.setupProductForm();
            
        } catch (error) {
            console.error('Error loading inventory management:', error);
            document.querySelector('.main-content').innerHTML = '<p>Error loading inventory data</p>';
        }
    }

    // Product Management Methods
    showAddProductForm() {
        const form = document.getElementById('add-product-form');
        if (form) {
            form.style.display = 'block';
            form.scrollIntoView({ behavior: 'smooth' });
        }
    }

    hideAddProductForm() {
        const form = document.getElementById('add-product-form');
        if (form) {
            form.style.display = 'none';
            document.getElementById('new-product-form').reset();
        }
    }

    setupProductForm() {
        const form = document.getElementById('new-product-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleAddProduct(form);
            });
        }
    }

    async handleAddProduct(form) {
        try {
            const formData = new FormData(form);
            const productData = {
                name: formData.get('name'),
                category: formData.get('category'),
                sku: formData.get('sku'),
                supplier: formData.get('supplier') || 'Unknown Supplier',
                wholesaleCost: parseFloat(formData.get('wholesaleCost')),
                retailCost: parseFloat(formData.get('retailCost')),
                stock: parseInt(formData.get('stock')),
                sold: 0,
                description: formData.get('description') || '',
                profitMargin: ((parseFloat(formData.get('retailCost')) - parseFloat(formData.get('wholesaleCost'))) / parseFloat(formData.get('retailCost'))) * 100,
                lastRestock: new Date().toISOString().split('T')[0],
                reorderPoint: Math.ceil(parseInt(formData.get('stock')) * 0.2)
            };

            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                this.showSuccess('Product added successfully!');
                this.hideAddProductForm();
                this.loadProducts(); // Reload the page to show new product
            } else {
                this.showError('Failed to add product. Please try again.');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            this.showError('Error adding product. Please check your connection.');
        }
    }

    async deleteProduct(productId, productName) {
        console.log('🗑️ Delete product called:', productId, productName);
        if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            console.log('🚀 Sending DELETE request for product:', productId);
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                console.log('✅ Product deleted successfully');
                this.showSuccess(`Product "${productName}" deleted successfully!`);
                this.loadProducts(); // Reload the page
            } else {
                console.error('❌ Delete failed:', response.status);
                this.showError('Failed to delete product. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            this.showError('Error deleting product. Please check your connection.');
        }
    }

    async adjustStock(productId, action) {
        console.log('📦 Adjust stock called:', productId, action);
        const product = await this.getProductById(productId);
        if (!product) {
            console.error('❌ Product not found:', productId);
            this.showError('Product not found.');
            return;
        }

        const actionText = action === 'add' ? 'add to stock' : 'subtract from stock';
        const quantityStr = prompt(`How many units do you want to ${actionText} for "${product.name}"?`, '1');
        const quantity = parseInt(quantityStr);

        if (isNaN(quantity) || quantity <= 0) {
            this.showError('Please enter a valid positive number.');
            return;
        }

        try {
            const updateData = { ...product };
            
            if (action === 'add') {
                updateData.stock = product.stock + quantity;
                console.log(`➕ Adding ${quantity} to stock. New stock: ${updateData.stock}`);
            } else {
                if (product.stock < quantity) {
                    this.showError('Cannot subtract more than available stock.');
                    return;
                }
                updateData.stock = product.stock - quantity;
                updateData.sold = (product.sold || 0) + quantity;
                console.log(`➖ Subtracting ${quantity} from stock. New stock: ${updateData.stock}, New sold: ${updateData.sold}`);
            }

            console.log('🚀 Sending PUT request with data:', updateData);
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                console.log('✅ Stock updated successfully');
                this.showSuccess(`${quantity} units ${action === 'add' ? 'added to' : 'subtracted from'} ${product.name}.`);
                this.loadProducts(); // Reload to show updated values
            } else {
                console.error('❌ Stock update failed:', response.status);
                this.showError('Failed to update stock. Please try again.');
            }
        } catch (error) {
            console.error('Error updating stock:', error);
            this.showError('Error updating stock. Please check your connection.');
        }
    }

    async getProductById(productId) {
        try {
            const response = await fetch('/api/products');
            const products = await response.json();
            return products.find(p => p.id === productId);
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    }

    generateInventoryReport() {
        // Generate a comprehensive inventory report
        const report = {
            timestamp: new Date().toISOString(),
            generatedBy: 'Shop Analyser System',
            summary: {
                totalProducts: document.querySelectorAll('.product-analytics-card').length,
                lowStockItems: document.querySelectorAll('.metric-value.warning').length,
                totalValue: document.querySelector('.overview-value').textContent
            }
        };
        
        console.log('Inventory Report Generated:', report);
        this.showSuccess('Inventory report generated! Check console for details.');
    }

    exportInventoryData() {
        // Export inventory data as JSON
        fetch('/api/products')
            .then(response => response.json())
            .then(data => {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
                this.showSuccess('Inventory data exported successfully!');
            })
            .catch(error => {
                console.error('Error exporting data:', error);
                this.showError('Error exporting data. Please try again.');
            });
    }

    showSuccess(message) {
        // Create a temporary success message
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showError(message) {
        // Create a temporary error message
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
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
    window.app = new ShopAnalyserApp();
    window.shopAnalyser = window.app; // Keep both for compatibility
    
    // Add global test function for debugging
    window.testInventory = function() {
        console.log('🧪 Testing inventory functions...');
        console.log('window.app exists:', !!window.app);
        console.log('adjustStock function exists:', typeof window.app.adjustStock);
        console.log('deleteProduct function exists:', typeof window.app.deleteProduct);
        console.log('showAddProductForm function exists:', typeof window.app.showAddProductForm);
        console.log('logout function exists:', typeof window.logout);
        
        // Test API connectivity
        fetch('/api/products')
            .then(response => response.json())
            .then(data => {
                console.log('✅ API connection working. Products count:', data.length);
                console.log('Sample product:', data[0]);
            })
            .catch(error => {
                console.error('❌ API connection failed:', error);
            });
    };

    // Add quick test functions
    window.testDelete = function() {
        console.log('🗑️ Testing delete function...');
        if (window.app && window.app.deleteProduct) {
            console.log('✅ Delete function available');
        } else {
            console.error('❌ Delete function not available');
        }
    };

    window.testStock = function() {
        console.log('📦 Testing stock adjustment...');
        if (window.app && window.app.adjustStock) {
            console.log('✅ Stock adjustment function available');
        } else {
            console.error('❌ Stock adjustment function not available');
        }
    };
    
    console.log('✅ Shop Analyser App initialized successfully!');
    console.log('🧪 Run window.testInventory() to test functions');
});
