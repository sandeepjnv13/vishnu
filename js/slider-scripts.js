// Product Gallery Slider - Inside Product Options Panel
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the our-services page and Glide is available
    if (!document.body.classList.contains('our-services-page')) {
        return;
    }

    if (typeof Glide === 'undefined') {
        console.error('Glide library not loaded!');
        return;
    }

    let glides = {}; // Store glide instances
    let currentActiveGallery = null;
    let currentOptionsPanel = null;

    // Handle option item clicks
    document.querySelectorAll('.option-item').forEach((item) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const finishRaw = this.dataset.finish;
            if (!finishRaw) return;

            const finish = finishRaw.toLowerCase();
            const images = getSampleImages(finish);

            if (!images || images.length === 0) {
                console.warn('No images found for finish:', finish);
                return;
            }

            // Find the product options panel this item belongs to
            const optionsPanel = this.closest('.product-options-panel');
            if (!optionsPanel) return;

            // Close any open gallery first
            closeAllGalleries();

            // Check if clicking the same item that's already active
            if (this.classList.contains('active-gallery-item')) {
                this.classList.remove('active-gallery-item');
                return;
            }

            // Create gallery inside the options panel
            const gallery = createGallery(finish, images, optionsPanel);

            // Mark this item as active
            document.querySelectorAll('.option-item.active-gallery-item').forEach(item => {
                item.classList.remove('active-gallery-item');
            });
            this.classList.add('active-gallery-item');

            // Show gallery and initialize slider
            currentActiveGallery = gallery;
            currentOptionsPanel = optionsPanel;

            // Slide in the gallery
            requestAnimationFrame(() => {
                gallery.classList.add('active');

                // Initialize Glide after gallery is visible
                setTimeout(() => {
                    initializeGlideSlider(gallery, finish);
                }, 300);
            });
        });
    });

    function createGallery(finish, images, optionsPanel) {
        // Remove any existing gallery in this panel
        const existingGallery = optionsPanel.querySelector('.option-gallery');
        if (existingGallery) {
            existingGallery.remove();
        }

        const gallery = document.createElement('div');
        gallery.className = 'option-gallery';
        gallery.id = `gallery-${finish}`;

        const slidesHTML = images.map(img => `
            <li class="glide__slide">
                <img src="${img.src}" alt="${img.alt}" loading="lazy">
                <span>${img.label}</span>
            </li>
        `).join('');

        gallery.innerHTML = `
            <div class="gallery-header">
                <h4>Available ${finish.toUpperCase()} Options</h4>
                <button class="gallery-close" aria-label="Close gallery">×</button>
            </div>
            <div class="glide" id="glide-${finish}">
                <div class="glide__track" data-glide-el="track">
                    <ul class="glide__slides">
                        ${slidesHTML}
                    </ul>
                </div>
                <div class="glide__arrows" data-glide-el="controls">
                    <button class="glide__arrow glide__arrow--left" data-glide-dir="<" aria-label="Previous slide">‹</button>
                    <button class="glide__arrow glide__arrow--right" data-glide-dir=">" aria-label="Next slide">›</button>
                </div>
            </div>
        `;

        // Add close event listener
        const closeBtn = gallery.querySelector('.gallery-close');
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeAllGalleries();
        });

        // Insert gallery between options-grid and product-actions
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

    function initializeGlideSlider(gallery, finish) {
        if (glides[finish]) {
            return; // Already initialized
        }

        try {
            const glideElement = gallery.querySelector(`#glide-${finish}`);
            if (!glideElement) return;

            // Wait for element to have dimensions
            const checkDimensions = () => {
                const rect = glideElement.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) {
                    setTimeout(checkDimensions, 100);
                    return;
                }

                // Initialize Glide
                glides[finish] = new Glide(`#glide-${finish}`, {
                    type: 'carousel',
                    startAt: 0,
                    perView: 3,
                    gap: 20,
                    animationDuration: 400,
                    dragThreshold: 80,
                    swipeThreshold: 50,
                    breakpoints: {
                        1024: { perView: 2, gap: 15 },
                        768: { perView: 2, gap: 15 },
                        480: { perView: 1, gap: 10 }
                    }
                });

                glides[finish].mount();
            };

            checkDimensions();

        } catch (error) {
            console.error('Error initializing Glide for', finish, ':', error);
        }
    }

    function closeAllGalleries() {
        // Destroy all glide instances
        Object.keys(glides).forEach(finish => {
            if (glides[finish]) {
                try {
                    glides[finish].destroy();
                } catch (e) {
                    // Ignore cleanup errors
                }
                delete glides[finish];
            }
        });

        // Remove galleries
        if (currentActiveGallery) {
            currentActiveGallery.classList.remove('active');

            setTimeout(() => {
                if (currentActiveGallery && currentActiveGallery.parentNode) {
                    currentActiveGallery.parentNode.removeChild(currentActiveGallery);
                }
                currentActiveGallery = null;
                currentOptionsPanel = null;
            }, 400); // Match CSS transition duration
        }

        // Clear active option items
        document.querySelectorAll('.option-item.active-gallery-item').forEach(item => {
            item.classList.remove('active-gallery-item');
        });
    }

    function getSampleImages(finish) {
        const imageMap = {
            'laminated': [
                { src: 'resources/banner_1.jpg', alt: 'Wood Grain Laminated', label: 'Wood Grain' },
                { src: 'resources/banner_2.jpg', alt: 'Marble Look Laminated', label: 'Marble Look' },
                { src: 'resources/banner_3.jpg', alt: 'Solid Color Laminated', label: 'Solid Color' },
                { src: 'resources/banner_4.png', alt: 'Textured Laminated', label: 'Textured' },
                { src: 'resources/banner_5.jpg', alt: 'Premium Laminated', label: 'Premium' }
            ],
            'melamine': [
                { src: 'resources/banner_1.jpg', alt: 'White Matt Melamine', label: 'White Matt' },
                { src: 'resources/banner_2.jpg', alt: 'Black Matt Melamine', label: 'Black Matt' },
                { src: 'resources/banner_3.jpg', alt: 'Grey Matt Melamine', label: 'Grey Matt' },
                { src: 'resources/banner_4.png', alt: 'Blue Matt Melamine', label: 'Blue Matt' }
            ],
            'painted': [
                { src: 'resources/banner_2.jpg', alt: 'Glossy White Painted', label: 'Glossy White' },
                { src: 'resources/banner_3.jpg', alt: 'Matt Black Painted', label: 'Matt Black' },
                { src: 'resources/banner_1.jpg', alt: 'Custom Color Painted', label: 'Custom Color' },
                { src: 'resources/banner_5.jpg', alt: 'Satin Finish Painted', label: 'Satin Finish' }
            ],
            'veneer': [
                { src: 'resources/banner_3.jpg', alt: 'Oak Veneer', label: 'Oak' },
                { src: 'resources/banner_1.jpg', alt: 'Walnut Veneer', label: 'Walnut' },
                { src: 'resources/banner_2.jpg', alt: 'Cherry Veneer', label: 'Cherry' },
                { src: 'resources/banner_5.jpg', alt: 'Teak Veneer', label: 'Teak' }
            ],
            'acrylic': [
                { src: 'resources/banner_4.png', alt: 'High Gloss Acrylic', label: 'High Gloss' },
                { src: 'resources/banner_1.jpg', alt: 'Matt Finish Acrylic', label: 'Matt Finish' },
                { src: 'resources/banner_2.jpg', alt: 'Textured Acrylic', label: 'Textured' },
                { src: 'resources/banner_3.jpg', alt: 'Metallic Acrylic', label: 'Metallic' }
            ],
            'pvc': [
                { src: 'resources/banner_5.jpg', alt: 'Wood Pattern PVC', label: 'Wood Pattern' },
                { src: 'resources/banner_1.jpg', alt: 'Solid Color PVC', label: 'Solid Color' },
                { src: 'resources/banner_2.jpg', alt: 'Decorative PVC', label: 'Decorative' },
                { src: 'resources/banner_3.jpg', alt: 'Marble Effect PVC', label: 'Marble Effect' }
            ]
        };

        return imageMap[finish] || [];
    }

    // Event listeners
    document.addEventListener('click', function(e) {
        // Close galleries when clicking outside, but not when clicking option items
        if (!e.target.closest('.option-gallery') &&
            !e.target.closest('.option-item')) {
            closeAllGalleries();
        }
    });

    // ESC key to close galleries
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllGalleries();
        }
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            Object.keys(glides).forEach(finish => {
                if (glides[finish]) {
                    try {
                        glides[finish].update();
                    } catch (e) {
                        // Ignore resize errors
                    }
                }
            });
        }, 250);
    });
});