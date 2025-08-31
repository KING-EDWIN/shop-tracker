//import { fetchProducts } from './productManager.js';

export async function initializeCharts() {
    const ctx = document.getElementById('profitChart');
    if (!ctx) return;

    // Add graph type toggle button
    let graphType = 'bar';
    let toggleBtn = document.getElementById('graph-type-toggle');
    if (!toggleBtn) {
        toggleBtn = document.createElement('button');
        toggleBtn.id = 'graph-type-toggle';
        toggleBtn.className = 'btn-primary';
        toggleBtn.style.marginBottom = '1rem';
        toggleBtn.innerHTML = '<i class="fas fa-chart-bar"></i> Switch to Line Graph';
        ctx.parentElement.insertBefore(toggleBtn, ctx);
    }

    // Fetch products from backend
    const res = await fetch('/api/products');
    const products = await res.json();

    // Calculate total profit per product
    const labels = products.map(p => p.name);
    const data = products.map(p => (p.retailCost - p.wholesaleCost) * p.quantitySold);

    let chart = new Chart(ctx, {
        type: graphType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Profit (UGX)',
                data: data,
                borderColor: 'rgb(255, 127, 42)',
                backgroundColor: 'rgba(255, 127, 42, 0.3)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Business Performance' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `UGX ${value.toLocaleString()}`
                    }
                }
            }
        }
    });

    // Toggle graph type
    toggleBtn.onclick = () => {
        graphType = graphType === 'bar' ? 'line' : 'bar';
        toggleBtn.innerHTML = graphType === 'bar'
            ? '<i class="fas fa-chart-bar"></i> Switch to Line Graph'
            : '<i class="fas fa-chart-line"></i> Switch to Bar Graph';
        chart.destroy();
        chart = new Chart(ctx, {
            type: graphType,
            data: {
                labels: labels,
                datasets: [{
                    label: 'Profit (UGX)',
                    data: data,
                    borderColor: 'rgb(255, 127, 42)',
                    backgroundColor: 'rgba(255, 127, 42, 0.3)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Business Performance' }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => `UGX ${value.toLocaleString()}`
                        }
                    }
                }
            }
        });
    };

    // Time controls (simulate filtering)
    document.querySelectorAll('.time-controls button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.time-controls button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // For MVP, just re-render with all products
            chart.data.labels = labels;
            chart.data.datasets[0].data = data;
            chart.update();
        });
    });
}