// Simple Home Page JavaScript

// Mobile menu toggle
function setupMobileMenu() {
    // For responsive design
    console.log("Home page loaded");
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize everything when page loads
window.onload = function() {
    setupMobileMenu();
    setupSmoothScroll();
    console.log("LifeLog homepage ready!");
};