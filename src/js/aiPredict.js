import aiLogic from './aiLogic.js';

document.getElementById('predict-form').onsubmit = async function(e) {
    e.preventDefault();
    const productName = e.target[0].value;
    document.getElementById('predict-result').innerHTML = "Loading prediction...";
    const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName })
    });
    const data = await res.json();
    document.getElementById('predict-result').innerHTML =
        `<strong>Prediction:</strong> ${data.prediction}<br><strong>Profit:</strong> ${data.profit || 0} UGX`;
};