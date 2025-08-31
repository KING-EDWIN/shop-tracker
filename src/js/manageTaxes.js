import aiLogic from './aiLogic.js';

const income = 2000000; // Example income
const tax = aiLogic.calculateTax(income);

document.getElementById('tax-info').innerHTML = `
  <p>Your income: ${income} UGX</p>
  <p>Tax owed (Uganda tiers): ${tax} UGX</p>
`;