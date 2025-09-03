const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../src')));

// Enterprise-grade sample data
const enterpriseData = {
    users: [
        { id: 1, username: 'admin', role: 'admin', name: 'John Doe', email: 'john@shopanalyser.com' },
        { id: 2, username: 'manager', role: 'manager', name: 'Sarah Smith', email: 'sarah@shopanalyser.com' },
        { id: 3, username: 'cashier', role: 'cashier', name: 'Mike Johnson', email: 'mike@shopanalyser.com' }
    ],
    products: [
        { id: 1, name: "Premium T-Shirt", category: "Clothing", wholesaleCost: 8000, retailCost: 15000, stock: 150, sold: 89, sku: "TSH-001", supplier: "Fashion Forward Ltd", description: "High-quality cotton premium t-shirt", profitMargin: 46.7, lastRestock: "2024-01-15", reorderPoint: 30 },
        { id: 2, name: "Smart Sneakers", category: "Footwear", wholesaleCost: 25000, retailCost: 45000, stock: 75, sold: 42, sku: "SNK-002", supplier: "Shoe Empire", description: "Comfortable smart sneakers with tracking", profitMargin: 44.4, lastRestock: "2024-01-10", reorderPoint: 25 },
        { id: 3, name: "Luxury Watch", category: "Accessories", wholesaleCost: 120000, retailCost: 250000, stock: 25, sold: 8, sku: "WCH-003", supplier: "Time Masters", description: "Premium luxury timepiece", profitMargin: 52.0, lastRestock: "2024-01-05", reorderPoint: 10 },
        { id: 4, name: "Wireless Earbuds", category: "Electronics", wholesaleCost: 15000, retailCost: 35000, stock: 120, sold: 67, sku: "EAR-004", supplier: "Tech Solutions", description: "High-quality wireless earbuds", profitMargin: 57.1, lastRestock: "2024-01-12", reorderPoint: 40 },
        { id: 5, name: "Organic Soap", category: "Health", wholesaleCost: 2000, retailCost: 5000, stock: 300, sold: 156, sku: "SOA-005", supplier: "Natural Health", description: "Organic handmade soap", profitMargin: 60.0, lastRestock: "2024-01-08", reorderPoint: 100 }
    ],
    transactions: [
        { id: 1, date: "2024-01-20", customer: "Regular Customer", items: 3, total: 65000, paymentMethod: "Mobile Money", cashier: "Mike Johnson" },
        { id: 2, date: "2024-01-20", customer: "VIP Customer", items: 1, total: 250000, paymentMethod: "Card", cashier: "Sarah Smith" },
        { id: 3, date: "2024-01-19", customer: "Walk-in", items: 2, total: 40000, paymentMethod: "Cash", cashier: "Mike Johnson" },
        { id: 4, date: "2024-01-19", customer: "Regular Customer", items: 4, total: 85000, paymentMethod: "Mobile Money", cashier: "Sarah Smith" },
        { id: 5, date: "2024-01-18", customer: "VIP Customer", items: 2, total: 120000, paymentMethod: "Card", cashier: "John Doe" }
    ],
    suppliers: [
        { id: 1, name: "Fashion Forward Ltd", category: "Clothing", contact: "+256 701 234 567", email: "orders@fashionforward.ug", rating: 4.8, totalOrders: 45, totalValue: 4500000, lastOrder: "2024-01-15", paymentTerms: "Net 30", reliability: "Excellent" },
        { id: 2, name: "Shoe Empire", category: "Footwear", contact: "+256 702 345 678", email: "purchasing@shoeempire.ug", rating: 4.6, totalOrders: 32, totalValue: 3200000, lastOrder: "2024-01-10", paymentTerms: "Net 45", reliability: "Good" },
        { id: 3, name: "Time Masters", category: "Accessories", contact: "+256 703 456 789", email: "sales@timemasters.ug", rating: 4.9, totalOrders: 18, totalValue: 1800000, lastOrder: "2024-01-05", paymentTerms: "Net 60", reliability: "Excellent" },
        { id: 4, name: "Tech Solutions", category: "Electronics", contact: "+256 704 567 890", email: "orders@techsolutions.ug", rating: 4.7, totalOrders: 28, totalValue: 2800000, lastOrder: "2024-01-12", paymentTerms: "Net 30", reliability: "Good" },
        { id: 5, name: "Natural Health", category: "Health", contact: "+256 705 678 901", email: "purchasing@naturalhealth.ug", rating: 4.5, totalOrders: 55, totalValue: 1100000, lastOrder: "2024-01-08", paymentTerms: "Net 15", reliability: "Good" }
    ],
    campaigns: [
        { id: 1, name: "Summer Sale 2024", type: "Seasonal", status: "Active", startDate: "2024-01-01", endDate: "2024-03-31", budget: 500000, spent: 320000, reach: 25000, clicks: 1800, conversions: 450, roas: 3.2, ctr: 7.2, cpc: 178 },
        { id: 2, name: "New Product Launch", type: "Product", status: "Active", startDate: "2024-01-15", endDate: "2024-02-15", budget: 300000, spent: 180000, reach: 15000, clicks: 1200, conversions: 280, roas: 2.8, ctr: 8.0, cpc: 150 },
        { id: 3, name: "VIP Customer Campaign", type: "Retention", status: "Paused", startDate: "2024-01-10", endDate: "2024-01-31", budget: 200000, spent: 95000, reach: 8000, clicks: 650, conversions: 120, roas: 4.1, ctr: 8.1, cpc: 146 }
    ],
    financials: {
        monthly: [
            { month: "January 2024", revenue: 2850000, expenses: 1850000, profit: 1000000, margin: 35.1 },
            { month: "December 2023", revenue: 3200000, expenses: 2100000, profit: 1100000, margin: 34.4 },
            { month: "November 2023", revenue: 2800000, expenses: 1900000, profit: 900000, margin: 32.1 },
            { month: "October 2023", revenue: 2500000, expenses: 1750000, profit: 750000, margin: 30.0 },
            { month: "September 2023", revenue: 2200000, expenses: 1600000, profit: 600000, margin: 27.3 },
            { month: "August 2023", revenue: 2000000, expenses: 1500000, profit: 500000, margin: 25.0 }
        ],
        categories: [
            { name: "Clothing", revenue: 850000, profit: 320000, margin: 37.6, growth: 12.5 },
            { name: "Footwear", revenue: 720000, profit: 280000, margin: 38.9, growth: 8.3 },
            { name: "Accessories", revenue: 680000, profit: 320000, margin: 47.1, growth: 15.2 },
            { name: "Electronics", revenue: 450000, profit: 180000, margin: 40.0, growth: 22.1 },
            { name: "Health", revenue: 150000, profit: 75000, margin: 50.0, growth: 5.8 }
        ]
    }
};

