// File: /shop-analyser/shop-analyser/src/js/app.js

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the application
    console.log("Shop Analyser is initializing...");

    // ...existing code...

    // Sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggle-sidebar');
    
    toggleBtn?.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Page navigation
    const mainContent = document.querySelector('.dashboard-content');
    
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Update URL without page reload
            history.pushState({}, '', link.href);
            
            // Remove active class from all links
            document.querySelectorAll('.sidebar-nav a').forEach(l => 
                l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Update page title
            const pageTitle = document.getElementById('page-title');
            pageTitle.textContent = link.querySelector('span').textContent;
            
            try {
                const response = await fetch(link.href);
                if (!response.ok) throw new Error('Page not found');
                
                const html = await response.text();
                mainContent.innerHTML = html;
                
                // Initialize page-specific features
                const page = link.dataset.page;
                switch(page) {
                    case 'dashboard':
                        (await import('./charts.js')).initializeCharts();
                        (await import('./aiMessages.js')).initializeAiMessages();
                        break;
                    case 'products':
                        (await import('./productManager.js')).initializeProductManager();
                        break;
                    case 'ai-insights':
                        (await import('./aiInsights.js')).initializeAiInsights();
                        break;
                }
            } catch (err) {
                console.error('Error loading page:', err);
                mainContent.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Error loading page. Please try again.</p>
                    </div>
                `;
            }
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const path = window.location.pathname;
        const link = document.querySelector(`.sidebar-nav a[href="${path}"]`);
        if (link) link.click();
    });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // Load dashboard by default
    const dashboardLink = document.querySelector('[data-page="dashboard"]');
    if (dashboardLink) {
        dashboardLink.click();
    }

    // Initialize charts and AI messages
    try {
        const { initializeCharts } = await import('./charts.js');
        const { initializeAiMessages } = await import('./aiMessages.js');
        
        initializeCharts();
        initializeAiMessages();
    } catch (err) {
        console.error('Error initializing dashboard:', err);
    }
});

// ...existing code...