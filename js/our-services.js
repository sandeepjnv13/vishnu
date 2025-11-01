// ============================================
// Our Services Page Specific JavaScript
// Add this to your main.js file
// ============================================

// Check if we're on the Our Services page
if (document.body.classList.contains('our-services-page')) {

  // Sidebar navigation active state management
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const sidebarSublinks = document.querySelectorAll('.sidebar-sublink');
  const serviceSections = document.querySelectorAll('.service-section');
  const productSections = document.querySelectorAll('.product-catalog-section');

  // Initialize dropdown functionality
  function initDropdowns() {
    const dropdownItems = document.querySelectorAll('.has-dropdown');

    dropdownItems.forEach(item => {
      const link = item.querySelector('.sidebar-link');
      const submenu = item.querySelector('.sidebar-submenu');
      const arrow = item.querySelector('.dropdown-arrow');

      // Set initial state - if any submenu item is active, expand the dropdown
      const hasActiveChild = submenu.querySelector('.sidebar-sublink.active');
      if (hasActiveChild) {
        item.classList.add('expanded');
        submenu.classList.add('expanded');
      }

      link.addEventListener('click', (e) => {
        e.preventDefault();

        // Toggle dropdown
        const isExpanded = item.classList.contains('expanded');

        // Close other dropdowns
        dropdownItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('expanded');
            otherItem.querySelector('.sidebar-submenu').classList.remove('expanded');
          }
        });

        // Toggle current dropdown
        if (!isExpanded) {
          item.classList.add('expanded');
          submenu.classList.add('expanded');
        } else {
          item.classList.remove('expanded');
          submenu.classList.remove('expanded');
        }
      });
    });
  }

  // Update active sidebar link based on scroll position
  function updateActiveSection() {
    const scrollPosition = window.scrollY + 200;

    // Check product sections first (more specific)
    let activeProductSection = null;
    productSections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        activeProductSection = section;
      }
    });

    // Update product subsection highlighting
    if (activeProductSection) {
      const productId = activeProductSection.id;

      // Clear all active states
      sidebarLinks.forEach(link => link.classList.remove('active'));
      sidebarSublinks.forEach(link => link.classList.remove('active'));

      // Activate Product Supply main link
      const productSupplyLink = document.querySelector('[data-section="product-supply"]');
      if (productSupplyLink) {
        productSupplyLink.classList.add('active');
      }

      // Activate specific product sublink
      const activeSublink = document.querySelector(`[data-subsection="${productId}"]`);
      if (activeSublink) {
        activeSublink.classList.add('active');
      }

      // Ensure dropdown is expanded
      const dropdown = document.querySelector('.has-dropdown');
      if (dropdown) {
        dropdown.classList.add('expanded');
        dropdown.querySelector('.sidebar-submenu').classList.add('expanded');
      }

      return;
    }

    // Check main service sections
    serviceSections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Clear all active states
        sidebarLinks.forEach(link => link.classList.remove('active'));
        sidebarSublinks.forEach(link => link.classList.remove('active'));

        // Get section ID and activate corresponding link
        const sectionId = section.id;
        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }

        // Collapse dropdowns when not in product section
        if (sectionId !== 'product-supply') {
          const dropdown = document.querySelector('.has-dropdown');
          if (dropdown) {
            dropdown.classList.remove('expanded');
            dropdown.querySelector('.sidebar-submenu').classList.remove('expanded');
          }
        }
      }
    });
  }

  // Smooth scroll to sections when sidebar links are clicked
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && !link.closest('.has-dropdown')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Smooth scroll for submenu links
  sidebarSublinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });

        // Update active states
        sidebarSublinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Ensure parent link is active
        const productSupplyLink = document.querySelector('[data-section="product-supply"]');
        if (productSupplyLink) {
          sidebarLinks.forEach(l => l.classList.remove('active'));
          productSupplyLink.classList.add('active');
        }
      }
    });
  });

  // Initialize dropdowns
  initDropdowns();

  // Update active state on scroll
  window.addEventListener('scroll', updateActiveSection, { passive: true });

  // Mobile sidebar toggle functionality
  const sidebar = document.querySelector('.services-sidebar');
  let sidebarToggle = document.querySelector('.sidebar-toggle');

  // Create sidebar toggle button if it doesn't exist
  if (!sidebarToggle && window.innerWidth <= 992) {
    sidebarToggle = document.createElement('button');
    sidebarToggle.className = 'sidebar-toggle';
    sidebarToggle.innerHTML = '☰';
    sidebarToggle.setAttribute('aria-label', 'Toggle sidebar menu');
    document.body.appendChild(sidebarToggle);
  }

  // Toggle sidebar on mobile
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      sidebarToggle.innerHTML = sidebar.classList.contains('active') ? '✕' : '☰';
    });
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 992) {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('active');
        if (sidebarToggle) sidebarToggle.innerHTML = '☰';
      }
    }
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 992) {
        sidebar.classList.remove('active');
        if (sidebarToggle) sidebarToggle.style.display = 'none';
      } else {
        if (!sidebarToggle) {
          sidebarToggle = document.createElement('button');
          sidebarToggle.className = 'sidebar-toggle';
          sidebarToggle.innerHTML = '☰';
          sidebarToggle.setAttribute('aria-label', 'Toggle sidebar menu');
          document.body.appendChild(sidebarToggle);
        } else {
          sidebarToggle.style.display = 'block';
        }
      }
    }, 250);
  });

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