// API Routes
app.get('/api/dashboard', (req, res) => {
    const totalRevenue = enterpriseData.products.reduce((sum, p) => sum + (p.retailCost * p.sold), 0);
    const totalCost = enterpriseData.products.reduce((sum, p) => sum + (p.wholesaleCost * p.sold), 0);
    const netProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    const activeProducts = enterpriseData.products.length;
    const totalSales = enterpriseData.products.reduce((sum, p) => sum + p.sold, 0);
    
    // Calculate trends
    const currentMonth = enterpriseData.financials.monthly[0];
    const previousMonth = enterpriseData.financials.monthly[1];
    const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100;
    const profitGrowth = ((currentMonth.profit - previousMonth.profit) / previousMonth.profit) * 100;
    
    res.json({
        totalRevenue,
        netProfit,
        profitMargin,
        activeProducts,
        totalSales,
        revenueGrowth,
        profitGrowth,
        monthlyData: enterpriseData.financials.monthly,
        categoryData: enterpriseData.financials.categories,
        recentTransactions: enterpriseData.transactions.slice(0, 5),
        topProducts: enterpriseData.products.sort((a, b) => (b.retailCost * b.sold) - (a.retailCost * a.sold)).slice(0, 5)
    });
});

app.get('/api/products', (req, res) => {
    res.json(enterpriseData.products);
});

