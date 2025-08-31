// File: /shop-analyser/shop-analyser/src/js/aiLogic.js

const aiLogic = {
    taxTiers: {
        "0-100000": 0.1, // 10% tax for income up to 100,000
        "100001-500000": 0.15, // 15% tax for income between 100,001 and 500,000
        "500001-1000000": 0.2, // 20% tax for income between 500,001 and 1,000,000
        "above-1000000": 0.25 // 25% tax for income above 1,000,000
    },

    aiResponses: {
        productPerformance: {
            low: "The product is underperforming. Consider reducing the price or discontinuing it.",
            average: "The product is performing adequately. Monitor its sales closely.",
            high: "The product is performing well. Consider increasing stock and marketing efforts."
        }
    },

    calculateTax: function(income) {
        let tax = 0;
        if (income <= 100000) {
            tax = income * this.taxTiers["0-100000"];
        } else if (income <= 500000) {
            tax = income * this.taxTiers["100001-500000"];
        } else if (income <= 1000000) {
            tax = income * this.taxTiers["500001-1000000"];
        } else {
            tax = income * this.taxTiers["above-1000000"];
        }
        return tax;
    },

    getProductRecommendation: function(salesData) {
        const totalSales = salesData.reduce((acc, item) => acc + item.sales, 0);
        if (totalSales < 50) {
            return this.aiResponses.productPerformance.low;
        } else if (totalSales < 200) {
            return this.aiResponses.productPerformance.average;
        } else {
            return this.aiResponses.productPerformance.high;
        }
    },

    simulateAiLoading: function(callback) {
        setTimeout(callback, 5000); // Simulates a 5-second loading time for AI responses
    }
};

// Export the aiLogic module for use in other files
export default aiLogic;