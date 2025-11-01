// Product Catalog Sections JavaScript
// Add this to handle product catalog sections within our-services page

class ProductCatalogSections {
  constructor() {
    this.init();
  }

  init() {
    this.setupImageInteractions();
    this.setupFinishSelection();
    this.setupActionButtons();
    this.setupScrollAnimations();
    this.setupKeyboardNavigation();
  }

  // Handle clicking sub-images to update main image
  setupImageInteractions() {
    const productSections = document.querySelectorAll('.product-catalog-section');

    productSections.forEach(section => {
      const variationItems = section.querySelectorAll('.variation-item');
      const mainImage = section.querySelector('.main-product-showcase img');

      variationItems.forEach(item => {
        item.addEventListener('click', () => {
          // Remove active class from all variations in this section
          variationItems.forEach(v => v.classList.remove('active'));

          // Add active class to clicked item
          item.classList.add('active');

          // Update main image if available
          const itemImage = item.querySelector('img');
          if (itemImage && mainImage && itemImage.src) {
            mainImage.src = itemImage.src;
            mainImage.alt = itemImage.alt;

            // Add a subtle flash effect
            mainImage.style.opacity = '0.7';
            setTimeout(() => {
              mainImage.style.opacity = '1';
            }, 150);
          }
        });
      });
    });
  }

  // Handle finish/option selection
  setupFinishSelection() {
    const productSections = document.querySelectorAll('.product-catalog-section');

    productSections.forEach(section => {
      const optionItems = section.querySelectorAll('.option-item');

      optionItems.forEach(item => {
        item.addEventListener('click', () => {
          // Remove selected class from all options in this section
          optionItems.forEach(o => o.classList.remove('selected'));

          // Add selected class to clicked item
          item.classList.add('selected');

          // Optional: Update main image based on selected finish
          const finishImage = item.querySelector('img');
          const mainImage = section.querySelector('.main-product-showcase img');

          if (finishImage && mainImage && finishImage.dataset.mainImage) {
            mainImage.src = finishImage.dataset.mainImage;
            mainImage.alt = finishImage.alt;
          }

          // Dispatch custom event for tracking
          const event = new CustomEvent('finishSelected', {
            detail: {
              section: section.id,
              finish: item.dataset.finish,
              label: item.querySelector('.option-label')?.textContent
            }
          });
          document.dispatchEvent(event);
        });
      });
    });
  }

