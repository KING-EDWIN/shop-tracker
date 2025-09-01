export async function initializeAiMessages() {
    const messagesList = document.getElementById('ai-messages');
    // Add question input UI
    const questionBox = document.createElement('div');
    questionBox.className = 'ai-question-box';
    questionBox.innerHTML = `
        <input type="text" id="ai-question-input" placeholder="Ask the AI about your shop..." style="width:70%;padding:0.5rem;margin-right:0.5rem;">
        <button id="ai-question-btn" class="btn-primary"><i class="fas fa-paper-plane"></i> Ask</button>
        <div id="ai-answer" class="ai-answer-box" style="margin-top:1rem; min-height:48px; background:var(--white); border-radius:8px; box-shadow:var(--shadow); padding:1rem; font-size:1.1em; color:var(--gray-800);"></div>
    `;
    messagesList.parentElement.insertBefore(questionBox, messagesList);

    // Enhanced AI answers with more sophisticated business insights
    const aiAnswers = [
        { q: /top product|best seller|highest performing/i, a: "Based on your data, your top performer is generating significant revenue. Focus on increasing stock of high-margin items and consider cross-selling opportunities. Formula: Performance Score = (Revenue × Profit Margin) / Inventory Turnover." },
        { q: /low sales|underperform|poor performance/i, a: "Underperforming products need immediate attention. Consider: 1) Price optimization using demand elasticity, 2) Promotional campaigns, 3) Bundle deals, or 4) Strategic discontinuation. Monitor inventory turnover ratio to avoid dead stock." },
        { q: /increase profit|boost profit|profit optimization/i, a: "Profit optimization strategies: 1) Focus on high-margin categories (aim for >40% margin), 2) Implement dynamic pricing, 3) Reduce carrying costs, 4) Optimize inventory levels using ABC analysis. Target: Increase profit margin by 5-10% monthly." },
        { q: /tax|taxes|URA|compliance/i, a: "Uganda tax compliance: Corporate tax rate is 30% for resident companies. Ensure proper record-keeping for URA audits. Consider VAT registration if annual turnover exceeds 150M UGX. Use the system's reporting features for accurate tax calculations." },
        { q: /marketing|advert|ROI|promotion/i, a: "Marketing ROI optimization: Track customer acquisition cost (CAC) vs lifetime value (LTV). Digital marketing typically yields 3-5x ROI. Focus on social media engagement and local partnerships. Formula: Marketing ROI = (Revenue from Marketing - Marketing Cost) / Marketing Cost × 100%." },
        { q: /stock|inventory|reorder|supply chain/i, a: "Inventory management: Implement just-in-time ordering for fast-moving items. Set reorder points at 2-3 weeks of average sales. Use ABC analysis: A-items (80% of value), B-items (15%), C-items (5%). Monitor stock-out costs vs carrying costs." },
        { q: /cash flow|working capital|financial health/i, a: "Cash flow management: Maintain 2-3 months of operating expenses in reserve. Optimize payment terms with suppliers (aim for 30-45 days). Accelerate receivables through early payment discounts. Formula: Cash Conversion Cycle = Days in Inventory + Days in Receivables - Days in Payables." },
        { q: /customer|retention|loyalty|satisfaction/i, a: "Customer retention strategies: 1) Implement loyalty programs, 2) Personalize shopping experience, 3) Collect feedback regularly, 4) Offer exclusive deals. Customer lifetime value = Average Order Value × Purchase Frequency × Customer Lifespan. Focus on increasing each component." },
        { q: /competition|market share|pricing strategy/i, a: "Competitive analysis: Monitor competitor pricing weekly. Use value-based pricing for unique products. Consider psychological pricing (e.g., 9,999 instead of 10,000). Implement price elasticity analysis to optimize margins without losing customers." },
        { q: /seasonal|trend|forecasting|prediction/i, a: "Seasonal planning: Analyze historical data for patterns. Stock up 2-3 months before peak seasons. Use moving averages for demand forecasting. Consider weather patterns, holidays, and local events. AI can help predict demand based on historical trends." },
        { q: /expansion|growth|scaling|new location/i, a: "Growth strategies: 1) Market penetration (increase market share), 2) Product development (new categories), 3) Market development (new areas), 4) Diversification. Before expanding, ensure 20%+ profit margins and positive cash flow for 6+ months." },
        { q: /efficiency|productivity|automation|process/i, a: "Operational efficiency: Automate repetitive tasks, implement barcode scanning, use cloud-based POS systems. Measure productivity with metrics like sales per employee, inventory turnover, and order fulfillment time. Target: 10-15% efficiency improvement annually." },
        { q: /risk|security|fraud|loss prevention/i, a: "Risk management: Implement security cameras, train staff on fraud detection, use inventory tracking systems, maintain insurance coverage. Monitor shrinkage rates (should be <2% of sales). Regular audits and reconciliation are essential." },
        { q: /supplier|vendor|procurement|negotiation/i, a: "Supplier management: Build strong relationships with 2-3 key suppliers per category. Negotiate volume discounts, payment terms, and exclusivity agreements. Use supplier scorecards based on quality, delivery, and price. Consider local vs international suppliers for cost optimization." },
        { q: /technology|digital|online|e-commerce/i, a: "Digital transformation: Consider online presence for 24/7 sales. Implement customer relationship management (CRM) systems. Use data analytics for decision-making. Mobile payments and digital receipts improve customer experience and reduce cash handling." },
        { q: /staff|employee|training|management/i, a: "Human resources: Invest in staff training for customer service and product knowledge. Implement performance metrics and incentive programs. Maintain good working conditions to reduce turnover. Well-trained staff can increase sales by 15-20%." },
        { q: /sustainability|environmental|green|eco/i, a: "Sustainable practices: Reduce packaging waste, source eco-friendly products, implement energy-efficient lighting. Sustainability can attract environmentally conscious customers and reduce operational costs. Consider carbon footprint tracking for future compliance." },
        { q: /.*/, a: "I'm here to help with your business decisions! Ask me about: profit optimization, inventory management, marketing strategies, financial planning, competitive analysis, or any specific business challenge you're facing." }
    ];

    // Dynamic insights from products with advanced analytics
    async function updateAiMessages() {
        messagesList.innerHTML = '';
        // Simulate delay
        setTimeout(async () => {
            const res = await fetch('/api/products');
            const products = await res.json();
            
            if (products.length === 0) {
                messagesList.innerHTML = `
                    <div class="ai-message info">
                        <span class="icon">ℹ️</span>
                        <p>No products found. Add some products to get AI insights and recommendations.</p>
                    </div>
                `;
                return;
            }

            // Advanced analytics
            const analytics = analyzeProducts(products);
            const messages = generateInsights(analytics);
            
            messagesList.innerHTML = messages.map(msg => `
                <div class="ai-message ${msg.type}">
                    <span class="icon">${msg.icon}</span>
                    <div class="message-content">
                        <h4>${msg.title}</h4>
                    <p>${msg.message}</p>
                        ${msg.action ? `<div class="action-suggestion">${msg.action}</div>` : ''}
                    </div>
                </div>
            `).join('');
        }, 2000);
    }

    function analyzeProducts(products) {
        const totalRevenue = products.reduce((sum, p) => sum + (p.retailCost * p.quantitySold), 0);
        const totalCost = products.reduce((sum, p) => sum + (p.wholesaleCost * p.quantitySold), 0);
        const totalProfit = totalRevenue - totalCost;
        const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
        
        // Find top and bottom performers
        const sortedByProfit = products.sort((a, b) => 
            ((b.retailCost - b.wholesaleCost) * b.quantitySold) - 
            ((a.retailCost - a.wholesaleCost) * a.quantitySold)
        );
        
        const topProduct = sortedByProfit[0];
        const bottomProduct = sortedByProfit[sortedByProfit.length - 1];
        
        // Category analysis
        const categories = {};
        products.forEach(p => {
            const category = p.category || 'Uncategorized';
            if (!categories[category]) {
                categories[category] = { count: 0, revenue: 0, profit: 0 };
            }
            categories[category].count++;
            categories[category].revenue += p.retailCost * p.quantitySold;
            categories[category].profit += (p.retailCost - p.wholesaleCost) * p.quantitySold;
        });
        
        const topCategory = Object.entries(categories)
            .sort(([,a], [,b]) => b.revenue - a.revenue)[0];
        
        // Stock analysis
        const lowStockItems = products.filter(p => (p.currentStock || 0) < 10);
        const highMarginItems = products.filter(p => {
            const margin = p.retailCost > 0 ? ((p.retailCost - p.wholesaleCost) / p.retailCost) * 100 : 0;
            return margin > 40;
        });
        
        return {
            totalRevenue,
            totalProfit,
            profitMargin,
            topProduct,
            bottomProduct,
            topCategory,
            lowStockItems,
            highMarginItems,
            totalProducts: products.length
        };
    }

    function generateInsights(analytics) {
        const messages = [];
        
        // Performance insight
        if (analytics.profitMargin > 30) {
            messages.push({
                type: 'success',
                title: 'Excellent Performance',
                message: `Your profit margin is ${analytics.profitMargin.toFixed(1)}%, which is above the industry average of 25%. Keep up the great work!`,
                icon: '🎉',
                action: 'Consider expanding your best-performing categories.'
            });
        } else if (analytics.profitMargin < 15) {
            messages.push({
                type: 'warning',
                title: 'Low Profit Margin',
                message: `Your profit margin is ${analytics.profitMargin.toFixed(1)}%, which is below recommended levels. Focus on high-margin products.`,
                icon: '⚠️',
                action: 'Review pricing strategy and reduce low-margin items.'
            });
        }
        
        // Top performer insight
        if (analytics.topProduct) {
            const topProfit = (analytics.topProduct.retailCost - analytics.topProduct.wholesaleCost) * analytics.topProduct.quantitySold;
            messages.push({
                type: 'insight',
                title: 'Top Performer',
                message: `"${analytics.topProduct.name}" is your star product with UGX ${topProfit.toLocaleString()} profit. Consider increasing stock and marketing.`,
                icon: '⭐',
                action: 'Increase inventory and create similar products.'
            });
        }
        
        // Category insight
        if (analytics.topCategory) {
            messages.push({
                type: 'opportunity',
                title: 'Category Opportunity',
                message: `${analytics.topCategory[0]} category generates the most revenue (UGX ${analytics.topCategory[1].revenue.toLocaleString()}). Consider expanding this category.`,
                icon: '💡',
                action: 'Add more products in this category.'
            });
        }
        
        // Stock alert
        if (analytics.lowStockItems.length > 0) {
            messages.push({
                type: 'warning',
                title: 'Low Stock Alert',
                message: `${analytics.lowStockItems.length} products are running low on stock. This could lead to lost sales.`,
                icon: '📦',
                action: 'Reorder these items immediately.'
            });
        }
        
        // High margin opportunity
        if (analytics.highMarginItems.length > 0) {
            messages.push({
                type: 'opportunity',
                title: 'High Margin Products',
                message: `You have ${analytics.highMarginItems.length} products with >40% margin. Focus marketing efforts on these items.`,
                icon: '💰',
                action: 'Create promotional campaigns for high-margin items.'
            });
        }
        
        // General recommendation
        messages.push({
            type: 'info',
            title: 'AI Recommendation',
            message: `With ${analytics.totalProducts} products and UGX ${analytics.totalRevenue.toLocaleString()} revenue, consider implementing inventory optimization and customer analytics.`,
            icon: '🤖',
            action: 'Ask me about specific optimization strategies.'
        });
        
        return messages.slice(0, 4); // Limit to 4 messages
    }

    // Question/answer handler
    document.getElementById('ai-question-btn').onclick = function() {
        const input = document.getElementById('ai-question-input').value.trim();
        const answerBox = document.getElementById('ai-answer');
        answerBox.innerHTML = '<span class="icon">🤖</span> <span class="ai-typewriter">AI is generating...</span>';
        setTimeout(() => {
            let found = aiAnswers.find(a => a.q.test(input));
            // Render icon, then typewriter for text only
            answerBox.innerHTML = '<span class="icon">🤖</span> <span id="ai-typewriter"></span>';
            const typewriterEl = document.getElementById('ai-typewriter');
            typeWriterAnswer(typewriterEl, found ? found.a : 'Sorry, I do not understand that question.');
        }, 2000);
    };

    // Typewriter effect for AI answers
    function typeWriterAnswer(element, text) {
    element.textContent = '';
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 18);
            } else {
                // Optionally add a blinking cursor or animation
            }
        }
        type();
    }

    // Initial load
    updateAiMessages();
    setInterval(updateAiMessages, 300000);
}