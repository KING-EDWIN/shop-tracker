// File: /shop-analyser/shop-analyser/src/js/productManager.js

// Product Manager Module
const ProductManager = (() => {
    let products = [];

    // Function to add a new product
    const addProduct = (name, photo, wholesaleCost, retailCost, quantitySold) => {
        const product = {
            name,
            photo,
            wholesaleCost: parseFloat(wholesaleCost),
            retailCost: parseFloat(retailCost),
            quantitySold: parseInt(quantitySold, 10),
            profit: calculateProfit(wholesaleCost, retailCost, quantitySold)
        };
        products.push(product);
        saveProducts();
    };

    // Function to calculate profit for a product
    const calculateProfit = (wholesaleCost, retailCost, quantitySold) => {
        return (retailCost - wholesaleCost) * quantitySold;
    };

    // Function to get all products
    const getProducts = () => {
        return products;
    };

    // Function to save products to local storage or a file (simulated)
    const saveProducts = () => {
        // Simulate saving to a file or database
        console.log("Products saved:", products);
    };

    // Function to sort products by profit
    const sortProductsByProfit = (order = 'asc') => {
        return products.sort((a, b) => {
            return order === 'asc' ? b.profit - a.profit : a.profit - b.profit;
        });
    };

    return {
        addProduct,
        getProducts,
        sortProductsByProfit
    };
})();

// Export the ProductManager module for use in other files
export default ProductManager;

export async function initializeProductManager() {
    const productList = document.getElementById('product-list');
    const form = document.getElementById('product-form');

    async function fetchProducts() {
        const res = await fetch('/api/products');
        return await res.json();
    }

    async function renderProducts() {
        const products = await fetchProducts();
        productList.innerHTML = '';
        products.forEach(product => {
            const profit = (product.retailCost - product.wholesaleCost) * product.quantitySold;
            const margin = product.retailCost > 0 ? ((profit / (product.retailCost * product.quantitySold)) * 100).toFixed(1) : 0;
            const stockStatus = product.currentStock < 10 ? 'low-stock' : product.currentStock < 50 ? 'medium-stock' : 'good-stock';
            
            productList.innerHTML += `
                <div class="product-item card ${stockStatus}">
                    <img src="${product.photo || 'https://via.placeholder.com/80?text=No+Photo'}" class="product-photo" alt="${product.name}">
                    <div class="product-details">
                        <div class="product-header">
                            <h3 class="product-name">${product.name}</h3>
                            <span class="product-category">${product.category || 'Uncategorized'}</span>
                        </div>
                        <div class="product-metrics">
                            <div class="metric-row">
                                <span class="metric-label">Cost:</span>
                                <span class="metric-value">${product.wholesaleCost.toLocaleString()} UGX</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Price:</span>
                                <span class="metric-value">${product.retailCost.toLocaleString()} UGX</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Stock:</span>
                                <span class="metric-value stock-${stockStatus}">${product.currentStock || 0} units</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Sold:</span>
                                <span class="metric-value">${product.quantitySold} units</span>
                            </div>
                        </div>
                        <div class="product-performance">
                            <div class="performance-item">
                                <span class="performance-label">Profit:</span>
                                <span class="performance-value profit">${profit.toLocaleString()} UGX</span>
                            </div>
                            <div class="performance-item">
                                <span class="performance-label">Margin:</span>
                                <span class="performance-value margin">${margin}%</span>
                            </div>
                        </div>
                        ${product.sku ? `<div class="product-sku">SKU: ${product.sku}</div>` : ''}
                        ${product.supplier ? `<div class="product-supplier">Supplier: ${product.supplier}</div>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="btn-action edit" onclick="editProduct('${product.name}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action delete" onclick="deleteProduct('${product.name}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    }

    if (form) {
        form.onsubmit = async function(e) {
            e.preventDefault();
            const name = document.getElementById('product-name').value.trim();
            const category = document.getElementById('product-category').value;
            const wholesaleCost = Number(document.getElementById('wholesale-cost').value);
            const retailCost = Number(document.getElementById('retail-cost').value);
            const currentStock = Number(document.getElementById('current-stock').value);
            const quantitySold = Number(document.getElementById('quantity-sold').value);
            const sku = document.getElementById('product-sku').value.trim();
            const supplier = document.getElementById('supplier').value.trim();
            const description = document.getElementById('product-description').value.trim();
            const photoInput = document.getElementById('product-photo');
            
            let photo = '';
            if (photoInput.files[0]) {
                const reader = new FileReader();
                reader.onload = async function(ev) {
                    photo = ev.target.result;
                    await addProduct({ 
                        name, 
                        category,
                        wholesaleCost, 
                        retailCost, 
                        currentStock,
                        quantitySold, 
                        sku,
                        supplier,
                        description,
                        photo 
                    });
                    await renderProducts();
                    form.reset();
                };
                reader.readAsDataURL(photoInput.files[0]);
            } else {
                await addProduct({ 
                    name, 
                    category,
                    wholesaleCost, 
                    retailCost, 
                    currentStock,
                    quantitySold, 
                    sku,
                    supplier,
                    description,
                    photo 
                });
                await renderProducts();
                form.reset();
            }
        };
    }

    async function addProduct(product) {
        await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
    }

    await renderProducts();
}