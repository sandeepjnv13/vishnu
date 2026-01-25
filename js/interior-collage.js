// Interior Design Collage Script
// Handles grayscale to color transition and 30% expansion on hover

(function() {
    'use strict';

    // Only run on interior design page
    if (!document.getElementById('interior-design')) return;

    // Collage configuration - define rows and images
    // You can customize this array to change images
    // Each row is an array of image objects with src, alt, and optional flex value
    // Flex values control relative widths within a row (default is 1)
    //
    // TO CUSTOMIZE: Update the images below with your actual image paths
    // The flex values help images fit together without gaps
    // Higher flex = wider image, lower flex = narrower image

    const collageConfig = [
        // Row 1: 4 images (from reference: office, pink salon, restaurant, retail)
        {
            height: 'medium', // 'short', 'medium', 'tall'
            images: [
                { src: 'resources/Office_1_2.Workspac.jpeg', alt: 'Modern Office Space', flex: 1 },
                { src: 'resources/Retail_2 (5).jpeg', alt: 'Salon Interior', flex: 1 },
                { src: 'resources/Restaurant_7 (3).jpeg', alt: 'Restaurant Design', flex: 1 },
                { src: 'resources/Retail_1 (2).jpeg', alt: 'Retail Store', flex: 1 }
            ]
        },
        // Row 2: 2 larger images (industrial office, upscale restaurant)
        {
            height: 'tall',
            images: [
                { src: 'resources/Office_2_wmremove-transformed (3).jpeg', alt: 'Industrial Office', flex: 1 },
                { src: 'resources/Restaurant_8 (2).jpeg', alt: 'Upscale Restaurant', flex: 1 }
            ]
        },
        // Row 3: 4 images (restaurant lounge, conference room, cafe, bar)
        {
            height: 'medium',
            images: [
                { src: 'resources/Restaurant _1 (6).jpeg', alt: 'Restaurant Lounge', flex: 1 },
                { src: 'resources/Office_3_COLAB ROOM 03.jpg', alt: 'Conference Room', flex: 1 },
                { src: 'resources/Restaurant_3 (1).jpg', alt: 'Evening Cafe', flex: 1 },
                { src: 'resources/Restaurant_5 (2).jpg', alt: 'Bar Interior', flex: 1 }
            ]
        }
    ];

    // Initialize the collage
    function initCollage() {
        const horizontalMainImage = document.querySelector('.horizontal-main-image');
        if (!horizontalMainImage) return;

        // Clear existing content
        horizontalMainImage.innerHTML = '';

        // Create collage container
        const collage = document.createElement('div');
        collage.className = 'interior-collage';

        // Create hover preview container (for expanded image)
        const hoverPreview = document.createElement('div');
        hoverPreview.className = 'collage-hover-preview';

        const previewImg = document.createElement('div');
        previewImg.className = 'preview-image';
        previewImg.innerHTML = '<img src="" alt="Preview">';
        hoverPreview.appendChild(previewImg);

        // Build the collage rows
        collageConfig.forEach((rowConfig, rowIndex) => {
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
                item.addEventListener('mousemove', handleItemMove);
            });

            collage.appendChild(row);
        });

        collage.appendChild(hoverPreview);
        horizontalMainImage.appendChild(collage);

        // Store reference for event handlers
        horizontalMainImage._collage = collage;
        horizontalMainImage._hoverPreview = hoverPreview;
        horizontalMainImage._previewImg = previewImg;
    }

    // Handle hover on collage item
    function handleItemHover(e) {
        const item = e.currentTarget;
        const img = item.querySelector('img');
        const collageContainer = item.closest('.interior-collage');
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
        const collageContainer = item.closest('.interior-collage');
        const hoverPreview = collageContainer.querySelector('.collage-hover-preview');
        const previewImg = hoverPreview.querySelector('.preview-image');

        // Hide preview
        previewImg.classList.remove('active');
        item.classList.remove('expanding');
    }

    // Handle mouse move (optional: follow cursor slightly)
    function handleItemMove(e) {
        // Could add subtle movement following cursor if desired
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

    // Public method to update collage configuration
    window.updateCollageConfig = function(newConfig) {
        if (Array.isArray(newConfig)) {
            collageConfig.length = 0;
            newConfig.forEach(row => collageConfig.push(row));
            initCollage();
        }
    };

    // Public method to set images for a specific row
    window.setCollageRow = function(rowIndex, images, height) {
        if (rowIndex >= 0 && rowIndex < collageConfig.length) {
            collageConfig[rowIndex] = {
                height: height || collageConfig[rowIndex].height,
                images: images
            };
            initCollage();
        } else if (rowIndex === collageConfig.length) {
            collageConfig.push({
                height: height || 'medium',
                images: images
            });
            initCollage();
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCollage);
    } else {
        initCollage();
    }

    // Re-initialize on window resize to recalculate positions
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Just hide any active preview on resize
            const previews = document.querySelectorAll('.preview-image.active');
            previews.forEach(p => p.classList.remove('active'));
        }, 200);
    });

})();