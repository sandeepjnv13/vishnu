// Product Collage Script
// Handles the collage functionality for product catalog pages
// Separate from interior-collage.js to avoid affecting existing implementation

(function() {
    'use strict';

    // Only run on pages with product collage sections
    const productCollageContainers = document.querySelectorAll('.product-collage-container');
    if (productCollageContainers.length === 0) return;

    // Default collage configuration for product pages
    // Can be customized per section using data attributes or global config
    const defaultProductCollageConfig = {
        'custom-furniture': [
            // Row 1: 3 images
            {
                height: 'medium',
                images: [
                    { src: 'resources/Office_1_2.Workspac.jpeg', alt: 'Modern Office Space', flex: 1 },
                    { src: 'resources/Retail_2 (5).jpeg', alt: 'Salon Interior', flex: 1 },
                    { src: 'resources/Restaurant_7 (3).jpeg', alt: 'Restaurant Design', flex: 1 }
                ]
            },
            // Row 2: 2 images
            {
                height: 'tall',
                images: [
                    { src: 'resources/Office_2_wmremove-transformed (3).jpeg', alt: 'Industrial Office', flex: 1 },
                    { src: 'resources/Restaurant_8 (2).jpeg', alt: 'Upscale Restaurant', flex: 1 }
                ]
            },
            // Row 3: 4 images
            {
                height: 'medium',
                images: [
                    { src: 'resources/Restaurant _1 (6).jpeg', alt: 'Restaurant Lounge', flex: 1 },
                    { src: 'resources/Office_3_COLAB ROOM 03.jpg', alt: 'Conference Room', flex: 1 },
                    { src: 'resources/Restaurant_3 (1).jpg', alt: 'Evening Cafe', flex: 1 },
                    { src: 'resources/Restaurant_5 (2).jpg', alt: 'Bar Interior', flex: 1 }
                ]
            }
        ]
    };

    // Global config storage that can be extended
    window.productCollageConfigs = window.productCollageConfigs || {};

    // Merge default configs
    Object.assign(window.productCollageConfigs, defaultProductCollageConfig);

    // Initialize all product collages on the page
    function initProductCollages() {
        productCollageContainers.forEach(container => {
            const collageId = container.dataset.collageId || 'our-work-collage';
            const config = window.productCollageConfigs[collageId];

            if (config) {
                buildCollage(container, config);
            } else {
                console.warn(`Product collage config not found for: ${collageId}`);
            }
        });
    }

    // Build the collage DOM structure
    function buildCollage(container, config) {
        // Clear existing content
        container.innerHTML = '';

        // Create collage container
        const collage = document.createElement('div');
        collage.className = 'product-collage';

        // Create hover preview container
        const hoverPreview = document.createElement('div');
        hoverPreview.className = 'collage-hover-preview';

        const previewImg = document.createElement('div');
        previewImg.className = 'preview-image';
        previewImg.innerHTML = '<img src="" alt="Preview">';
        hoverPreview.appendChild(previewImg);

        // Build the collage rows
        config.forEach((rowConfig, rowIndex) => {
            const row = document.createElement('div');
            row.className = `collage-row row-${rowConfig.height || 'medium'}`;

            rowConfig.images.forEach((imgConfig, imgIndex) => {
                const item = document.createElement('div');
                item.className = 'collage-item';

                if (imgConfig.flex) {
                    item.setAttribute('data-flex', imgConfig.flex);
                }
                item.setAttribute('data-row', rowIndex);
                item.setAttribute('data-index', imgIndex);

                const img = document.createElement('img');
                img.src = imgConfig.src;
                img.alt = imgConfig.alt || 'Interior Design';
                img.loading = 'lazy';

                item.appendChild(img);
                row.appendChild(item);

                // Add hover event listeners
                item.addEventListener('mouseenter', handleItemHover);
                item.addEventListener('mouseleave', handleItemLeave);
            });

            collage.appendChild(row);
        });

        collage.appendChild(hoverPreview);
        container.appendChild(collage);

        // Store references
        container._collage = collage;
        container._hoverPreview = hoverPreview;
        container._previewImg = previewImg;
    }

    // Handle hover on collage item
    function handleItemHover(e) {
        const item = e.currentTarget;
        const img = item.querySelector('img');
        const collageContainer = item.closest('.product-collage');
        const hoverPreview = collageContainer.querySelector('.collage-hover-preview');
        const previewImg = hoverPreview.querySelector('.preview-image');
        const previewImgElement = previewImg.querySelector('img');

        // Set the preview image source
        previewImgElement.src = img.src;
        previewImgElement.alt = img.alt;

        // Calculate position and size for 30% expansion
        updatePreviewPosition(item, previewImg, collageContainer);

        // Show preview
        previewImg.classList.add('active');
        item.classList.add('expanding');
    }

    // Handle mouse leave
    function handleItemLeave(e) {
        const item = e.currentTarget;
        const collageContainer = item.closest('.product-collage');
        const hoverPreview = collageContainer.querySelector('.collage-hover-preview');
        const previewImg = hoverPreview.querySelector('.preview-image');

        // Hide preview
        previewImg.classList.remove('active');
        item.classList.remove('expanding');
    }

    // Calculate and update preview position
    function updatePreviewPosition(item, previewImg, collageContainer) {
        const collageRect = collageContainer.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        // Calculate item position relative to collage
        const itemLeft = itemRect.left - collageRect.left;
        const itemTop = itemRect.top - collageRect.top;
        const itemWidth = itemRect.width;
        const itemHeight = itemRect.height;

        // Calculate expanded size (30% larger)
        const expansionFactor = 1.3;
        const expandedWidth = itemWidth * expansionFactor;
        const expandedHeight = itemHeight * expansionFactor;

        // Calculate centered position
        let previewLeft = itemLeft - (expandedWidth - itemWidth) / 2;
        let previewTop = itemTop - (expandedHeight - itemHeight) / 2;

        // Constrain within collage bounds
        const collageWidth = collageRect.width;
        const collageHeight = collageRect.height;

        // Ensure preview stays within horizontal bounds
        if (previewLeft < 0) {
            previewLeft = 0;
        } else if (previewLeft + expandedWidth > collageWidth) {
            previewLeft = collageWidth - expandedWidth;
        }

        // Ensure preview stays within vertical bounds
        if (previewTop < 0) {
            previewTop = 0;
        } else if (previewTop + expandedHeight > collageHeight) {
            previewTop = collageHeight - expandedHeight;
        }

        // Apply position and size
        previewImg.style.left = `${previewLeft}px`;
        previewImg.style.top = `${previewTop}px`;
        previewImg.style.width = `${expandedWidth}px`;
        previewImg.style.height = `${expandedHeight}px`;
    }

    // Public method to add/update collage configuration
    window.setProductCollageConfig = function(collageId, config) {
        window.productCollageConfigs[collageId] = config;

        // Reinitialize if collage already exists
        const container = document.querySelector(`[data-collage-id="${collageId}"]`);
        if (container) {
            buildCollage(container, config);
        }
    };

    // Public method to update a specific collage
    window.updateProductCollage = function(collageId) {
        const container = document.querySelector(`[data-collage-id="${collageId}"]`);
        const config = window.productCollageConfigs[collageId];

        if (container && config) {
            buildCollage(container, config);
        }
    };

    // Section reveal animation using Intersection Observer
    function setupRevealAnimations() {
        const sections = document.querySelectorAll('.product-collage-section');

        if (!('IntersectionObserver' in window)) {
            // Fallback: show all sections immediately
            sections.forEach(section => section.classList.add('revealed'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '-50px 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initProductCollages();
            setupRevealAnimations();
        });
    } else {
        initProductCollages();
        setupRevealAnimations();
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Hide any active preview on resize
            const previews = document.querySelectorAll('.product-collage .preview-image.active');
            previews.forEach(p => p.classList.remove('active'));
        }, 200);
    });

})();