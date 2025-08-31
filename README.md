
# Shop Analyser MVP

## What is Shop Analyser?
Shop Analyser is an MVP web application designed for Ugandan retailers to manage their shops efficiently. It combines modern UI, dynamic AI insights, product and tax management, and accountability tracking in one easy-to-use platform.

## Features
- **Modern Dashboard**: Sidebar navigation, logo, and a responsive layout. View profit graphs (bar/line toggle), product stats, and AI insights.
- **Product Management**: Add, edit, and view products. Sample data for 50 products included.
- **User Management**: Sample user included for instant login/testing.
- **AI Insights**: Dynamic, typewriter-effect responses with business tips and product analysis.
- **Graphing**: Switchable bar/line graph of profits over time using Chart.js.
- **Accountability Tracking**: Monitor sales, costs, expenditures, and profits.
- **Tax Management**: Calculate taxes using Uganda's tax tiers. View and print tax summaries.
- **Print Preview**: Generate print-friendly financial reports for tax/accountability.
- **Responsive Design**: Orange/blue/white theme, smooth transitions, and mobile-friendly.

## How to Clone and Run
1. **Clone the repository:**
   ```sh
   git clone https://github.com/dylansoG/shop-analyser.git
   ```
2. **Navigate to the project folder:**
   ```sh
   cd shop-analyser
   ```
3. **Install backend dependencies:**
   ```sh
   cd backend
   npm install
   ```
4. **Start the backend server:**
   ```sh
   node server.js
   ```
   The backend runs at `http://localhost:3000` and serves the frontend and API endpoints.
5. **Open the app:**
   - Visit `http://localhost:3000` in your browser for the full dashboard experience.
   - All features (sidebar, graph, AI, product/tax/accountability) are accessible from the dashboard.

## Usage Guide
- **Login**: Use the sample user to log in and access all features.
- **Dashboard**: View profit graphs, product stats, and AI insights. Use the sidebar to navigate.
- **Add Products**: Go to Products page to add/view products. Sample data is preloaded.
- **AI Insights**: Interact with the AI for business tips and analysis. Typewriter effect simulates real AI responses.
- **Accountability**: Track sales, costs, profits, and expenditures.
- **Tax Management**: Calculate taxes, view Uganda tax tiers, and print tax reports.
- **Print Preview**: Use the print feature for tax/accountability reports.

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript (Chart.js for graphs)
- **Backend**: Node.js, Express
- **Data**: Sample products, users, logs, and Uganda tax tiers (JSON files)

## Contributing
Pull requests and issues are welcome! Help improve features, fix bugs, or suggest enhancements.

## License
MIT License

## Acknowledgments
Powered by the Otic Foundation, the Shop Analyser aims to empower retailers with AI-driven tools for better business management.