  // Setup action button interactions
  setupActionButtons() {
    const actionButtons = document.querySelectorAll('.action-btn');

    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const action = button.querySelector('span').textContent.trim();
        const section = button.closest('.product-catalog-section');

        // Add click effect
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = '';
        }, 150);

        // Dispatch tracking event
        const event = new CustomEvent('actionClicked', {
          detail: {
            action: action,
            section: section.id,
            url: button.href
          }
        });
        document.dispatchEvent(event);

        console.log(`Action clicked: ${action} in section ${section.id}`);
      });
    });
  }

  // Setup scroll animations for sections
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '-50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');

          // Stagger animation for child elements
          const items = entry.target.querySelectorAll('.variation-item, .option-item');
          items.forEach((item, index) => {
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Observe all product catalog sections
    const productSections = document.querySelectorAll('.product-catalog-section');
    productSections.forEach(section => {
      sectionObserver.observe(section);

      // Set initial state for staggered animations
      const items = section.querySelectorAll('.variation-item, .option-item');
      items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 400ms ease, transform 400ms ease';
      });
    });
  }

  // Setup keyboard navigation
  setupKeyboardNavigation() {
    const interactiveItems = document.querySelectorAll('.variation-item, .option-item');

    interactiveItems.forEach(item => {
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });

      // Add focus styles
      item.addEventListener('focus', () => {
        item.style.outline = '2px solid var(--brand-accent, #58c4c0)';
        item.style.outlineOffset = '2px';
      });

      item.addEventListener('blur', () => {
        item.style.outline = '';
        item.style.outlineOffset = '';
      });
    });
  }

  // Method to dynamically add a new product section
  addProductSection(sectionConfig, insertAfter = null) {
    const html = this.generateSectionHTML(sectionConfig);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const newSection = tempDiv.firstElementChild;

    if (insertAfter) {
      insertAfter.parentNode.insertBefore(newSection, insertAfter.nextSibling);
    } else {
      const servicesContent = document.querySelector('.services-content');
      servicesContent.appendChild(newSection);
    }

    // Re-initialize interactions for the new section
    this.init();

    return newSection;
  }

  // Generate HTML for a section from config
  generateSectionHTML(config) {
    const subImagesHTML = config.subImages.map(img => `
      <div class="variation-item" data-image="${img.url}">
        <img src="${img.url}" alt="${img.alt}">
        <span class="variation-label">${img.label}</span>
      </div>
    `).join('');

    const finishOptionsHTML = config.finishes.map(finish => `
      <div class="option-item" data-finish="${finish.label}">
        <img src="${finish.url}" alt="${finish.alt}">
        <span class="option-label">${finish.label}</span>
      </div>
    `).join('');

    return `
      <section id="${config.sectionId}" class="service-section product-catalog-section ${config.altLayout ? 'alt-layout' : ''}">
        <div class="container">
          <div class="product-section-header">
            <h2>${config.title}</h2>
            <p class="product-description">${config.description}</p>
          </div>

          <div class="product-catalog-layout">
            <div class="product-images-container">
              <div class="main-product-showcase">
                <img src="${config.mainImage}" alt="${config.title}">
                <div class="image-hover-effect">${config.hoverText}</div>
              </div>

              <div class="product-variations">
                ${subImagesHTML}
              </div>
            </div>

            <div class="product-options-panel">
              <div class="options-header">
                <h3>${config.optionsTitle || 'FINISHES'}</h3>
              </div>

              <div class="options-grid">
                ${finishOptionsHTML}
              </div>

              <div class="product-actions">
                <a href="${config.certificationsLink}" class="action-btn primary">
                  <span>SEE CERTIFICATIONS</span>
                  <span class="btn-arrow">></span>
                </a>
                <a href="${config.quoteLink}" class="action-btn secondary">
                  <span>GET A QUOTE</span>
                  <span class="btn-arrow">></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

// Template configurations for easy section generation
const ProductSectionTemplates = {
  kitchenCabinets: {
    sectionId: 'kitchen-cabinets-section',
    title: 'KITCHEN CABINETS AND VANITIES',
    description: 'Premium kitchen cabinets and vanities designed to combine functionality with aesthetic appeal.',
    mainImage: 'resources/kitchen-cabinet-main.jpg',
    hoverText: '/the image shall shake/zoom on mouse hovering/',
    altLayout: false,
    subImages: [
      { url: 'resources/cabinet-plain.jpg', alt: 'Plain Style', label: 'PLAIN' },
      { url: 'resources/cabinet-shakers.jpg', alt: 'Shakers Style', label: 'SHAKERS' },
      { url: 'resources/cabinet-fluted.jpg', alt: 'Fluted Style', label: 'FLUTED' }
    ],
    finishes: [
      { url: 'resources/finish-laminated.jpg', alt: 'Laminated', label: 'LAMINATED' },
      { url: 'resources/finish-melamine.jpg', alt: 'Melamine', label: 'MELAMINE' },
      { url: 'resources/finish-painted.jpg', alt: 'Painted', label: 'PAINTED' },
      { url: 'resources/finish-veneer.jpg', alt: 'Veneer', label: 'VENEER' },
      { url: 'resources/finish-acrylic.jpg', alt: 'Acrylic', label: 'ACRYLIC' },
      { url: 'resources/finish-pvc.jpg', alt: 'PVC', label: 'PVC' }
    ],
    certificationsLink: '#certifications',
    quoteLink: '#quote'
  },

  countertops: {
    sectionId: 'countertops-section',
    title: 'COUNTERTOPS',
    description: 'Durable and beautiful countertops for kitchens, bathrooms, and commercial spaces.',
    mainImage: 'resources/countertop-main.jpg',
    hoverText: '/the image shall shake/zoom on mouse hovering/',
    altLayout: true,
    subImages: [
      { url: 'resources/countertop-kitchen.jpg', alt: 'Kitchen', label: 'KITCHEN' },
      { url: 'resources/countertop-bathroom.jpg', alt: 'Bathroom', label: 'BATHROOM' },
      { url: 'resources/countertop-backsplash.jpg', alt: 'Backsplash', label: 'BACKSPLASH' }
    ],
    finishes: [
      { url: 'resources/countertop-calacatta.jpg', alt: 'Calacatta', label: 'CALACATTA' },
      { url: 'resources/countertop-carrara.jpg', alt: 'Carrara', label: 'CARRARA' },
      { url: 'resources/countertop-granite.jpg', alt: 'Granite', label: 'GRANITE' },
      { url: 'resources/countertop-quartz.jpg', alt: 'Quartz', label: 'QUARTZ' },
      { url: 'resources/countertop-marble.jpg', alt: 'Marble', label: 'MARBLE' },
      { url: 'resources/countertop-concrete.jpg', alt: 'Concrete', label: 'CONCRETE' }
    ],
    certificationsLink: '#certifications',
    quoteLink: '#quote'
  },

  flooring: {
    sectionId: 'flooring-section',
    title: 'FLOORING',
    description: 'High-quality flooring solutions for residential and commercial applications.',
    mainImage: 'resources/flooring-main.jpg',
    hoverText: '/the image shall shake/zoom on mouse hovering/',
    altLayout: false,
    subImages: [
      { url: 'resources/flooring-hardwood.jpg', alt: 'Hardwood', label: 'HARDWOOD' },
      { url: 'resources/flooring-laminate.jpg', alt: 'Laminate', label: 'LAMINATE' },
      { url: 'resources/flooring-vinyl.jpg', alt: 'Vinyl', label: 'VINYL' }
    ],
    finishes: [
      { url: 'resources/flooring-oak.jpg', alt: 'Oak', label: 'OAK' },
      { url: 'resources/flooring-maple.jpg', alt: 'Maple', label: 'MAPLE' },
      { url: 'resources/flooring-cherry.jpg', alt: 'Cherry', label: 'CHERRY' },
      { url: 'resources/flooring-walnut.jpg', alt: 'Walnut', label: 'WALNUT' },
      { url: 'resources/flooring-bamboo.jpg', alt: 'Bamboo', label: 'BAMBOO' },
      { url: 'resources/flooring-tile.jpg', alt: 'Tile', label: 'TILE' }
    ],
    certificationsLink: '#certifications',
    quoteLink: '#quote'
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if we have product catalog sections
  if (document.querySelector('.product-catalog-section')) {
    window.productCatalog = new ProductCatalogSections();

    // Listen for custom events
    document.addEventListener('finishSelected', (e) => {
      console.log('Finish selected:', e.detail);
    });

    document.addEventListener('actionClicked', (e) => {
      console.log('Action clicked:', e.detail);
    });
  }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProductCatalogSections, ProductSectionTemplates };
}