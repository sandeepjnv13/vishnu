"use strict";
// Header compress on scroll
const siteHeader = document.getElementById('site-header');
let lastY = 0;
window.addEventListener('scroll', () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (y > 12 && y >= lastY) siteHeader.classList.add('scrolled');
    else if (y < 12) siteHeader.classList.remove('scrolled');
    lastY = y;
}, {
    passive: true
});

// Mobile menu (no framework)
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
menuToggle?.addEventListener('click', () => {
    const open = mobileNav.style.display !== 'none';
    mobileNav.style.display = open ? 'none' : 'block';
    menuToggle.setAttribute('aria-expanded', String(!open));
});

// Banner slideshow with gentle zoom + dot navigation + pause on hover
const images = ["resources/Banner_01.png", "resources/banner_5.jpg", "resources/banner_1.jpg", "resources/Banner_04.jpg", "resources/Banner_05.jpeg"];
let current = 0;
const slide1 = document.getElementById("slide1");
const slide2 = document.getElementById("slide2");
const dots = document.querySelectorAll(".dot");
let currentSlide = slide1,
    nextSlide = slide2;
let bannerTimer;
const banner = document.getElementById('banner');

function showSlide(index) {
    nextSlide.style.backgroundImage = `url('${images[index]}')`;
    nextSlide.classList.add("active");
    currentSlide.classList.remove("active");
    [currentSlide, nextSlide] = [nextSlide, currentSlide];
    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
        dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
}

function next() {
    current = (current + 1) % images.length;
    showSlide(current);
}

function startBanner() {
    bannerTimer = setInterval(next, 4500);
}

function stopBanner() {
    clearInterval(bannerTimer);
}

dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
        current = idx;
        showSlide(current);
    });
    dot.addEventListener("keydown", (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            current = idx;
            showSlide(current);
        }
    });
});

currentSlide.style.backgroundImage = `url('${images[0]}')`;
startBanner();
banner.addEventListener('mouseenter', stopBanner);
banner.addEventListener('mouseleave', startBanner);

// Rotate slides for each section (works even if only one image is present)
const rotateSlides = (selector, intervalMs = 5200) => {
    const slides = Array.from(document.querySelectorAll(`${selector} .slide-image`));
    if (slides.length <= 1) return; // nothing to rotate
    let index = 0;
    setInterval(() => {
        slides[index].classList.remove('active');
        index = (index + 1) % slides.length;
        slides[index].classList.add('active');
    }, intervalMs);
};

rotateSlides("#interior");
rotateSlides("#services-turnkey");
rotateSlides("#services-supply");
rotateSlides("#services-consulting");

// Reveal on scroll (cards slide up subtly)
const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    }
}, {
    threshold: 0.14
});

document.querySelectorAll('.interior-section').forEach(el => observer.observe(el));

// Hide menu items once we've scrolled below the hero/banner
(function () {
  const header = document.querySelector('header');
  const nav = document.querySelector('#desktopNav');
  if (!header || !nav) return;

  // Try common hero IDs/classes; adjust if yours is different
  const hero = document.querySelector('.hero, #hero, #banner, .banner');
  if (!hero) return;

  const logo = header.querySelector('.logo');

  const setHidden = (hidden) => {
      header.classList.toggle('menu-hidden', hidden);
      nav.setAttribute('aria-hidden', hidden ? 'true' : 'false');

      if (logo) {
        // hide from assistive tech and remove from tab order when hidden
        logo.setAttribute('aria-hidden', hidden ? 'true' : 'false');

        if (hidden) {
          // remember previous tabindex if present
          logo.__prevTabIndex = logo.hasAttribute('tabindex') ? logo.getAttribute('tabindex') : null;
          logo.setAttribute('tabindex', '-1');
        } else {
          // restore previous tabindex (or remove if none)
          if (logo.__prevTabIndex === null) logo.removeAttribute('tabindex');
          else logo.setAttribute('tabindex', logo.__prevTabIndex);
          delete logo.__prevTabIndex;
        }
      }
    };

  const observer = new IntersectionObserver(
    ([entry]) => {
      // When hero is no longer intersecting the top viewport area, hide menu
      setHidden(!entry.isIntersecting);
    },
    {
      // Offset by header height so "below banner" means banner is fully above the header
      rootMargin: `-${header.offsetHeight}px 0px 0px 0px`,
      threshold: 0
    }
  );

  observer.observe(hero);
})();
