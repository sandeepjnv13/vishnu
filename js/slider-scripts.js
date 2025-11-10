// ================================
// slider-scripts.js (race-safe, no first-image flash)
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

document.addEventListener('DOMContentLoaded', function () {
  if (!document.body.classList.contains('our-services-page')) return;
  if (typeof Glide === 'undefined') { console.error('[slider] Glide not loaded'); return; }

  // 2) Runtime state
  let glides = {};
  let currentActiveGallery = null;
  const CSS_TRANSITION_MS = 350;          // keep in sync with .option-gallery expand transition
  const SAFE_REMOVE_MS = CSS_TRANSITION_MS + 10;

  // 3) Click -> open gallery
  document.querySelectorAll('.option-item').forEach((item) => {
    item.addEventListener('click', function (e) {
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

      // Close previous (race-safe)
      closeAllGalleries();

      // Build + insert new
      const gallery = createGallery(cfg, sectionEl, this.closest('.product-options-panel'));

      // mark active option
      document.querySelectorAll('.option-item.active-gallery-item').forEach(it => it.classList.remove('active-gallery-item'));
      this.classList.add('active-gallery-item');

      currentActiveGallery = gallery;

      // Let layout settle, then expand and mount on transitionend
      requestAnimationFrame(() => {
        const mountGlide = () => {
          initializeGlideSlider(gallery, {
            id: `glide-${sectionId}-${finishKey}`,
            perView: cfg.perView ?? 3
          });
        };

        const onEnd = (ev) => {
          if (ev.target !== gallery) return;
          gallery.removeEventListener('transitionend', onEnd);
          mountGlide();
        };

        // Fallback if transitionend doesn't fire
        let fallbackTimer = setTimeout(() => {
          gallery.removeEventListener('transitionend', onEnd);
          mountGlide();
        }, SAFE_REMOVE_MS + 60);

        gallery.addEventListener('transitionend', (ev) => {
          if (ev.target !== gallery) return;
          clearTimeout(fallbackTimer);
        });

        gallery.addEventListener('transitionend', onEnd, { once: true });
        gallery.classList.add('active'); // triggers CSS expand
      });
    });
  });

  // 4) Build gallery DOM
  function createGallery(cfg, sectionEl, optionsPanel) {
    if (!optionsPanel) optionsPanel = sectionEl.querySelector('.product-options-panel');

    // remove existing gallery in this panel (defensive; closeAllGalleries() already clears)
    const existing = optionsPanel.querySelector('.option-gallery');
    if (existing) existing.remove();

    const gallery = document.createElement('div');
    gallery.className = 'option-gallery';
    gallery.setAttribute('aria-expanded', 'false');

    const slides = cfg.images.map(img => `
      <li class="glide__slide">
        <img src="${img.src}" alt="${img.alt || ''}" loading="lazy" decoding="async">
        <span>${img.label || ''}</span>
      </li>
    `).join('');

    const title = cfg.title || 'Options';

    gallery.innerHTML = `
      <div class="gallery-header">
        <h4>${title}</h4>
        <button class="gallery-close" aria-label="Close gallery" type="button">×</button>
      </div>
      <div class="glide" aria-hidden="true">
        <div class="glide__track" data-glide-el="track">
          <ul class="glide__slides">${slides}</ul>
        </div>
        <div class="glide__arrows" data-glide-el="controls">
          <button class="glide__arrow glide__arrow--left" data-glide-dir="<" aria-label="Previous slide" type="button">‹</button>
          <button class="glide__arrow glide__arrow--right" data-glide-dir=">" aria-label="Next slide" type="button">›</button>
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

  // 5) Initialize Glide safely (and reveal only after mount)
  function initializeGlideSlider(gallery, opts) {
    const el = gallery.querySelector('.glide');
    if (!el) return;

    const mount = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        // wait until it is actually visible & sized
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
        breakpoints: {
          1024: { perView: Math.min(2, opts.perView || 2), gap: 15 },
          768:  { perView: 2 },
          480:  { perView: 1, gap: 10 }
        }
      });
      instance.mount();

      // Reveal carousel only after Glide has mounted
      el.classList.add('is-ready');
      el.removeAttribute('aria-hidden');
      gallery.setAttribute('aria-expanded', 'true');

      glides[opts.id] = instance;
    };
    mount();
  }

  // 6) Close all galleries (race-safe)
  function closeAllGalleries() {
    // destroy all glide instances
    Object.values(glides).forEach(g => { try { g.destroy(); } catch (_) {} });
    glides = {};

    // capture the element to remove so async timeout can't remove a newly opened one
    const toRemove = currentActiveGallery;
    if (toRemove) {
      toRemove.classList.remove('active'); // triggers CSS collapse
      toRemove.setAttribute('aria-expanded', 'false');
      setTimeout(() => {
        try { toRemove.remove(); } catch (_) {}
      }, SAFE_REMOVE_MS);
    }
    currentActiveGallery = null;

    // clear any visual active state on options
    document.querySelectorAll('.option-item.active-gallery-item')
      .forEach(it => it.classList.remove('active-gallery-item'));
  }

  // 7) Dismiss on outside click / Esc / keep sliders fresh on resize
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.option-gallery') && !e.target.closest('.option-item')) closeAllGalleries();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllGalleries(); });
  window.addEventListener('resize', () => Object.values(glides).forEach(g => { try { g.update(); } catch (_) {} }));
});
