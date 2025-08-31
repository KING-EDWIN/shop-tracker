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

    // Hardcoded AI answers
    const aiAnswers = [
        { q: /top product|best seller/i, a: "Your best seller is 'Classic Shirt' with 120 units sold and highest profit. Formula: Profit = (Retail Cost - Wholesale Cost) x Quantity Sold." },
        { q: /low sales|underperform/i, a: "'Winter Gloves' and 'Men's Suit' are underperforming. AI recommends: Promotion, price reduction, or discontinuation." },
        { q: /increase profit|boost profit/i, a: "To boost profit, use: Profit = Revenue - Costs. Upsell accessories, bundle offers, and seasonal discounts. AI suggests focusing on high-margin items." },
        { q: /tax|taxes|URA/i, a: "Uganda tax formula: Tax = Income x Rate. Your estimated tax is 400,000 UGX. Ensure all sales are properly recorded for URA compliance." },
        { q: /advert|marketing|ROI/i, a: "Facebook Ads have the highest ROI. Formula: ROI = (Net Profit / Ad Cost) x 100%. Consider increasing your digital marketing budget." },
        { q: /stock|inventory|dead stock/i, a: "You have 50 products in stock. 'Sneakers' and 'Canvas Shoes' are running low. AI tip: Monitor inventory turnover ratio." },
        { q: /loss|negative|break even/i, a: "No major losses detected this month. Break-even formula: Fixed Costs / (Unit Price - Unit Cost). Keep monitoring your expenditures." },
        { q: /recommendation|advice|suggest/i, a: "Diversify your product range and monitor trends. AI recommends adding more kids' items and tracking fast-moving products." },
        { q: /accountability|expenses|costs/i, a: "Your main expenses are electricity and advertising. Formula: Net Profit = Total Revenue - Total Expenses. Profit margin is healthy at 30%." },
        { q: /wholesaler|supplier|bulk/i, a: "Your top wholesaler is 'Kampala Textiles'. Negotiate for better bulk rates. AI tip: Compare supplier prices quarterly." },
        { q: /growth|trend|sales/i, a: "Sales are up 15% compared to last month. Formula: Growth Rate = (Current Sales - Previous Sales) / Previous Sales x 100%. Keep up the good work!" },
        { q: /how to improve|optimize|efficiency/i, a: "Improve by tracking fast-moving items and reducing dead stock. AI can help with predictions and inventory optimization." },
        { q: /print|report|statement/i, a: "You can print your financial report from the Accountability page for URA submission. AI tip: Review statements monthly." },
        { q: /profit|margin|net profit/i, a: "Your total profit is calculated as: Profit = (Retail Cost - Wholesale Cost) x Quantity Sold for each product. Current margin is 30%." },
        { q: /uk|uganda|shs|ugx/i, a: "All figures are in Ugandan Shillings (UGX). AI is tailored for Uganda's business environment and tax tiers." },
        { q: /formula|business formula|calculation/i, a: "Common formulas: Profit = Revenue - Costs, ROI = (Net Profit / Investment) x 100%, Break-even = Fixed Costs / (Unit Price - Unit Cost)." },
        // Add more diverse responses
        { q: /.*/, a: "AI is thinking... Please ask about products, sales, taxes, business formulas, or advice!" }
    ];

    // Dynamic insights from products
    async function updateAiMessages() {
        messagesList.innerHTML = '';
        // Simulate delay
        setTimeout(async () => {
            const res = await fetch('/api/products');
            const products = await res.json();
            // Find top and bottom products
            let topProduct = products[0];
            let bottomProduct = products[0];
            products.forEach(p => {
                const profit = (p.retailCost - p.wholesaleCost) * p.quantitySold;
                if (profit > (topProduct.retailCost - topProduct.wholesaleCost) * topProduct.quantitySold) topProduct = p;
                if (profit < (bottomProduct.retailCost - bottomProduct.wholesaleCost) * bottomProduct.quantitySold) bottomProduct = p;
            });
            const messages = [
                {
                    type: 'insight',
                    message: `Your top product is "${topProduct.name}" with profit UGX ${(topProduct.retailCost-topProduct.wholesaleCost)*topProduct.quantitySold}. Consider increasing stock.`,
                    icon: '📈'
                },
                {
                    type: 'warning',
                    message: `Product "${bottomProduct.name}" is underperforming. Consider a promotion or discontinuing.`,
                    icon: '⚠️'
                },
                {
                    type: 'opportunity',
                    message: `You have ${products.length} products. AI recommends focusing on top 5 for marketing.`,
                    icon: '💡'
                }
            ];
            messagesList.innerHTML = messages.map(msg => `
                <div class="ai-message ${msg.type}">
                    <span class="icon">${msg.icon}</span>
                    <p>${msg.message}</p>
                </div>
            `).join('');
        }, 5000);
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