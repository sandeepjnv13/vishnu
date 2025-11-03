// ============================================
// Our Services Page Specific JavaScript
// Fixed navigation and scroll handling
// ============================================

// Check if we're on the Our Services page
if (document.body.classList.contains('our-services-page')) {

  // Get all navigation elements
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const sidebarSublinks = document.querySelectorAll('.sidebar-sublink');
  const serviceSections = document.querySelectorAll('.service-section');
  const dropdownItems = document.querySelectorAll('.has-dropdown');

  // Initialize dropdown functionality
  function initDropdowns() {
    dropdownItems.forEach(item => {
      const link = item.querySelector('.sidebar-link');
      const submenu = item.querySelector('.sidebar-submenu');
      const arrow = item.querySelector('.dropdown-arrow');

      // Set initial state - if any submenu item is active, expand the dropdown
      const hasActiveChild = submenu && submenu.querySelector('.sidebar-sublink.active');
      if (hasActiveChild) {
        item.classList.add('expanded');
        submenu.classList.add('expanded');
      }

      if (link) {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          const dataSection = link.getAttribute('data-section');

          // Handle Product Supply dropdown toggle
          if (dataSection === 'product-supply') {
            e.preventDefault();

            // Navigate to product-supply-overview section
            const targetSection = document.querySelector('#product-supply-overview');
            if (targetSection) {
              const offsetTop = targetSection.offsetTop - 80;
              window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
              });
            }

            // Toggle dropdown
            const isExpanded = item.classList.contains('expanded');

            // Close other dropdowns
            dropdownItems.forEach(otherItem => {
              if (otherItem !== item) {
                otherItem.classList.remove('expanded');
                const otherSubmenu = otherItem.querySelector('.sidebar-submenu');
                if (otherSubmenu) otherSubmenu.classList.remove('expanded');
              }
            });

            // Toggle current dropdown
            item.classList.toggle('expanded');
            if (submenu) submenu.classList.toggle('expanded');

            // Set active state for Product Supply
            setActiveLink(link);

            return;
          }

          // For other links with valid href
          if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(href);
            if (targetSection) {
              const offsetTop = targetSection.offsetTop - 80;
              window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
              });
            }
            setActiveLink(link);
          }
        });
      }
    });
  }

  // Function to set active link and clear others
  function setActiveLink(activeLink) {
    // Clear all active states
    sidebarLinks.forEach(link => link.classList.remove('active'));
    sidebarSublinks.forEach(link => link.classList.remove('active'));

    // Set the clicked link as active
    activeLink.classList.add('active');
  }

  // Handle submenu link clicks
  function initSubmenuLinks() {
      sidebarSublinks.forEach(link => {
          link.addEventListener('click', (e) => {
              e.preventDefault();
              const targetId = link.getAttribute('href');

              // Special handling for kitchen cabinets
              if (targetId === '#kitchen-cabinets-product') {
                  const targetSection = document.querySelector('#kitchen-cabinets-product');
                  if (targetSection) {
                      const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset - 80;
                      window.scrollTo({
                          top: offsetTop,
                          behavior: 'smooth'
                      });

                      // Set active states
                      sidebarSublinks.forEach(l => l.classList.remove('active'));
                      sidebarLinks.forEach(l => l.classList.remove('active'));
                      link.classList.add('active');

                      const productSupplyLink = document.querySelector('[data-section="product-supply"]');
                      if (productSupplyLink) {
                          productSupplyLink.classList.add('active');
                      }

                      // Ensure dropdown stays expanded
                      const dropdown = link.closest('.has-dropdown');
                      if (dropdown) {
                          dropdown.classList.add('expanded');
                          const submenu = dropdown.querySelector('.sidebar-submenu');
                          if (submenu) submenu.classList.add('expanded');
                      }
                  }
                  return;
              }

              // Continue with normal flow for other links...
              let targetSection = document.querySelector(targetId);

  // Handle main sidebar link clicks (non-dropdown)
  function initMainLinks() {
    sidebarLinks.forEach(link => {
      // Skip dropdown parent links (they're handled in initDropdowns)
      if (link.closest('.has-dropdown')) return;

      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetSection = document.querySelector(href);

          if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }

          setActiveLink(link);

          // Close all dropdowns when clicking main links
          dropdownItems.forEach(item => {
            item.classList.remove('expanded');
            const submenu = item.querySelector('.sidebar-submenu');
            if (submenu) submenu.classList.remove('expanded');
          });
        }
      });
    });
  }

  // Update active section based on scroll position
  function updateActiveSection() {
      const scrollPosition = window.scrollY + 200;
      let activeSection = null;

      // Get all sections including nested ones
      const allSections = document.querySelectorAll('section[id]');

      // Find which section is currently in view
      allSections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
              // Check if this is the most relevant section (topmost in viewport)
              if (!activeSection || Math.abs(sectionTop - scrollPosition) < Math.abs(activeSection.offsetTop - scrollPosition)) {
                  activeSection = section;
              }
          }
      });

      // Default to services-overview if at top of page
      if (window.scrollY < 100 && !activeSection) {
          activeSection = document.getElementById('services-overview');
      }

  // Initialize all functionality
  initDropdowns();
  initSubmenuLinks();
  initMainLinks();

  // Update active state on scroll with throttling
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveSection, 50);
  }, { passive: true });

  // Initial update
  updateActiveSection();

  // Clear any incorrect initial states
  if (window.scrollY === 0) {
      // We're at the top, so clear all active states except services-overview
      sidebarLinks.forEach(link => link.classList.remove('active'));
      sidebarSublinks.forEach(link => link.classList.remove('active'));

      // Collapse all dropdowns initially
      dropdownItems.forEach(item => {
          item.classList.remove('expanded');
          const submenu = item.querySelector('.sidebar-submenu');
          if (submenu) submenu.classList.remove('expanded');
      });
  }

  // Mobile sidebar toggle functionality
  const sidebar = document.querySelector('.services-sidebar');
  let sidebarToggle = document.querySelector('.sidebar-toggle');

  // Create sidebar toggle button if it doesn't exist
  function createSidebarToggle() {
    if (!sidebarToggle && window.innerWidth <= 992) {
      sidebarToggle = document.createElement('button');
      sidebarToggle.className = 'sidebar-toggle';
      sidebarToggle.innerHTML = '☰';
      sidebarToggle.setAttribute('aria-label', 'Toggle sidebar menu');
      document.body.appendChild(sidebarToggle);

      // Add click handler
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        sidebarToggle.innerHTML = sidebar.classList.contains('active') ? '✕' : '☰';
      });
    }
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 992 && sidebar && sidebarToggle) {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('active');
        sidebarToggle.innerHTML = '☰';
      }
    }
  });

  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth > 992) {
        if (sidebar) sidebar.classList.remove('active');
        if (sidebarToggle) sidebarToggle.style.display = 'none';
      } else {
        createSidebarToggle();
        if (sidebarToggle) sidebarToggle.style.display = 'block';
      }
    }, 250);
  });

  // Initial mobile setup
  createSidebarToggle();

  // Intersection Observer for section animations
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '-50px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, observerOptions);

  serviceSections.forEach(section => {
    sectionObserver.observe(section);
  });

  // Header scroll behavior for transparent header
  const header = document.getElementById('site-header');
  let lastScrollY = 0;

  function updateHeader() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); // Initial check
}

// ============================================
// End of Our Services Page Specific JavaScript
// ============================================