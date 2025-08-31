document.getElementById('add-product-form').innerHTML = `
  <input type="file" accept="image/*">
  <input type="text" placeholder="Product Name">
  <input type="number" placeholder="Wholesale Cost">
  <input type="number" placeholder="Retail Cost">
  <input type="number" placeholder="Number Sold">
  <button>Add Product</button>
`;