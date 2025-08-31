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
            productList.innerHTML += `
                <div class="product-item card">
                    <img src="${product.photo || 'https://via.placeholder.com/56?text=No+Photo'}" class="product-photo" alt="${product.name}">
                    <div class="product-details">
                        <strong>${product.name}</strong><br>
                        Wholesale: ${product.wholesaleCost} UGX<br>
                        Retail: ${product.retailCost} UGX<br>
                        Sold: ${product.quantitySold}<br>
                        <span style="color: var(--primary-orange); font-weight:600;">Profit: ${(product.retailCost - product.wholesaleCost) * product.quantitySold} UGX</span>
                    </div>
                </div>
            `;
        });
    }

    if (form) {
        form.onsubmit = async function(e) {
            e.preventDefault();
            const name = document.getElementById('product-name').value.trim();
            const wholesaleCost = Number(document.getElementById('wholesale-cost').value);
            const retailCost = Number(document.getElementById('retail-cost').value);
            const quantitySold = Number(document.getElementById('quantity-sold').value);
            const photoInput = document.getElementById('product-photo');
            let photo = '';
            if (photoInput.files[0]) {
                const reader = new FileReader();
                reader.onload = async function(ev) {
                    photo = ev.target.result;
                    await addProduct({ name, wholesaleCost, retailCost, quantitySold, photo });
                    await renderProducts();
                    form.reset();
                };
                reader.readAsDataURL(photoInput.files[0]);
            } else {
                await addProduct({ name, wholesaleCost, retailCost, quantitySold, photo });
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