// File: /shop-analyser/shop-analyser/src/js/printPreview.js

function generatePrintPreview(data) {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Preview</title>');
    printWindow.document.write('<link rel="stylesheet" type="text/css" href="../styles/main.css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h1>Financial Overview</h1>');
    printWindow.document.write('<h2>Sales Report</h2>');
    
    // Generate a table for the financial data
    printWindow.document.write('<table border="1"><tr><th>Item</th><th>Cost</th><th>Sales</th><th>Profit</th></tr>');
    
    data.forEach(item => {
        printWindow.document.write(`<tr>
            <td>${item.name}</td>
            <td>${item.cost}</td>
            <td>${item.sales}</td>
            <td>${item.profit}</td>
        </tr>`);
    });
    
    printWindow.document.write('</table>');
    printWindow.document.write('<button onclick="window.print();">Print</button>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
}

// Example usage
// This function can be called with the financial data to generate the print preview
// generatePrintPreview(financialData);