// ============================================
// Our Services Page Specific JavaScript
// Fixed navigation and scroll handling with restrictions
// ============================================

// Check if we're on the Our Services page
if (document.body.classList.contains('our-services-page')) {

  // Global variable for scroll restriction
  let scrollRestriction = null;

  // Get all navigation elements
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const sidebarSublinks = document.querySelectorAll('.sidebar-sublink');
  const serviceSections = document.querySelectorAll('.service-section');
  const dropdownItems = document.querySelectorAll('.has-dropdown');

  // ============================================
  // Scroll Restriction Management
  // ============================================

  class ScrollRestriction {
    constructor() {
      this.currentSection = 'services-overview';
      this.scrollableAreas = ['product-supply-restricted']; // Areas that allow limited scrolling
      this.minScrollY = 0;
      this.maxScrollY = 0;
      this.init();
    }

    init() {
      this.disableScroll();
      this.setupSectionNavigation();
      this.handleInitialLoad();
    }

    disableScroll() {
      // Disable wheel scrolling
      window.addEventListener('wheel', this.preventScroll.bind(this), { passive: false });

      // Disable keyboard scrolling
      window.addEventListener('keydown', this.preventKeyScroll.bind(this), { passive: false });

      // Disable touch scrolling on mobile
      document.addEventListener('touchmove', this.preventScroll.bind(this), { passive: false });
    }

    enableScrollForSection(sectionId) {
      this.currentSection = sectionId;
      document.body.style.overflow = this.scrollableAreas.includes(sectionId) ? 'auto' : 'hidden';
    }

    preventScroll(e) {
      if (!this.scrollableAreas.includes(this.currentSection)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // For product supply sections, limit scroll range
      if (this.currentSection === 'product-supply-restricted') {
        const currentScrollY = window.scrollY;
        const deltaY = e.deltaY || e.touches?.[0]?.clientY || 0;
        const nextScrollY = currentScrollY + deltaY;

        // Hard lock at boundaries - prevent ANY movement beyond limits
        if ((deltaY < 0 && currentScrollY <= this.minScrollY) ||
            (deltaY > 0 && currentScrollY >= this.maxScrollY)) {
          e.preventDefault();
          e.stopPropagation();

          // Force scroll position to boundary
          if (deltaY < 0 && currentScrollY < this.minScrollY) {
            window.scrollTo(0, this.minScrollY);
          } else if (deltaY > 0 && currentScrollY > this.maxScrollY) {
            window.scrollTo(0, this.maxScrollY);
          }

          return false;
        }

        // Clamp the scroll if it would exceed boundaries
        if (nextScrollY < this.minScrollY || nextScrollY > this.maxScrollY) {
          e.preventDefault();
          e.stopPropagation();
          window.scrollTo(0, deltaY < 0 ? this.minScrollY : this.maxScrollY);
          return false;
        }
      }
    }

    preventKeyScroll(e) {
      const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40]; // Space, Page Up/Down, End, Home, Arrow keys
      if (!this.scrollableAreas.includes(this.currentSection) && scrollKeys.includes(e.keyCode)) {
        e.preventDefault();
        return false;
      }

      // For product supply sections, limit scroll range
      if (this.currentSection === 'product-supply-restricted' && scrollKeys.includes(e.keyCode)) {
        const currentScrollY = window.scrollY;

        if ((currentScrollY <= this.minScrollY && [33, 36, 38].includes(e.keyCode)) || // Page Up, Home, Up Arrow
            (currentScrollY >= this.maxScrollY && [32, 34, 35, 40].includes(e.keyCode))) { // Space, Page Down, End, Down Arrow
          e.preventDefault();
          return false;
        }
      }
    }

    setupProductSupplyScrollLimits() {
      // Get the bounds of the product supply sections
      const startSection = document.querySelector('#product-supply-overview');
      const endSection = document.querySelector('#kitchen-cabinets-product');

      if (startSection && endSection) {
        // Set exact boundaries with no buffer
        this.minScrollY = startSection.offsetTop - 80;
        this.maxScrollY = endSection.offsetTop + endSection.offsetHeight - window.innerHeight;

        // Ensure maxScrollY is not less than minScrollY
        if (this.maxScrollY < this.minScrollY) {
          this.maxScrollY = this.minScrollY + window.innerHeight;
        }

        // Add a buffer zone for better edge detection
        this.bufferZone = 5; // pixels
      }
    }

    enforceScrollBoundaries() {
      if (this.currentSection === 'product-supply-restricted') {
        const currentScrollY = window.scrollY;

        // Use requestAnimationFrame for smoother boundary enforcement
        if (currentScrollY < this.minScrollY - this.bufferZone) {
          requestAnimationFrame(() => {
            window.scrollTo({ top: this.minScrollY, behavior: 'instant' });
          });
        } else if (currentScrollY > this.maxScrollY + this.bufferZone) {
          requestAnimationFrame(() => {
            window.scrollTo({ top: this.maxScrollY, behavior: 'instant' });
          });
        }
      }
    }

    navigateToSection(sectionId) {
      this.currentSection = sectionId;

      // Handle different section types
      switch(sectionId) {
        case 'services-overview':
        case 'interior-design':
        case 'turnkey-execution':
          document.body.style.overflow = 'hidden';
          this.scrollToSection(sectionId);
          break;

        case 'product-supply-overview':
        case 'kitchen-cabinets-product':
        case 'counter-tops'
          this.currentSection = 'product-supply-restricted';
          document.body.style.overflow = 'auto';
          this.setupProductSupplyScrollLimits();
          this.scrollToSection(sectionId); // Use actual sectionId instead of always 'product-supply-overview'

          // Enforce boundaries immediately after navigation
          setTimeout(() => {
            this.enforceScrollBoundaries();
          }, 5);
          break;

        default:
          document.body.style.overflow = 'hidden';
          this.scrollToSection(sectionId);
      }
    }

    scrollToSection(sectionId) {
      const targetSection = document.querySelector(`#${sectionId}`);
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }

    setupSectionNavigation() {
      // Override existing navigation clicks
      const allNavLinks = document.querySelectorAll('.sidebar-link, .sidebar-sublink, .service-overview-card');

      allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();

          let targetSection;
          if (link.classList.contains('service-overview-card')) {
            const href = link.getAttribute('href');
            targetSection = href ? href.substring(1) : null;
          } else {
            const href = link.getAttribute('href');
            const dataSection = link.getAttribute('data-section');
            targetSection = href ? href.substring(1) : dataSection;
          }

          if (targetSection) {
            this.navigateToSection(targetSection);

            // Update active states
            this.updateActiveStates(link, targetSection);
          }
        });
      });
    }

    updateActiveStates(clickedLink, targetSection) {
      // Clear all active states
      document.querySelectorAll('.sidebar-link, .sidebar-sublink').forEach(link => {
        link.classList.remove('active');
      });

      // Set appropriate active states based on target section
      if (targetSection === 'product-supply-overview' || targetSection === 'kitchen-cabinets-product') {
        const productSupplyLink = document.querySelector('[data-section="product-supply"]');
        if (productSupplyLink) {
          productSupplyLink.classList.add('active');
        }

        if (targetSection === 'kitchen-cabinets-product') {
          const kitchenLink = document.querySelector('a[href="#kitchen-cabinets-product"]');
          if (kitchenLink) {
            kitchenLink.classList.add('active');
          }

          // Keep dropdown expanded
          const dropdown = clickedLink.closest('.has-dropdown');
          if (dropdown) {
            dropdown.classList.add('expanded');
            const submenu = dropdown.querySelector('.sidebar-submenu');
            if (submenu) submenu.classList.add('expanded');
          }
        }
      } else {
        clickedLink.classList.add('active');
      }
    }

    handleInitialLoad() {
      // Set initial state
      this.currentSection = 'services-overview';
      document.body.style.overflow = 'hidden';

      // Ensure we start at the top
      window.scrollTo(0, 0);
    }
  }

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
          e.preventDefault();
          const href = link.getAttribute('href');
          const dataSection = link.getAttribute('data-section');

          // Handle Product Supply dropdown toggle
          if (dataSection === 'product-supply') {
            // Use scroll restriction navigation if available
            if (scrollRestriction) {
              scrollRestriction.navigateToSection('product-supply-overview');
            } else {
              // Fallback navigation
              const targetSection = document.querySelector('#product-supply-overview');
              if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                  top: offsetTop,
                  behavior: 'smooth'
                });
              }
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
            const targetSection = href.substring(1);
            if (scrollRestriction) {
              scrollRestriction.navigateToSection(targetSection);
            } else {
              // Fallback navigation
              const section = document.querySelector(href);
              if (section) {
                const offsetTop = section.offsetTop - 80;
                window.scrollTo({
                  top: offsetTop,
                  behavior: 'smooth'
                });
              }
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

        if (targetId && targetId.startsWith('#')) {
          const targetSection = targetId.substring(1);

          if (scrollRestriction) {
            scrollRestriction.navigateToSection(targetSection);
          } else {
            // Fallback navigation
            const section = document.querySelector(targetId);
            if (section) {
              const offsetTop = section.offsetTop - 80;
              window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
              });
            }
          }

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
      });
    });
  }

  // Handle main sidebar link clicks (non-dropdown)
  function initMainLinks() {
    sidebarLinks.forEach(link => {
      // Skip dropdown parent links (they're handled in initDropdowns)
      if (link.closest('.has-dropdown')) return;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetSection = href.substring(1);

          if (scrollRestriction) {
            scrollRestriction.navigateToSection(targetSection);
          } else {
            // Fallback navigation
            const section = document.querySelector(href);
            if (section) {
              const offsetTop = section.offsetTop - 80;
              window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
              });
            }
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

  // Simplified active section update - no automatic scrolling
  function updateActiveSection() {
    // This function is now mainly for reference
    // Active states are managed by ScrollRestriction class
    const HEADER_OFFSET = 80;
    const currentScrollY = window.scrollY;

    // Only update if we're in a scrollable area (product supply)
    if (scrollRestriction && scrollRestriction.currentSection === 'product-supply-restricted') {
      // Allow normal scroll behavior for product supply area
      const sections = ['#product-supply-overview', '#kitchen-cabinets-product', '#counter-tops']
        .map(sel => document.querySelector(sel))
        .filter(Boolean);

      let activeId = null;
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= HEADER_OFFSET + 20 && r.bottom > HEADER_OFFSET + 20) {
          activeId = el.id;
          break;
        }
      }

      if (activeId === 'kitchen-cabinets-product') {
        const child = document.querySelector('a[href="#kitchen-cabinets-product"]');
        const parent = document.querySelector('[data-section="product-supply"]');

        document.querySelectorAll('.sidebar-link, .sidebar-sublink').forEach(link => {
          link.classList.remove('active');
        });

        child?.classList.add('active');
        parent?.classList.add('active');

        const dropdown = child?.closest('.has-dropdown');
        if (dropdown) {
          dropdown.classList.add('expanded');
          dropdown.querySelector('.sidebar-submenu')?.classList.add('expanded');
        }
      } else if (activeId === 'product-supply-overview') {
        const parent = document.querySelector('[data-section="product-supply"]');

        document.querySelectorAll('.sidebar-link, .sidebar-sublink').forEach(link => {
          link.classList.remove('active');
        });

        parent?.classList.add('active');

        // Close submenu when on overview
        const dropdown = parent?.closest('.has-dropdown');
        if (dropdown) {
          dropdown.classList.remove('expanded');
          dropdown.querySelector('.sidebar-submenu')?.classList.remove('expanded');
        }
      }
    }
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

      // Recalculate scroll limits if in product supply section
      if (scrollRestriction && scrollRestriction.currentSection === 'product-supply-restricted') {
        scrollRestriction.setupProductSupplyScrollLimits();
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

  // Initialize scroll restriction first
  scrollRestriction = new ScrollRestriction();

  // Update active state on scroll with throttling and scroll boundary enforcement
  // Update active state on scroll with throttling and scroll boundary enforcement
  let scrollTimeout;
  let isScrolling = false;

  window.addEventListener('scroll', () => {
    // Check scroll bounds for product supply sections
    if (scrollRestriction && scrollRestriction.currentSection === 'product-supply-restricted') {
      const currentScrollY = window.scrollY;

      // Immediate hard stop at boundaries
      if (!isScrolling) {
        isScrolling = true;

        if (currentScrollY < scrollRestriction.minScrollY) {
          requestAnimationFrame(() => {
            window.scrollTo({
              top: scrollRestriction.minScrollY,
              behavior: 'instant'
            });
            isScrolling = false;
          });
        } else if (currentScrollY > scrollRestriction.maxScrollY) {
          requestAnimationFrame(() => {
            window.scrollTo({
              top: scrollRestriction.maxScrollY,
              behavior: 'instant'
            });
            isScrolling = false;
          });
        } else {
          isScrolling = false;
        }
      }
    }

    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveSection, 50);
  }, { passive: false }); // Changed to passive: false for immediate prevention

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