// Advanced Analytics Module for Shop Analyser
export class AnalyticsEngine {
    constructor() {
        this.products = [];
        this.charts = {};
        this.filters = {
            dateRange: 30,
            category: '',
            metric: 'revenue'
        };
    }

    async initialize() {
        await this.loadData();
        this.setupEventListeners();
        this.generateAnalytics();
        this.renderCharts();
        this.updateMetrics();
        this.generateInsights();
    }

    async loadData() {
        try {
            const response = await fetch('/api/products');
            this.products = await response.json();
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = [];
        }
    }

    setupEventListeners() {
        // Filter controls
        document.getElementById('date-range')?.addEventListener('change', (e) => {
            this.filters.dateRange = parseInt(e.target.value);
            this.generateAnalytics();
        });

        document.getElementById('category-filter')?.addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.generateAnalytics();
        });

        document.getElementById('metric-filter')?.addEventListener('change', (e) => {
            this.filters.metric = e.target.value;
            this.generateAnalytics();
        });

        // Chart type controls
        document.querySelectorAll('.chart-controls button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const chartType = e.target.dataset.chart;
                const container = e.target.closest('.chart-card');
                const chartId = container.querySelector('canvas').id;
                this.updateChartType(chartId, chartType);
                
                // Update active button
                container.querySelectorAll('.chart-controls button').forEach(b => 
                    b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    generateAnalytics() {
        const filteredProducts = this.getFilteredProducts();
        this.analytics = this.calculateAnalytics(filteredProducts);
        this.updateMetrics();
        this.renderCharts();
        this.updateProductTable();
    }

    getFilteredProducts() {
        let filtered = [...this.products];
        
        if (this.filters.category) {
            filtered = filtered.filter(p => p.category === this.filters.category);
        }
        
        // For MVP, we'll simulate date filtering
        // In a real app, you'd filter by actual dates
        return filtered;
    }

    calculateAnalytics(products) {
        const totalRevenue = products.reduce((sum, p) => sum + (p.retailCost * p.quantitySold), 0);
        const totalCost = products.reduce((sum, p) => sum + (p.wholesaleCost * p.quantitySold), 0);
        const totalProfit = totalRevenue - totalCost;
        const totalUnits = products.reduce((sum, p) => sum + p.quantitySold, 0);
        const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

        // Category analysis
        const categories = {};
        products.forEach(p => {
            const category = p.category || 'Uncategorized';
            if (!categories[category]) {
                categories[category] = { revenue: 0, profit: 0, units: 0, count: 0 };
            }
            categories[category].revenue += p.retailCost * p.quantitySold;
            categories[category].profit += (p.retailCost - p.wholesaleCost) * p.quantitySold;
            categories[category].units += p.quantitySold;
            categories[category].count++;
        });

        // Top products analysis
        const topProducts = products
            .sort((a, b) => (b.retailCost * b.quantitySold) - (a.retailCost * a.quantitySold))
            .slice(0, 10);

        // Performance analysis
        const performanceData = products.map(p => {
            const revenue = p.retailCost * p.quantitySold;
            const profit = (p.retailCost - p.wholesaleCost) * p.quantitySold;
            const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
            const performance = (revenue * margin) / 100; // Performance score
            
            return {
                ...p,
                revenue,
                profit,
                margin,
                performance
            };
        });

        return {
            totalRevenue,
            totalCost,
            totalProfit,
            totalUnits,
            profitMargin,
            categories,
            topProducts,
            performanceData,
            productCount: products.length
        };
    }

    updateMetrics() {
        if (!this.analytics) return;

        document.getElementById('total-revenue-metric').textContent = 
            `UGX ${this.analytics.totalRevenue.toLocaleString()}`;
        document.getElementById('net-profit-metric').textContent = 
            `UGX ${this.analytics.totalProfit.toLocaleString()}`;
        document.getElementById('profit-margin-metric').textContent = 
            `${this.analytics.profitMargin.toFixed(1)}%`;
        document.getElementById('units-sold-metric').textContent = 
            this.analytics.totalUnits.toLocaleString();

        // Simulate trend changes (in real app, compare with previous period)
        const trends = this.generateTrends();
        document.getElementById('revenue-change').textContent = `+${trends.revenue}%`;
        document.getElementById('profit-change').textContent = `+${trends.profit}%`;
        document.getElementById('margin-change').textContent = `+${trends.margin}%`;
        document.getElementById('units-change').textContent = `+${trends.units}%`;
    }

    generateTrends() {
        // Simulate realistic trends based on current performance
        const baseTrend = Math.random() * 20 - 5; // -5% to +15%
        return {
            revenue: Math.max(0, (baseTrend + Math.random() * 10)).toFixed(1),
            profit: Math.max(0, (baseTrend + Math.random() * 8)).toFixed(1),
            margin: Math.max(0, (baseTrend * 0.5 + Math.random() * 5)).toFixed(1),
            units: Math.max(0, (baseTrend + Math.random() * 12)).toFixed(1)
        };
    }

    renderCharts() {
        this.renderRevenueChart();
        this.renderCategoryChart();
        this.renderTopProductsChart();
        this.renderProfitAnalysisChart();
    }

    renderRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx || !this.analytics) return;

        // Simulate time series data
        const timeData = this.generateTimeSeriesData();
        
        if (this.charts.revenue) {
            this.charts.revenue.destroy();
        }

        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeData.labels,
                datasets: [{
                    label: 'Revenue (UGX)',
                    data: timeData.revenue,
                    borderColor: '#FF7F2A',
                    backgroundColor: 'rgba(255, 127, 42, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3
                }, {
                    label: 'Profit (UGX)',
                    data: timeData.profit,
                    borderColor: '#1E90FF',
                    backgroundColor: 'rgba(30, 144, 255, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
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
                        ticks: {
                            callback: function(value) {
                                return `UGX ${value.toLocaleString()}`;
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    renderCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx || !this.analytics) return;

        const categoryData = Object.entries(this.analytics.categories).map(([category, data]) => ({
            category,
            revenue: data.revenue
        }));

        if (this.charts.category) {
            this.charts.category.destroy();
        }

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
                        '#9370DB',
                        '#20B2AA',
                        '#FF6347'
                    ],
                    borderWidth: 0,
                    hoverOffset: 15
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
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: UGX ${context.parsed.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    renderTopProductsChart() {
        const ctx = document.getElementById('topProductsChart');
        if (!ctx || !this.analytics) return;

        const topProducts = this.analytics.topProducts.slice(0, 8);

        if (this.charts.topProducts) {
            this.charts.topProducts.destroy();
        }

        this.charts.topProducts = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topProducts.map(p => p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name),
                datasets: [{
                    label: 'Revenue (UGX)',
                    data: topProducts.map(p => p.retailCost * p.quantitySold),
                    backgroundColor: 'rgba(255, 127, 42, 0.8)',
                    borderColor: '#FF7F2A',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
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
                        callbacks: {
                            label: function(context) {
                                return `Revenue: UGX ${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return `UGX ${value.toLocaleString()}`;
                            }
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
    }

    renderProfitAnalysisChart() {
        const ctx = document.getElementById('profitAnalysisChart');
        if (!ctx || !this.analytics) return;

        const profitData = this.analytics.performanceData
            .sort((a, b) => b.profit - a.profit)
            .slice(0, 10);

        if (this.charts.profitAnalysis) {
            this.charts.profitAnalysis.destroy();
        }

        this.charts.profitAnalysis = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: profitData.map(p => p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name),
                datasets: [{
                    label: 'Profit (UGX)',
                    data: profitData.map(p => p.profit),
                    backgroundColor: function(context) {
                        const value = context.parsed.y;
                        return value > 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)';
                    },
                    borderColor: function(context) {
                        const value = context.parsed.y;
                        return value > 0 ? '#10b981' : '#ef4444';
                    },
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
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
                        callbacks: {
                            label: function(context) {
                                return `Profit: UGX ${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return `UGX ${value.toLocaleString()}`;
                            }
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
    }

    generateTimeSeriesData() {
        const days = this.filters.dateRange;
        const labels = [];
        const revenue = [];
        const profit = [];
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            
            // Simulate realistic daily data
            const baseRevenue = this.analytics.totalRevenue / days;
            const dailyRevenue = baseRevenue * (0.8 + Math.random() * 0.4);
            const dailyProfit = dailyRevenue * (this.analytics.profitMargin / 100) * (0.9 + Math.random() * 0.2);
            
            revenue.push(Math.round(dailyRevenue));
            profit.push(Math.round(dailyProfit));
        }
        
        return { labels, revenue, profit };
    }

    updateChartType(chartId, type) {
        if (chartId === 'revenueChart' && this.charts.revenue) {
            this.charts.revenue.config.type = type;
            this.charts.revenue.update();
        }
    }

    updateProductTable() {
        const tbody = document.getElementById('product-analysis-body');
        if (!tbody || !this.analytics) return;

        const sortedProducts = this.analytics.performanceData
            .sort((a, b) => b.performance - a.performance);

        tbody.innerHTML = sortedProducts.map(product => {
            const performanceClass = product.performance > 100000 ? 'excellent' : 
                                   product.performance > 50000 ? 'good' : 
                                   product.performance > 10000 ? 'average' : 'poor';
            
            return `
                <tr>
                    <td>
                        <div class="product-cell">
                            <img src="${product.photo || 'https://via.placeholder.com/32'}" 
                                 alt="${product.name}" class="product-thumb">
                            <span>${product.name}</span>
                        </div>
                    </td>
                    <td><span class="category-badge">${product.category || 'Uncategorized'}</span></td>
                    <td>UGX ${product.revenue.toLocaleString()}</td>
                    <td>UGX ${product.profit.toLocaleString()}</td>
                    <td>${product.margin.toFixed(1)}%</td>
                    <td>${product.quantitySold}</td>
                    <td>
                        <span class="stock-indicator ${product.currentStock < 10 ? 'low' : 
                                                      product.currentStock < 50 ? 'medium' : 'good'}">
                            ${product.currentStock || 0}
                        </span>
                    </td>
                    <td>
                        <span class="performance-badge ${performanceClass}">
                            ${performanceClass.toUpperCase()}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    generateInsights() {
        const insightsContainer = document.getElementById('business-insights');
        if (!insightsContainer || !this.analytics) return;

        const insights = this.createBusinessInsights();
        
        insightsContainer.innerHTML = insights.map(insight => `
            <div class="insight-card ${insight.type}">
                <div class="insight-icon">
                    <i class="${insight.icon}"></i>
                </div>
                <div class="insight-content">
                    <h4>${insight.title}</h4>
                    <p>${insight.description}</p>
                    <div class="insight-metric">${insight.metric}</div>
                </div>
            </div>
        `).join('');
    }

    createBusinessInsights() {
        const insights = [];
        
        // Revenue insight
        if (this.analytics.totalRevenue > 1000000) {
            insights.push({
                type: 'success',
                icon: 'fas fa-trophy',
                title: 'Strong Revenue Performance',
                description: 'Your revenue exceeds UGX 1M, indicating healthy business growth.',
                metric: `UGX ${this.analytics.totalRevenue.toLocaleString()}`
            });
        }
        
        // Margin insight
        if (this.analytics.profitMargin > 30) {
            insights.push({
                type: 'success',
                icon: 'fas fa-chart-line',
                title: 'Excellent Profit Margins',
                description: 'Your profit margin is above industry standards.',
                metric: `${this.analytics.profitMargin.toFixed(1)}%`
            });
        } else if (this.analytics.profitMargin < 15) {
            insights.push({
                type: 'warning',
                icon: 'fas fa-exclamation-triangle',
                title: 'Low Profit Margins',
                description: 'Consider optimizing pricing or reducing costs.',
                metric: `${this.analytics.profitMargin.toFixed(1)}%`
            });
        }
        
        // Category insight
        const topCategory = Object.entries(this.analytics.categories)
            .sort(([,a], [,b]) => b.revenue - a.revenue)[0];
        
        if (topCategory) {
            insights.push({
                type: 'info',
                icon: 'fas fa-star',
                title: 'Top Performing Category',
                description: `${topCategory[0]} generates the most revenue.`,
                metric: `UGX ${topCategory[1].revenue.toLocaleString()}`
            });
        }
        
        // Product diversity insight
        if (this.analytics.productCount > 20) {
            insights.push({
                type: 'info',
                icon: 'fas fa-boxes',
                title: 'Good Product Diversity',
                description: 'You have a healthy product portfolio.',
                metric: `${this.analytics.productCount} products`
            });
        }
        
        return insights;
    }
}

// Global functions for buttons
window.exportReport = function() {
    // In a real app, this would generate and download a PDF/Excel report
    alert('Export functionality would generate a comprehensive business report here.');
};

window.printReport = function() {
    window.print();
};

window.applyFilters = function() {
    // This would be handled by the AnalyticsEngine instance
    console.log('Filters applied');
};

// Initialize analytics when DOM is loaded
export async function initializeAnalytics() {
    const analytics = new AnalyticsEngine();
    await analytics.initialize();
    return analytics;
}
