// Enterprise-Grade Inventory Management with AI-Powered Intelligence
class InventoryManagementEnterprise {
    constructor() {
        this.products = [];
        this.suppliers = [];
        this.reorderAlerts = [];
        this.demandForecasts = {};
        this.init();
    }

    async init() {
        console.log('🏪 Initializing Enterprise Inventory Management...');
        await this.loadData();
        this.setupEventListeners();
        this.startRealTimeMonitoring();
        this.generateAIInsights();
        console.log('✅ Enterprise Inventory Management initialized!');
    }

    async loadData() {
        try {
            const [productsResponse, suppliersResponse] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/suppliers')
            ]);
            
            this.products = await productsResponse.json();
            this.suppliers = await suppliersResponse.json();
            
            this.processInventoryData();
        } catch (error) {
            console.error('Error loading inventory data:', error);
        }
    }

    processInventoryData() {
        // Process products for AI analysis
        this.products.forEach(product => {
            this.calculateProductMetrics(product);
            this.generateDemandForecast(product);
            this.checkReorderStatus(product);
        });
    }

    calculateProductMetrics(product) {
        // Calculate advanced metrics
        product.turnoverRate = this.calculateTurnoverRate(product);
        product.profitabilityScore = this.calculateProfitabilityScore(product);
        product.stockoutRisk = this.calculateStockoutRisk(product);
        product.overstockRisk = this.calculateOverstockRisk(product);
        product.optimalStockLevel = this.calculateOptimalStockLevel(product);
    }

    calculateTurnoverRate(product) {
        const daysInPeriod = 30;
        const averageStock = (product.stock + product.sold) / 2;
        return averageStock > 0 ? (product.sold / averageStock) * (365 / daysInPeriod) : 0;
    }

    calculateProfitabilityScore(product) {
        const margin = product.profitMargin / 100;
        const turnover = this.calculateTurnoverRate(product);
        return (margin * turnover * 100).toFixed(2);
    }

    calculateStockoutRisk(product) {
        const daysUntilReorder = this.getSupplierLeadTime(product.supplier);
        const dailyDemand = product.sold / 30;
        const safetyStock = this.calculateSafetyStock(dailyDemand, daysUntilReorder);
        const stockoutProbability = this.calculateStockoutProbability(product.stock, dailyDemand, daysUntilReorder, safetyStock);
        return Math.min(stockoutProbability * 100, 100).toFixed(1);
    }

    calculateOverstockRisk(product) {
        const dailyDemand = product.sold / 30;
        const optimalStock = this.calculateOptimalStockLevel(product);
        const overstockAmount = Math.max(0, product.stock - optimalStock);
        const overstockCost = overstockAmount * product.wholesaleCost;
        const totalValue = product.stock * product.wholesaleCost;
        return totalValue > 0 ? (overstockCost / totalValue * 100).toFixed(1) : 0;
    }

    calculateOptimalStockLevel(product) {
        const dailyDemand = product.sold / 30;
        const leadTime = this.getSupplierLeadTime(product.supplier);
        const safetyStock = this.calculateSafetyStock(dailyDemand, leadTime);
        const cycleStock = dailyDemand * leadTime;
        return Math.ceil(cycleStock + safetyStock);
    }

    calculateSafetyStock(dailyDemand, leadTime, serviceLevel = 0.95) {
        const zScore = this.getZScore(serviceLevel);
        const demandVariability = dailyDemand * 0.2; // 20% variability
        return Math.ceil(zScore * Math.sqrt(leadTime) * demandVariability);
    }

    calculateStockoutProbability(currentStock, dailyDemand, leadTime, safetyStock) {
        const expectedDemand = dailyDemand * leadTime;
        const availableStock = currentStock - safetyStock;
        if (availableStock <= 0) return 1;
        
        // Simplified probability calculation
        const stockoutRisk = Math.max(0, (expectedDemand - availableStock) / expectedDemand);
        return Math.min(stockoutRisk, 1);
    }

    generateDemandForecast(product) {
        const forecast = {
            shortTerm: this.forecastShortTermDemand(product),
            mediumTerm: this.forecastMediumTermDemand(product),
            longTerm: this.forecastLongTermDemand(product),
            seasonalFactors: this.calculateSeasonalFactors(),
            marketTrends: this.analyzeMarketTrends(product.category)
        };
        
        this.demandForecasts[product.id] = forecast;
        return forecast;
    }

    forecastShortTermDemand(product) {
        const baseDemand = product.sold / 30; // Daily demand
        const trend = this.calculateDemandTrend(product);
        const seasonalFactor = this.getSeasonalFactor(new Date());
        return Math.round(baseDemand * (1 + trend) * seasonalFactor * 7); // 7-day forecast
    }

    forecastMediumTermDemand(product) {
        const baseDemand = product.sold;
        const trend = this.calculateDemandTrend(product);
        const seasonalFactor = this.getSeasonalFactor(new Date());
        const marketFactor = this.getMarketGrowthFactor(product.category);
        return Math.round(baseDemand * (1 + trend) * seasonalFactor * marketFactor);
    }

    forecastLongTermDemand(product) {
        const baseDemand = product.sold * 3; // 3-month base
        const trend = this.calculateDemandTrend(product);
        const seasonalFactor = this.getSeasonalFactor(new Date());
        const marketFactor = this.getMarketGrowthFactor(product.category);
        const economicFactor = this.getEconomicOutlookFactor();
        return Math.round(baseDemand * (1 + trend) * seasonalFactor * marketFactor * economicFactor);
    }

    calculateDemandTrend(product) {
        // Simplified trend calculation
        const recentSales = product.sold;
        const historicalAverage = product.sold * 0.9; // Assume 10% growth
        return (recentSales - historicalAverage) / historicalAverage;
    }

    getSeasonalFactor(date) {
        const month = date.getMonth();
        // Seasonal factors for Uganda retail (can be enhanced with real data)
        const factors = [0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 0.9, 0.8, 0.9];
        return factors[month];
    }

    getMarketGrowthFactor(category) {
        // Market growth factors by category
        const growthFactors = {
            'Clothing': 1.15,
            'Footwear': 1.12,
            'Accessories': 1.18,
            'Electronics': 1.25,
            'Health': 1.08
        };
        return growthFactors[category] || 1.1;
    }

    getEconomicOutlookFactor() {
        // Economic outlook factor (can be enhanced with real economic data)
        return 1.05; // 5% growth assumption
    }

    checkReorderStatus(product) {
        const optimalLevel = this.calculateOptimalStockLevel(product);
        const reorderPoint = optimalLevel * 0.3; // 30% of optimal level
        
        if (product.stock <= reorderPoint) {
            this.reorderAlerts.push({
                product: product,
                urgency: product.stock <= reorderPoint * 0.5 ? 'critical' : 'high',
                recommendedQuantity: optimalLevel - product.stock,
                estimatedCost: (optimalLevel - product.stock) * product.wholesaleCost,
                supplier: this.findSupplier(product.supplier)
            });
        }
    }

    findSupplier(supplierName) {
        return this.suppliers.find(s => s.name === supplierName);
    }

    getSupplierLeadTime(supplierName) {
        const supplier = this.findSupplier(supplierName);
        if (supplier) {
            // Lead time based on supplier reliability
            const baseLeadTime = 7; // 7 days base
            const reliabilityFactor = supplier.reliability === 'Excellent' ? 0.8 : 
                                    supplier.reliability === 'Good' ? 1.0 : 1.2;
            return Math.ceil(baseLeadTime * reliabilityFactor);
        }
        return 7; // Default 7 days
    }

    getZScore(serviceLevel) {
        const zScores = { 0.90: 1.28, 0.95: 1.65, 0.99: 2.33 };
        return zScores[serviceLevel] || 1.65;
    }

    setupEventListeners() {
        // Setup event listeners for inventory management
        document.addEventListener('DOMContentLoaded', () => {
            this.setupInventoryControls();
        });
    }

    setupInventoryControls() {
        // Add inventory management controls to the UI
        const inventoryControls = `
            <div class="inventory-controls">
                <button class="btn-primary" onclick="inventoryManager.generateReorderReport()">
                    <i class="fas fa-file-alt"></i> Generate Reorder Report
                </button>
                <button class="btn-secondary" onclick="inventoryManager.exportInventoryData()">
                    <i class="fas fa-download"></i> Export Data
                </button>
                <button class="btn-secondary" onclick="inventoryManager.showAIAnalytics()">
                    <i class="fas fa-robot"></i> AI Analytics
                </button>
            </div>
        `;
        
        // Insert controls into the inventory page
        const contentArea = document.getElementById('content-area');
        if (contentArea && contentArea.innerHTML.includes('Inventory Management')) {
            const controlsContainer = contentArea.querySelector('.inventory-controls');
            if (!controlsContainer) {
                contentArea.insertAdjacentHTML('afterbegin', inventoryControls);
            }
        }
    }

    startRealTimeMonitoring() {
        // Real-time inventory monitoring
        setInterval(() => {
            this.updateInventoryStatus();
            this.checkReorderAlerts();
            this.updateAIForecasts();
        }, 60000); // Check every minute
    }

    updateInventoryStatus() {
        // Update real-time inventory status
        this.products.forEach(product => {
            this.calculateProductMetrics(product);
            this.checkReorderStatus(product);
        });
    }

    checkReorderAlerts() {
        // Process reorder alerts
        if (this.reorderAlerts.length > 0) {
            this.displayReorderAlerts();
        }
    }

    updateAIForecasts() {
        // Update AI demand forecasts
        this.products.forEach(product => {
            this.generateDemandForecast(product);
        });
    }

    displayReorderAlerts() {
        // Display reorder alerts in the UI
        const alertsContainer = document.getElementById('reorder-alerts');
        if (alertsContainer) {
            alertsContainer.innerHTML = this.reorderAlerts.map(alert => `
                <div class="reorder-alert ${alert.urgency}">
                    <div class="alert-header">
                        <h4>${alert.product.name}</h4>
                        <span class="urgency-badge ${alert.urgency}">${alert.urgency.toUpperCase()}</span>
                    </div>
                    <div class="alert-details">
                        <p>Current Stock: ${alert.product.stock}</p>
                        <p>Recommended Order: ${alert.recommendedQuantity} units</p>
                        <p>Estimated Cost: UGX ${alert.estimatedCost.toLocaleString()}</p>
                        <p>Supplier: ${alert.supplier.name}</p>
                    </div>
                    <div class="alert-actions">
                        <button class="btn-primary" onclick="inventoryManager.placeOrder(${alert.product.id}, ${alert.recommendedQuantity})">
                            Place Order
                        </button>
                        <button class="btn-secondary" onclick="inventoryManager.snoozeAlert(${alert.product.id})">
                            Snooze
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    generateReorderReport() {
        const report = {
            timestamp: new Date().toISOString(),
            totalProducts: this.products.length,
            lowStockProducts: this.reorderAlerts.length,
            totalReorderValue: this.reorderAlerts.reduce((sum, alert) => sum + alert.estimatedCost, 0),
            recommendations: this.generateInventoryRecommendations()
        };
        
        console.log('Reorder Report Generated:', report);
        alert('Reorder report generated successfully! Check console for details.');
        return report;
    }

    generateInventoryRecommendations() {
        const recommendations = [];
        
        // Analyze inventory performance
        const lowTurnoverProducts = this.products.filter(p => p.turnoverRate < 2);
        const highProfitProducts = this.products.filter(p => p.profitabilityScore > 50);
        const stockoutRisks = this.products.filter(p => p.stockoutRisk > 30);
        
        if (lowTurnoverProducts.length > 0) {
            recommendations.push({
                type: 'warning',
                message: `${lowTurnoverProducts.length} products have low turnover rates. Consider promotions or price adjustments.`,
                products: lowTurnoverProducts.map(p => p.name)
            });
        }
        
        if (highProfitProducts.length > 0) {
            recommendations.push({
                type: 'opportunity',
                message: `${highProfitProducts.length} products show high profitability. Consider increasing stock levels.`,
                products: highProfitProducts.map(p => p.name)
            });
        }
        
        if (stockoutRisks.length > 0) {
            recommendations.push({
                type: 'critical',
                message: `${stockoutRisks.length} products are at high risk of stockout. Immediate action required.`,
                products: stockoutRisks.map(p => p.name)
            });
        }
        
        return recommendations;
    }

    exportInventoryData() {
        const data = {
            products: this.products,
            suppliers: this.suppliers,
            forecasts: this.demandForecasts,
            alerts: this.reorderAlerts,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    showAIAnalytics() {
        const analytics = {
            demandForecasts: this.demandForecasts,
            inventoryMetrics: this.products.map(p => ({
                name: p.name,
                turnoverRate: p.turnoverRate,
                profitabilityScore: p.profitabilityScore,
                stockoutRisk: p.stockoutRisk,
                overstockRisk: p.overstockRisk
            })),
            recommendations: this.generateInventoryRecommendations()
        };
        
        console.log('AI Inventory Analytics:', analytics);
        alert('AI Analytics displayed in console. Check for detailed insights.');
    }

    placeOrder(productId, quantity) {
        const product = this.products.find(p => p.id === productId);
        const supplier = this.findSupplier(product.supplier);
        
        if (product && supplier) {
            const order = {
                id: Date.now(),
                productId: productId,
                productName: product.name,
                quantity: quantity,
                supplier: supplier.name,
                totalCost: quantity * product.wholesaleCost,
                orderDate: new Date().toISOString(),
                expectedDelivery: this.calculateExpectedDelivery(supplier.reliability)
            };
            
            console.log('Order Placed:', order);
            alert(`Order placed for ${quantity} units of ${product.name}. Expected delivery: ${order.expectedDelivery}`);
            
            // Remove from reorder alerts
            this.reorderAlerts = this.reorderAlerts.filter(alert => alert.product.id !== productId);
            this.displayReorderAlerts();
        }
    }

    snoozeAlert(productId) {
        // Snooze reorder alert for 24 hours
        const alert = this.reorderAlerts.find(a => a.product.id === productId);
        if (alert) {
            alert.snoozedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
            this.displayReorderAlerts();
        }
    }

    calculateExpectedDelivery(reliability) {
        const baseDays = 7;
        const reliabilityFactor = reliability === 'Excellent' ? 0.8 : 
                                reliability === 'Good' ? 1.0 : 1.2;
        const deliveryDays = Math.ceil(baseDays * reliabilityFactor);
        
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
        return deliveryDate.toLocaleDateString();
    }

    generateAIInsights() {
        // Generate AI insights for inventory optimization
        const insights = [];
        
        // Low stock insights
        const lowStockProducts = this.products.filter(p => p.stockoutRisk > 50);
        if (lowStockProducts.length > 0) {
            insights.push({
                type: 'critical',
                title: 'High Stockout Risk',
                message: `${lowStockProducts.length} products are at critical stock levels. Immediate reordering required.`,
                impact: 'High',
                confidence: 95,
                action: 'Place immediate orders for low-stock items'
            });
        }
        
        // High profitability opportunities
        const highProfitProducts = this.products.filter(p => p.profitabilityScore > 60);
        if (highProfitProducts.length > 0) {
            insights.push({
                type: 'opportunity',
                title: 'High Profitability Products',
                message: `${highProfitProducts.length} products show exceptional profitability. Consider increasing inventory.`,
                impact: 'Medium',
                confidence: 88,
                action: 'Increase stock levels for high-profit products'
            });
        }
        
        // Overstock warnings
        const overstockedProducts = this.products.filter(p => p.overstockRisk > 40);
        if (overstockedProducts.length > 0) {
            insights.push({
                type: 'warning',
                title: 'Overstock Risk',
                message: `${overstockedProducts.length} products are overstocked. Consider promotions or returns.`,
                impact: 'Medium',
                confidence: 82,
                action: 'Implement promotional strategies for overstocked items'
            });
        }
        
        return insights;
    }
}

// Initialize inventory manager
window.inventoryManager = new InventoryManagementEnterprise();
