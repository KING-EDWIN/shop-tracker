// Enhanced Dashboard Module for Supermarket Analytics
export class EnhancedDashboard {
    constructor() {
        this.products = [];
        this.categories = {};
        this.charts = {};
        this.kpis = {};
    }

    async initialize() {
        await this.loadData();
        this.calculateKPIs();
        this.updateKPIDisplay();
        this.initializeCharts();
        this.updateTopProducts();
        this.updateAlerts();
        this.setupEventListeners();
    }

    async loadData() {
        try {
            const response = await fetch('/api/products');
            this.products = await response.json();
            this.categorizeProducts();
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = [];
        }
    }

    categorizeProducts() {
        this.categories = {
            'Clothing': [],
            'Footwear': [],
            'Accessories': [],
            'Children': [],
            'Electronics': [],
            'Other': []
        };

        this.products.forEach(product => {
            const name = product.name.toLowerCase();
            if (name.includes('shirt') || name.includes('dress') || name.includes('trousers') || 
                name.includes('suit') || name.includes('blouse') || name.includes('skirt')) {
                this.categories.Clothing.push(product);
            } else if (name.includes('shoes') || name.includes('sneakers') || name.includes('boots') || 
                       name.includes('sandals') || name.includes('flip') || name.includes('canvas')) {
                this.categories.Footwear.push(product);
            } else if (name.includes('watch') || name.includes('belt') || name.includes('bag') || 
                       name.includes('necklace') || name.includes('ring') || name.includes('bracelet')) {
                this.categories.Accessories.push(product);
            } else if (name.includes('kids') || name.includes('children')) {
                this.categories.Children.push(product);
            } else {
                this.categories.Other.push(product);
            }
        });
    }

    calculateKPIs() {
        const totalRevenue = this.products.reduce((sum, product) => 
            sum + (product.retailCost * product.quantitySold), 0);
        
        const totalCost = this.products.reduce((sum, product) => 
            sum + (product.wholesaleCost * product.quantitySold), 0);
        
        const netProfit = totalRevenue - totalCost;
        const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
        const activeProducts = this.products.length;

        this.kpis = {
            totalRevenue,
            netProfit,
            profitMargin,
            activeProducts,
            totalCost
        };
    }

    updateKPIDisplay() {
        document.getElementById('total-revenue').textContent = 
            `UGX ${this.kpis.totalRevenue.toLocaleString()}`;
        document.getElementById('net-profit').textContent = 
            `UGX ${this.kpis.netProfit.toLocaleString()}`;
        document.getElementById('profit-margin').textContent = 
            `${this.kpis.profitMargin.toFixed(1)}%`;
        document.getElementById('active-products').textContent = 
            this.kpis.activeProducts.toString();
    }

    initializeCharts() {
        this.initializeMainChart();
        this.initializeCategoryChart();
    }

    initializeMainChart() {
        const ctx = document.getElementById('profitChart');
        if (!ctx) return;

        const chartType = document.getElementById('chart-type')?.value || 'revenue';
        const data = this.getChartData(chartType);

        this.charts.main = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: data.label,
                    data: data.values,
                    backgroundColor: this.getGradientColors(data.values.length),
                    borderColor: 'rgba(255, 127, 42, 0.8)',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(255, 127, 42, 0.8)',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: UGX ${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return `UGX ${value.toLocaleString()}`;
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    initializeCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        const categoryData = Object.entries(this.categories).map(([category, products]) => {
            const revenue = products.reduce((sum, product) => 
                sum + (product.retailCost * product.quantitySold), 0);
            return { category, revenue };
        }).filter(item => item.revenue > 0);

        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categoryData.map(item => item.category),
                datasets: [{
                    data: categoryData.map(item => item.revenue),
                    backgroundColor: [
                        '#FF7F2A',
                        '#1E90FF',
                        '#32CD32',
                        '#FFD700',
                        '#FF69B4',
                        '#9370DB'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: UGX ${context.parsed.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1000
                }
            }
        });
    }

    getChartData(type) {
        const topProducts = this.products
            .sort((a, b) => {
                switch(type) {
                    case 'revenue':
                        return (b.retailCost * b.quantitySold) - (a.retailCost * a.quantitySold);
                    case 'profit':
                        return ((b.retailCost - b.wholesaleCost) * b.quantitySold) - 
                               ((a.retailCost - a.wholesaleCost) * a.quantitySold);
                    case 'units':
                        return b.quantitySold - a.quantitySold;
                    default:
                        return 0;
                }
            })
            .slice(0, 10);

        return {
            labels: topProducts.map(p => p.name),
            values: topProducts.map(p => {
                switch(type) {
                    case 'revenue':
                        return p.retailCost * p.quantitySold;
                    case 'profit':
                        return (p.retailCost - p.wholesaleCost) * p.quantitySold;
                    case 'units':
                        return p.quantitySold;
                    default:
                        return 0;
                }
            }),
            label: type === 'revenue' ? 'Revenue (UGX)' : 
                   type === 'profit' ? 'Profit (UGX)' : 'Units Sold'
        };
    }

    getGradientColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const hue = (i * 360 / count) % 360;
            colors.push(`hsla(${hue}, 70%, 60%, 0.8)`);
        }
        return colors;
    }

    updateTopProducts() {
        const container = document.getElementById('top-products-list');
        if (!container) return;

        const topProducts = this.products
            .sort((a, b) => ((b.retailCost - b.wholesaleCost) * b.quantitySold) - 
                           ((a.retailCost - a.wholesaleCost) * a.quantitySold))
            .slice(0, 5);

        container.innerHTML = topProducts.map((product, index) => {
            const profit = (product.retailCost - product.wholesaleCost) * product.quantitySold;
            return `
                <div class="top-product-item">
                    <div class="top-product-rank">${index + 1}</div>
                    <div class="top-product-details">
                        <div class="top-product-name">${product.name}</div>
                        <div class="top-product-metric">Profit: UGX ${profit.toLocaleString()}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateAlerts() {
        this.updateLowStockAlerts();
        this.updateSlowMovingAlerts();
    }

    updateLowStockAlerts() {
        const container = document.getElementById('low-stock-items');
        const countElement = document.getElementById('low-stock-count');
        
        // Simulate low stock items (products with quantity sold > 100 are considered low stock)
        const lowStockItems = this.products
            .filter(p => p.quantitySold > 100)
            .slice(0, 5);

        if (countElement) {
            countElement.textContent = lowStockItems.length;
        }

        if (container) {
            container.innerHTML = lowStockItems.map(item => `
                <div class="alert-item">
                    <span class="alert-item-name">${item.name}</span>
                    <span class="alert-item-value">${item.quantitySold} sold</span>
                </div>
            `).join('');
        }
    }

    updateSlowMovingAlerts() {
        const container = document.getElementById('slow-moving-items');
        const countElement = document.getElementById('slow-moving-count');
        
        // Simulate slow moving items (products with quantity sold < 30)
        const slowMovingItems = this.products
            .filter(p => p.quantitySold < 30)
            .slice(0, 5);

        if (countElement) {
            countElement.textContent = slowMovingItems.length;
        }

        if (container) {
            container.innerHTML = slowMovingItems.map(item => `
                <div class="alert-item">
                    <span class="alert-item-name">${item.name}</span>
                    <span class="alert-item-value">${item.quantitySold} sold</span>
                </div>
            `).join('');
        }
    }

    setupEventListeners() {
        // Chart type selector
        const chartTypeSelect = document.getElementById('chart-type');
        if (chartTypeSelect) {
            chartTypeSelect.addEventListener('change', (e) => {
                this.updateMainChart(e.target.value);
            });
        }

        // Time controls
        document.querySelectorAll('.time-controls button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.time-controls button').forEach(b => 
                    b.classList.remove('active'));
                e.target.classList.add('active');
                // For MVP, we'll just refresh the chart
                this.updateMainChart(document.getElementById('chart-type')?.value || 'revenue');
            });
        });

        // Sort controls for top products
        document.querySelectorAll('.top-products .sort-controls button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.top-products .sort-controls button').forEach(b => 
                    b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateTopProductsBySort(e.target.dataset.sort);
            });
        });

        // Refresh AI button
        const refreshBtn = document.getElementById('refresh-ai');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshAIInsights();
            });
        }
    }

    updateMainChart(type) {
        if (this.charts.main) {
            const data = this.getChartData(type);
            this.charts.main.data.labels = data.labels;
            this.charts.main.data.datasets[0].data = data.values;
            this.charts.main.data.datasets[0].label = data.label;
            this.charts.main.update('active');
        }
    }

    updateTopProductsBySort(sortType) {
        const container = document.getElementById('top-products-list');
        if (!container) return;

        let sortedProducts;
        switch(sortType) {
            case 'profit-high':
                sortedProducts = this.products
                    .sort((a, b) => ((b.retailCost - b.wholesaleCost) * b.quantitySold) - 
                                   ((a.retailCost - a.wholesaleCost) * a.quantitySold))
                    .slice(0, 5);
                break;
            case 'revenue-high':
                sortedProducts = this.products
                    .sort((a, b) => (b.retailCost * b.quantitySold) - (a.retailCost * a.quantitySold))
                    .slice(0, 5);
                break;
            case 'units-high':
                sortedProducts = this.products
                    .sort((a, b) => b.quantitySold - a.quantitySold)
                    .slice(0, 5);
                break;
            default:
                sortedProducts = this.products.slice(0, 5);
        }

        container.innerHTML = sortedProducts.map((product, index) => {
            const profit = (product.retailCost - product.wholesaleCost) * product.quantitySold;
            const revenue = product.retailCost * product.quantitySold;
            const metric = sortType === 'revenue-high' ? `Revenue: UGX ${revenue.toLocaleString()}` :
                          sortType === 'units-high' ? `Units: ${product.quantitySold}` :
                          `Profit: UGX ${profit.toLocaleString()}`;
            
            return `
                <div class="top-product-item">
                    <div class="top-product-rank">${index + 1}</div>
                    <div class="top-product-details">
                        <div class="top-product-name">${product.name}</div>
                        <div class="top-product-metric">${metric}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    async refreshAIInsights() {
        // This would trigger a refresh of AI insights
        console.log('Refreshing AI insights...');
        // For now, we'll just reload the data
        await this.loadData();
        this.calculateKPIs();
        this.updateKPIDisplay();
    }
}

// Initialize enhanced dashboard when DOM is loaded
export async function initializeEnhancedDashboard() {
    const dashboard = new EnhancedDashboard();
    await dashboard.initialize();
    return dashboard;
}
