

// ============================================
// Our Services Page Specific JavaScript
// Add this to your main.js file
// ============================================

// Check if we're on the Our Services page
if (document.body.classList.contains('our-services-page')) {

  // Sidebar navigation active state management
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const serviceSections = document.querySelectorAll('.service-section');

  // Update active sidebar link based on scroll position
  function updateActiveSection() {
    const scrollPosition = window.scrollY + 200;

    serviceSections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        sidebarLinks.forEach(link => link.classList.remove('active'));
        if (sidebarLinks[index]) {
          sidebarLinks[index].classList.add('active');
        }
      }
    });
  }

  // Smooth scroll to sections when sidebar links are clicked
  sidebarLinks.forEach(link => {
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
      }
    });
  });

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