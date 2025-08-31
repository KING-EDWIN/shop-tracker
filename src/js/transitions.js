// File: /shop-analyser/shop-analyser/src/js/transitions.js

document.addEventListener("DOMContentLoaded", function() {
    // Function to add smooth transitions to elements
    function addTransition(element, transitionClass) {
        element.classList.add(transitionClass);
        setTimeout(() => {
            element.classList.remove(transitionClass);
        }, 300); // Duration of the transition
    }

    // Example of applying transitions to dashboard elements
    const dashboardElements = document.querySelectorAll('.dashboard-element');
    dashboardElements.forEach(element => {
        element.addEventListener('click', () => {
            addTransition(element, 'fade-in');
        });
    });

    // Function to handle page transitions
    function pageTransition() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetUrl = this.getAttribute('href');
                addTransition(document.body, 'fade-out');
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 300); // Match the duration of the fade-out transition
            });
        });
    }

    // Initialize page transitions
    pageTransition();
});