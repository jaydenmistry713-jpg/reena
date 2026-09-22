/* ================================
   NAVIGATION
   Mobile menu, sticky header, active links
   ================================ */

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initStickyHeader();
    initActiveLinks();
});

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !navMenu) return;

    // Toggle menu
    menuToggle.addEventListener('click', function() {
        toggleMenu();
    });

    // Close menu when overlay is clicked
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function() {
            closeMenu();
        });
    }

    // Close menu when nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1024) {
                closeMenu();
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        if (mobileOverlay) {
            mobileOverlay.classList.toggle('active');
        }
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMenu() {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        if (mobileOverlay) {
            mobileOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    // Close menu on resize if window is expanded
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// ===== STICKY HEADER =====
function initStickyHeader() {
    const header = document.querySelector('.site-header');
    
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when scrolled down
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ===== ACTIVE NAVIGATION LINKS =====
function initActiveLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        
        // Check if this link matches current page
        // Home links point at "/" (22 Sep), not index.html, so /index.html is not
        // linked as a second homepage URL.
        if (linkPage === currentPage ||
            (currentPage === 'index.html' && linkPage === '/') ||
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === '/' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ===== DROPDOWN MENU (if needed in future) =====
function initDropdowns() {
    const dropdownTriggers = document.querySelectorAll('.has-dropdown');

    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                this.classList.toggle('active');
            }
        });
    });
}
