/* ================================
   NAVIGATION
   Mobile menu, sticky header, active links
   ================================ */

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initMobileSubmenus();
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

    // Close menu when nav link is clicked. Not for "Services", which opens its
    // submenu in the panel instead (see initMobileSubmenus).
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1024 && !link.closest('.has-sub-toggle')) {
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

// ===== MOBILE SUBMENUS =====
// In the slide-in panel the Services list used to sit open under "Services", which
// pushed Gallery, Meet the Team, Blog and Contact below the fold on a phone (30 Sep,
// Reena: "I can only see Home and Services"). It is now collapsed behind a chevron.
// The button is added here, so without JS the list simply stays open. Desktop hides
// the button and keeps the hover dropdown.
// 22 Oct (Jayden): in the panel, tapping "Services" itself opens the list too rather
// than going to services.html, which is reached through the "All services" row.
function initMobileSubmenus() {
    const panel = window.matchMedia('(max-width: 1024px)');

    const items = document.querySelectorAll('.nav-item-has-dropdown');

    items.forEach((item, i) => {
        const link = item.querySelector('.nav-link');
        const dropdown = item.querySelector('.nav-dropdown');
        if (!link || !dropdown) return;

        if (!dropdown.id) dropdown.id = 'nav-submenu-' + (i + 1);

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'nav-sub-toggle';
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', dropdown.id);
        button.setAttribute('aria-label', 'Show ' + link.textContent.trim() + ' pages');
        button.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

        link.after(button);
        item.classList.add('has-sub-toggle');

        function toggle() {
            const open = item.classList.toggle('is-open');
            button.setAttribute('aria-expanded', open ? 'true' : 'false');
            button.setAttribute('aria-label', (open ? 'Hide ' : 'Show ') + link.textContent.trim() + ' pages');
        }

        button.addEventListener('click', toggle);

        link.addEventListener('click', function(e) {
            if (!panel.matches) return;
            e.preventDefault();
            toggle();
        });
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
