// File: /shop-analyser/shop-analyser/src/js/taxManager.js

// Tax Manager Module
// This module handles tax-related functionalities for the Shop Analyser application.
// It calculates taxes based on user inputs and displays tax tiers for Uganda.

const taxTiers = [];

// Function to load tax tiers from the JSON file
async function loadTaxTiers() {
    try {
        const response = await fetch('../data/taxTiersUganda.json');
        taxTiers = await response.json();
    } catch (error) {
        console.error('Error loading tax tiers:', error);
    }
}

// Function to calculate tax based on income
function calculateTax(income) {
    let tax = 0;
    for (const tier of taxTiers) {
        if (income > tier.lowerLimit) {
            const taxableIncome = Math.min(income, tier.upperLimit) - tier.lowerLimit;
            tax += taxableIncome * tier.rate;
        }
    }
    return tax;
}

// Function to display tax information
function displayTaxInfo(income) {
    const tax = calculateTax(income);
    const taxInfoElement = document.getElementById('tax-info');
    taxInfoElement.innerHTML = `For an income of ${income}, the calculated tax is ${tax}.`;
}

// Event listener for tax calculation
document.getElementById('calculate-tax-btn').addEventListener('click', () => {
    const incomeInput = document.getElementById('income-input').value;
    const income = parseFloat(incomeInput);
    if (!isNaN(income)) {
        displayTaxInfo(income);
    } else {
        alert('Please enter a valid income amount.');
    }
});

// Load tax tiers on module initialization
loadTaxTiers();