app.post('/api/products', (req, res) => {
    const newProduct = {
        id: enterpriseData.products.length + 1,
        ...req.body,
        profitMargin: ((req.body.retailCost - req.body.wholesaleCost) / req.body.retailCost) * 100,
        lastRestock: new Date().toISOString().split('T')[0],
        reorderPoint: Math.ceil(req.body.stock * 0.2)
    };
    enterpriseData.products.push(newProduct);
    res.json({ success: true, product: newProduct });
});

// Update existing product
app.put('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = enterpriseData.products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Update the product with new data
    const updatedProduct = {
        ...enterpriseData.products[productIndex],
        ...req.body,
        id: productId, // Ensure ID doesn't change
        profitMargin: ((req.body.retailCost - req.body.wholesaleCost) / req.body.retailCost) * 100
    };
    
    enterpriseData.products[productIndex] = updatedProduct;
    res.json({ success: true, product: updatedProduct });
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = enterpriseData.products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const deletedProduct = enterpriseData.products.splice(productIndex, 1)[0];
    res.json({ success: true, product: deletedProduct });
});

app.get('/api/suppliers', (req, res) => {
    res.json(enterpriseData.suppliers);
});

app.get('/api/campaigns', (req, res) => {
    res.json(enterpriseData.campaigns);
});

app.get('/api/transactions', (req, res) => {
    res.json(enterpriseData.transactions);
});

app.get('/api/analytics', (req, res) => {
    const { period = 'monthly' } = req.query;
    
    let data;
    if (period === 'monthly') {
        data = enterpriseData.financials.monthly;
    } else if (period === 'categories') {
        data = enterpriseData.financials.categories;
    }
    
    res.json({
        period,
        data,
        summary: {
            totalRevenue: data.reduce((sum, item) => sum + item.revenue, 0),
            totalProfit: data.reduce((sum, item) => sum + item.profit, 0),
            averageMargin: data.reduce((sum, item) => sum + item.margin, 0) / data.length
        }
    });
});

app.get('/api/ai-insights', (req, res) => {
    const insights = [
        {
            type: 'opportunity',
            title: 'High-Margin Product Opportunity',
            message: 'Your Electronics category shows 22.1% growth with 40% profit margin. Consider expanding this category.',
            impact: 'High',
            confidence: 92,
            action: 'Increase electronics inventory by 30%'
        },
        {
            type: 'warning',
            title: 'Stock Level Alert',
            message: '3 products are below reorder point. This could lead to lost sales.',
            impact: 'Medium',
            confidence: 87,
            action: 'Place immediate reorder for low-stock items'
        },
        {
            type: 'success',
            title: 'Campaign Performance',
            message: 'Summer Sale campaign shows 3.2x ROAS, exceeding industry average of 2.5x.',
            impact: 'High',
            confidence: 95,
            action: 'Increase budget allocation for this campaign'
        },
        {
            type: 'info',
            title: 'Customer Behavior',
            message: 'VIP customers show 3x higher average order value. Focus retention efforts here.',
            impact: 'Medium',
            confidence: 78,
            action: 'Develop VIP loyalty program'
        }
    ];
    
    res.json({ insights });
});

// Serve the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/login.html'));
});

// Serve the main page for all routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Enterprise Shop Analyser Server running at http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`📦 Products: http://localhost:${PORT}/products`);
    console.log(`🤖 AI Insights: http://localhost:${PORT}/ai-insights`);
    console.log(`💰 Analytics: http://localhost:${PORT}/analytics`);
    console.log(`🏢 Enterprise Features: Multi-user, Real-time Analytics, AI Insights`);
});