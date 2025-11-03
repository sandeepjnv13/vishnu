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

  // Function to set active link and clear others
  function setActiveLink(activeLink) {
    // Clear all active states
    sidebarLinks.forEach(link => link.classList.remove('active'));
    sidebarSublinks.forEach(link => link.classList.remove('active'));

    // Set the clicked link as active
    activeLink.classList.add('active');
  }

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

        // Handle other submenu links
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });

          // Set active states
          sidebarSublinks.forEach(l => l.classList.remove('active'));
          sidebarLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          // Keep parent dropdown active and expanded
          const dropdown = link.closest('.has-dropdown');
          if (dropdown) {
            const parentLink = dropdown.querySelector('.sidebar-link');
            if (parentLink) parentLink.classList.add('active');

            dropdown.classList.add('expanded');
            const submenu = dropdown.querySelector('.sidebar-submenu');
            if (submenu) submenu.classList.add('expanded');
          }
        }
      });
    });
  }

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

  // Replace the whole function with this version
  function updateActiveSection() {
    const HEADER_OFFSET = 80; // fixed header height compensation
    const PROBE_Y = HEADER_OFFSET + 20; // a bit below header

    // Consider only sections that correspond to left-nav items
    const sections = [
      '#services-overview',
      '#interior-design',
      '#product-supply-overview',
      '#kitchen-cabinets-product',
      '#turnkey-execution'
    ].map(sel => document.querySelector(sel)).filter(Boolean);

    // Find the section whose top has crossed the header but whose bottom hasn't
    // (i.e., section occupies the top of the viewport under the fixed header)
    let activeId = null;
    for (const el of sections) {
      const r = el.getBoundingClientRect();
      if (r.top <= PROBE_Y && r.bottom > PROBE_Y) {
        activeId = el.id;
        break;
      }
    }

    // At the very top: explicitly treat as "Overview" but show NO left-nav highlight
    const atTop = window.scrollY < 50;
    if (!activeId && atTop) {
      activeId = 'services-overview';
    }

    // Clear all states first
    sidebarLinks.forEach(link => link.classList.remove('active'));
    sidebarSublinks.forEach(link => link.classList.remove('active'));
    // Also collapse dropdown unless a child is actually active
    document.querySelectorAll('.has-dropdown').forEach(item => {
      item.classList.remove('expanded');
      const sm = item.querySelector('.sidebar-submenu');
      if (sm) sm.classList.remove('expanded');
    });

    // If we’re in the very top Overview block, do not highlight anything
    if (activeId === 'services-overview') {
      return;
    }

    // Product Supply Overview => highlight only the parent, keep submenu collapsed
    if (activeId === 'product-supply-overview') {
      const parent = document.querySelector('[data-section="product-supply"]');
      parent?.classList.add('active');
      return;
    }

    // Kitchen Cabinets => highlight the child and parent and keep dropdown expanded
    if (activeId === 'kitchen-cabinets-product') {
      const child = document.querySelector('a[href="#kitchen-cabinets-product"]');
      const parent = document.querySelector('[data-section="product-supply"]');
      child?.classList.add('active');
      parent?.classList.add('active');

      const dd = child?.closest('.has-dropdown');
      if (dd) {
        dd.classList.add('expanded');
        dd.querySelector('.sidebar-submenu')?.classList.add('expanded');
      }
      return;
    }

    // All other sections map 1:1 to main links
    const link = document.querySelector(`a[href="#${activeId}"]`);
    link?.classList.add('active');
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

  // Initial setup
  updateActiveSection();
  createSidebarToggle();
  updateHeader();

  // Clear any incorrect initial states
  if (window.scrollY === 0) {
    // We're at the top, so clear all active states except services-overview
    sidebarLinks.forEach(link => link.classList.remove('active'));
    sidebarSublinks.forEach(link => link.classList.remove('active'));

    // Collapse all dropdowns initially unless they should be expanded
    dropdownItems.forEach(item => {
      const hasActiveChild = item.querySelector('.sidebar-submenu .sidebar-sublink.active');
      if (!hasActiveChild) {
        item.classList.remove('expanded');
        const submenu = item.querySelector('.sidebar-submenu');
        if (submenu) submenu.classList.remove('expanded');
      }
    });
  }

  // Add scroll event listeners
  window.addEventListener('scroll', updateHeader, { passive: true });
}

// ============================================
// End of Our Services Page Specific JavaScript
// ============================================