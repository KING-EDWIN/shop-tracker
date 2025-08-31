const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

const productsFile = path.join(__dirname, 'products.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../src')));

// Serve page templates
app.get('/pages/:page', (req, res) => {
    const page = req.params.page.replace(/[^a-zA-Z0-9\-]/g, '');
    const filePath = path.join(__dirname, `../src/pages/${page}.html`);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Page not found');
    }
});

// API routes
app.get('/api/products', (req, res) => {
    fs.readFile(productsFile, (err, data) => {
        if (err) return res.json([]);
        res.json(JSON.parse(data));
    });
});

app.post('/api/products', (req, res) => {
    const product = req.body;
    fs.readFile(productsFile, (err, data) => {
        let products = [];
        if (!err && data.length) products = JSON.parse(data);
        products.push(product);
        fs.writeFile(productsFile, JSON.stringify(products, null, 2), err => {
            if (err) return res.status(500).json({ error: 'Failed to save product' });
            res.json({ success: true });
        });
    });
});

// Fallback route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});