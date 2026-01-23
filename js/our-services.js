// ============================================
// Our Services / Sidebar Navigation
// Works across: our-services, interior-design,
// product-supply, turnkey-execution pages
// ============================================

(function () {
  // Only run on pages that use the services layout
  if (!document.body.classList.contains('our-services-page')) return;

  const sidebar = document.querySelector('.services-sidebar');
  const sidebarTitle = document.querySelector('.sidebar-title');
  const sidebarLinks = Array.from(document.querySelectorAll('.sidebar-link'));
  const sidebarSublinks = Array.from(document.querySelectorAll('.sidebar-sublink'));
  const dropdownItems = Array.from(document.querySelectorAll('.has-dropdown'));
  const header = document.getElementById('site-header');
  const serviceSections = Array.from(document.querySelectorAll('.service-section, .product-supply-overview-section'));

  if (!sidebar) return;

  // --------------------------------------------
  // Helpers
  // --------------------------------------------
  const normalizePath = (path) => {
    if (!path) return '';
    return path.replace(/\/+$/, '').toLowerCase();
  };

  const currentPath = normalizePath(window.location.pathname);
  const currentHash = window.location.hash.toLowerCase();

  const getHeaderOffset = () =>
    (header && header.offsetHeight ? header.offsetHeight : 0) + 16;

  const scrollToHash = (hash) => {
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;

    const top =
      target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

    window.scrollTo({
      top,
      behavior: 'smooth'
    });

    // Update the URL hash to trigger hashchange event
    if (window.location.hash !== hash) {
      history.pushState(null, null, hash);
    }
  };

  const clearActive = () => {
    sidebarLinks.forEach((l) => l.classList.remove('active'));
    sidebarSublinks.forEach((l) => l.classList.remove('active'));
    if (sidebarTitle) sidebarTitle.classList.remove('active');
  };

  const collapseAllDropdowns = () => {
    dropdownItems.forEach((item) => {
      item.classList.remove('expanded');
      const submenu = item.querySelector('.sidebar-submenu');
      if (submenu) submenu.classList.remove('expanded');
    });
  };

  const expandDropdownFor = (link) => {
    const dropdown = link.closest('.has-dropdown');
    if (!dropdown) return;

    dropdown.classList.add('expanded');
    const submenu = dropdown.querySelector('.sidebar-submenu');
    if (submenu) submenu.classList.add('expanded');
  };

  const setActiveLink = (link) => {
    if (!link) return;
    clearActive();

    link.classList.add('active');

    // If this is a sublink, also activate its parent
    if (link.classList.contains('sidebar-sublink')) {
      const dropdown = link.closest('.has-dropdown');
      if (dropdown) {
        const parentLink = dropdown.querySelector('.sidebar-link');
        if (parentLink) parentLink.classList.add('active');
        expandDropdownFor(link);
      }
    } else {
      // If this is the Product Supply parent, keep its dropdown expanded
      if (link.closest('.has-dropdown')) {
        expandDropdownFor(link);
      } else {
        // Non-dropdown root clicks collapse others
        collapseAllDropdowns();
      }
    }
  };

  // --------------------------------------------
  // Click handling for links
  // --------------------------------------------
  const initLinkBehaviour = (link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    let url;
    try {
      url = new URL(href, window.location.origin);
    } catch (e) {
      return; // not a normal URL
    }

    const linkPath = normalizePath(url.pathname);
    const linkHash = (url.hash || '').toLowerCase();
    // Compare just the filename, not the full path
    const currentFileName = currentPath.split('/').pop();
    const linkFileName = linkPath.split('/').pop();
    const isSamePage = !linkPath || linkPath === currentPath || linkFileName === currentFileName;

    // Same-page anchor navigation (smooth scroll + highlight)
    if (isSamePage && linkHash && linkHash.startsWith('#')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToHash(linkHash);
        setActiveLink(link);
        if (link.classList.contains('sidebar-sublink')) {
          expandDropdownFor(link);
        }
      });
      return;
    }

    // Pure hash on our-services.html (e.g. "#services-overview")
    if (isSamePage && !linkPath && linkHash.startsWith('#')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToHash(linkHash);
        setActiveLink(link);
      });
      return;
    }

    // Cross-page navigation – let the browser handle it
    link.addEventListener('click', () => {
      // No preventDefault => page navigation
      // The new page will run this script again & re-highlight properly
    });
  };

  sidebarLinks.forEach(initLinkBehaviour);
  sidebarSublinks.forEach(initLinkBehaviour);

  // --------------------------------------------
  // Initial highlighting based on page + hash
  // --------------------------------------------
  const applyInitialHighlight = () => {
    const page = currentPath.split('/').pop() || 'our-services.html';

    // Prefer hash-based matches first (for sub-sections)
    if (currentHash) {
      const hashSelector =
        `.sidebar-sublink[href$="${currentHash}"], .sidebar-link[href$="${currentHash}"]`;
      const hashMatch = document.querySelector(hashSelector);
      if (hashMatch) {
        if (hashMatch.classList.contains('sidebar-sublink')) {
          expandDropdownFor(hashMatch);
        }
        setActiveLink(hashMatch);
        return;
      }
    }

    // Page-based fallbacks
    if (page === 'product-catalog.html') {
      // Always expand Product Supply dropdown on this page
      dropdownItems.forEach((item) => {
        const submenu = item.querySelector('.sidebar-submenu');
        if (submenu && item.querySelector('[data-section="product-supply"]')) {
          item.classList.add('expanded');
          submenu.classList.add('expanded');
        }
      });

      // Check for specific product sections based on hash
      if (currentHash) {
        let matchingSublink = null;

        // Map hash to corresponding sublink (currentHash is already lowercase)
        if (currentHash === '#kitchen-cabinets-product') {
          matchingSublink = document.querySelector('.sidebar-sublink[href*="kitchen-cabinets-product"]');
        } else if (currentHash === '#counter-tops') {
          matchingSublink = document.querySelector('.sidebar-sublink[href*="counter-tops"]');
        } else if (currentHash === '#flooring-block') {
           matchingSublink = document.querySelector('.sidebar-sublink[href*="Flooring-Block"]');
        } else if (currentHash === '#tiles-block') {
           matchingSublink = document.querySelector('.sidebar-sublink[href*="Tiles-Block"]');
        } else if (currentHash === '#showerdoors-block') {
           matchingSublink = document.querySelector('.sidebar-sublink[href*="ShowerDoors-Block"]');
        }

        if (matchingSublink) {
          // Highlight the specific sublink and its parent
          setActiveLink(matchingSublink);
          return;
        }
      }

      // No specific hash: highlight the PRODUCT SUPPLY overview link
      const overviewLink =
        document.querySelector(
          '.sidebar-link[href*="product-catalog.html#product-supply-overview"]'
        ) || document.querySelector('[data-section="product-supply"]');

      setActiveLink(overviewLink);
      return;
    }

    if (page === 'interior-design.html') {
      const link =
        document.querySelector(
          '.sidebar-link[href*="interior-design.html#interior-design"]'
        ) || document.querySelector('[data-section="interior-design"]');
      setActiveLink(link);
      return;
    }

    if (page === 'turnkey-execution.html') {
      const link =
        document.querySelector(
          '.sidebar-link[href*="turnkey-execution.html#turnkey-execution"]'
        ) || document.querySelector('[data-section="turnkey-execution"]');
      setActiveLink(link);
      return;
    }

    if (page === 'our-services.html') {
      // Highlight the "OUR SERVICES" title as the current page anchor
      if (sidebarTitle) {
        sidebarTitle.classList.add('active');
      }
      return;
    }
  };

  // --------------------------------------------
  // Handle hash changes (for same-page navigation)
  // --------------------------------------------
  const handleHashChange = () => {
    const newHash = window.location.hash.toLowerCase();

    if (newHash && currentPath.split('/').pop() === 'product-catalog.html') {
      let matchingSublink = null;

      // Map hash to corresponding sublink (newHash is already lowercase)
      if (newHash === '#kitchen-cabinets-product') {
        matchingSublink = document.querySelector('.sidebar-sublink[href*="kitchen-cabinets-product"]');
      } else if (newHash === '#counter-tops') {
        matchingSublink = document.querySelector('.sidebar-sublink[href*="counter-tops"]');
      }else if (newHash === '#flooring-block') {
        matchingSublink = document.querySelector('.sidebar-sublink[href*="Flooring-Block"]');
      } else if (newHash === '#tiles-block') {
        matchingSublink = document.querySelector('.sidebar-sublink[href*="Tiles-Block"]');
      } else if (newHash === '#showerdoors-block') {
        matchingSublink = document.querySelector('.sidebar-sublink[href*="ShowerDoors-Block"]');
      } else if (newHash === '#product-supply-overview') {
        // For overview, highlight the parent link
        const overviewLink = document.querySelector('[data-section="product-supply"]');
        if (overviewLink) {
          setActiveLink(overviewLink);
          return;
        }
      }

      if (matchingSublink) {
        setActiveLink(matchingSublink);
      }
    } else {
      // Re-apply initial highlight for other cases
      applyInitialHighlight();
    }
  };

  // Listen for hash changes
  window.addEventListener('hashchange', handleHashChange);

  // --------------------------------------------
  // Mobile sidebar toggle
  // --------------------------------------------
  let sidebarToggle = null;

  const ensureSidebarToggle = () => {
    const shouldShow = window.innerWidth <= 700;
    if (shouldShow && !sidebarToggle) {
      sidebarToggle = document.createElement('button');
      sidebarToggle.className = 'sidebar-toggle';
      sidebarToggle.textContent = '☰';
      sidebarToggle.setAttribute('aria-label', 'Toggle sidebar menu');
      document.body.appendChild(sidebarToggle);

      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        sidebarToggle.textContent = sidebar.classList.contains('active')
          ? '✕'
          : '☰';
      });
    }

    if (sidebarToggle) {
      sidebarToggle.style.display = shouldShow ? 'block' : 'none';
      if (!shouldShow) {
        sidebar.classList.remove('active');
        sidebarToggle.textContent = '☰';
      }
    }
  };

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 700 || !sidebarToggle) return;
    if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
      sidebar.classList.remove('active');
      sidebarToggle.textContent = '☰';
    }
  });

  window.addEventListener('resize', () => {
    // debounce not strictly needed, but cheap
    clearTimeout(window.__servicesResizeTimeout);
    window.__servicesResizeTimeout = setTimeout(ensureSidebarToggle, 200);
  });

  // --------------------------------------------
  // Header scroll behavior (simple "scrolled" class)
  // --------------------------------------------
  const updateHeader = () => {
    if (!header) return;
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };

  window.addEventListener('scroll', updateHeader, { passive: true });

  // --------------------------------------------
  // Section reveal animation (optional, using .in-view)
  // --------------------------------------------
  if ('IntersectionObserver' in window && serviceSections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-50px 0px'
      }
    );

    serviceSections.forEach((section) => observer.observe(section));
  }

  // --------------------------------------------
  // Enhanced scroll spy for product catalog sections
  // --------------------------------------------
  if (currentPath.split('/').pop() === 'product-catalog.html') {
    const sections = document.querySelectorAll('#product-supply-overview, #kitchen-cabinets-product, #counter-tops, #Flooring-Block, #Tiles-Block, #ShowerDoors-Block');

    if (sections.length > 0) {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              const sectionId = entry.target.id;
              let targetLink = null;

              // Find corresponding sidebar link
              if (sectionId === 'product-supply-overview') {
                targetLink = document.querySelector('[data-section="product-supply"]');
              } else if (sectionId === 'kitchen-cabinets-product') {
                targetLink = document.querySelector('.sidebar-sublink[href*="kitchen-cabinets-product"]');
              } else if (sectionId === 'counter-tops') {
                targetLink = document.querySelector('.sidebar-sublink[href*="counter-tops"]');
              } else if (sectionId === 'Flooring-Block') {
                targetLink = document.querySelector('.sidebar-sublink[href*="Flooring-Block"]');
              } else if (sectionId === 'Tiles-Block') {
                targetLink = document.querySelector('.sidebar-sublink[href*="Tiles-Block"]');
              } else if (sectionId === 'ShowerDoors-Block') {
                targetLink = document.querySelector('.sidebar-sublink[href*="ShowerDoors-Block"]');
              }

              if (targetLink && !window.location.hash) {
                // Only update if there's no explicit hash in URL
                setActiveLink(targetLink);
              }
            }
          });
        },
        {
          threshold: [0.3],
          rootMargin: '-100px 0px -100px 0px'
        }
      );

      sections.forEach((section) => sectionObserver.observe(section));
    }
  }

  // --------------------------------------------
  // Init on load
  // --------------------------------------------
  applyInitialHighlight();
  ensureSidebarToggle();
  updateHeader();
})();