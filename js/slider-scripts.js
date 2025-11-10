// ================================
// slider-scripts.js (self-contained)
// ================================

// 1) Gallery config (keys are "<sectionId>::<optionKey>")
const GALLERY_CONFIG = {
  // COUNTERTOPS
  "counter-tops::laminated": {
    title: "Available LAMINATED Options",
    perView: 3,
    images: [
      { src: "resources/banner_1.jpg", alt: "Wood Grain Laminated", label: "Wood Grain" },
      { src: "resources/banner_2.jpg", alt: "Marble Look Laminated", label: "Marble Look" },
      { src: "resources/banner_3.jpg", alt: "Solid Color Laminated", label: "Solid Color" },
      { src: "resources/banner_4.png", alt: "Textured Laminated", label: "Textured" }
    ]
  },
  "counter-tops::melamine": {
    title: "Melamine Finishes",
    perView: 2,
    images: [
      { src: "resources/melamine-1.jpg", alt: "White Matt", label: "White Matt" },
      { src: "resources/melamine-2.jpg", alt: "Black Matt", label: "Black Matt" }
    ]
  },

  // KITCHEN CABINETS AND VANITIES
  "kitchen-cabinets-product::laminated": {
    title: "Cabinet Laminates",
    perView: 3,
    images: [
      { src: "resources/Image1.jpg", alt: "Laminate 1", label: "Lam 1" },
      { src: "resources/Image2.jpg", alt: "Laminate 2", label: "Lam 2" },
      { src: "resources/Image3.jpg", alt: "Laminate 3", label: "Lam 3" }
    ]
  },
  "kitchen-cabinets-product::melamine": {
    title: "Cabinet Melamine",
    perView: 3,
    images: [
      { src: "resources/Image1.jpg", alt: "Melamine 1", label: "Mel 1" },
      { src: "resources/Image2.jpg", alt: "Melamine 2", label: "Mel 2" }
    ]
  }

  // Add more entries as needed...
};

// 2) Runtime
document.addEventListener('DOMContentLoaded', function() {
  // page guard
  if (!document.body.classList.contains('our-services-page')) return;
  if (typeof Glide === 'undefined') { console.error('[slider] Glide not loaded'); return; }

  let glides = {};
  let currentActiveGallery = null;

  // Click -> open gallery
  document.querySelectorAll('.option-item').forEach((item) => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const sectionEl = this.closest('.product-catalog-section');
      if (!sectionEl) return;

      const sectionId = sectionEl.id;
      const explicitKey = (this.dataset.galleryId || '').trim().toLowerCase();
      const finishRaw = (this.dataset.finish || '').trim();
      const finishKey = (explicitKey || finishRaw).toLowerCase();
      if (!finishKey) return;

      const configKey = `${sectionId}::${finishKey}`;
      const cfg = GALLERY_CONFIG[configKey];

      if (!cfg || !Array.isArray(cfg.images) || cfg.images.length === 0) {
        console.warn('[slider] No gallery config for', configKey);
        closeAllGalleries();
        this.classList.remove('active-gallery-item');
        return;
      }

      // Close previous
      closeAllGalleries();

      // Build + insert new
      const gallery = createGallery(cfg, sectionEl, this.closest('.product-options-panel'));

      // set active visual state
      document.querySelectorAll('.option-item.active-gallery-item').forEach(it => it.classList.remove('active-gallery-item'));
      this.classList.add('active-gallery-item');

      currentActiveGallery = gallery;

      requestAnimationFrame(() => {
        gallery.classList.add('active');
        setTimeout(() => {
          initializeGlideSlider(gallery, {
            id: `glide-${sectionId}-${finishKey}`,
            perView: cfg.perView ?? 3
          });
        }, 300);
      });
    });
  });

  function createGallery(cfg, sectionEl, optionsPanel) {
    if (!optionsPanel) optionsPanel = sectionEl.querySelector('.product-options-panel');

    // remove existing gallery in this panel
    const existing = optionsPanel.querySelector('.option-gallery');
    if (existing) existing.remove();

    const gallery = document.createElement('div');
    gallery.className = 'option-gallery';

    const slides = cfg.images.map(img => `
      <li class="glide__slide">
        <img src="${img.src}" alt="${img.alt || ''}" loading="lazy">
        <span>${img.label || ''}</span>
      </li>
    `).join('');

    const title = cfg.title || 'Options';

    gallery.innerHTML = `
      <div class="gallery-header">
        <h4>${title}</h4>
        <button class="gallery-close" aria-label="Close gallery">×</button>
      </div>
      <div class="glide">
        <div class="glide__track" data-glide-el="track">
          <ul class="glide__slides">${slides}</ul>
        </div>
        <div class="glide__arrows" data-glide-el="controls">
          <button class="glide__arrow glide__arrow--left" data-glide-dir="<" aria-label="Previous slide">‹</button>
          <button class="glide__arrow glide__arrow--right" data-glide-dir=">" aria-label="Next slide">›</button>
        </div>
      </div>
    `;

    gallery.querySelector('.gallery-close').addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllGalleries();
    });

    // Insert after .options-grid (before .product-actions)
    const optionsGrid = optionsPanel.querySelector('.options-grid');
    const productActions = optionsPanel.querySelector('.product-actions');
    if (optionsGrid && productActions) {
      optionsPanel.insertBefore(gallery, productActions);
    } else if (optionsGrid) {
      optionsGrid.parentNode.insertBefore(gallery, optionsGrid.nextSibling);
    } else {
      optionsPanel.appendChild(gallery);
    }
    return gallery;
  }

  function initializeGlideSlider(gallery, opts) {
    const el = gallery.querySelector('.glide');
    if (!el) return;

    const mount = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        setTimeout(mount, 80);
        return;
      }
      const instance = new Glide(el, {
        type: 'carousel',
        startAt: 0,
        perView: opts.perView,
        gap: 20,
        animationDuration: 400,
        dragThreshold: 80,
        swipeThreshold: 50,
        breakpoints: { 1024: { perView: 2, gap: 15 }, 768: { perView: 2 }, 480: { perView: 1, gap: 10 } }
      });
      instance.mount();
      glides[opts.id] = instance;
    };
    mount();
  }

  function closeAllGalleries() {
    Object.values(glides).forEach(g => { try { g.destroy(); } catch (_) {} });
    glides = {};
    if (currentActiveGallery) {
      currentActiveGallery.classList.remove('active');
      setTimeout(() => currentActiveGallery?.remove(), 350);
    }
    currentActiveGallery = null;
    document.querySelectorAll('.option-item.active-gallery-item').forEach(it => it.classList.remove('active-gallery-item'));
  }

  // Dismiss on outside click / Esc / resize update
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.option-gallery') && !e.target.closest('.option-item')) closeAllGalleries();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllGalleries(); });
  window.addEventListener('resize', () => Object.values(glides).forEach(g => { try { g.update(); } catch(_) {} }));
});
