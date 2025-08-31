// File: /shop-analyser/shop-analyser/src/js/accountability.js

// This file calculates and displays sales, costs, expenditures, and profits,
// providing a comprehensive view of the user's financial status.

const accountability = {
    sales: 0,
    costs: 0,
    expenditures: 0,
    profits: 0,

    // Function to calculate profits
    calculateProfits: function() {
        this.profits = this.sales - (this.costs + this.expenditures);
    },

    // Function to update sales, costs, and expenditures
    updateFinancials: function(newSales, newCosts, newExpenditures) {
        this.sales += newSales;
        this.costs += newCosts;
        this.expenditures += newExpenditures;
        this.calculateProfits();
    },

    // Function to display accountability data
    displayAccountability: function() {
        console.log("Sales: " + this.sales);
        console.log("Costs: " + this.costs);
        console.log("Expenditures: " + this.expenditures);
        console.log("Profits: " + this.profits);
    },

    // Function to reset financials
    resetFinancials: function() {
        this.sales = 0;
        this.costs = 0;
        this.expenditures = 0;
        this.profits = 0;
    }
};

// Example usage
accountability.updateFinancials(1000, 300, 200);
accountability.displayAccountability(); // Displays current financial status

// Export the accountability module for use in other files
export default accountability;