// Interior Design Gallery Script - Multiple Blocks Version
// All gallery blocks visible simultaneously with independent carousels
// Captions remain fixed per block (don't change when navigating)

(function() {
    'use strict';

    // Check if we're on the interior design page
    if (!document.body.classList.contains('our-services-page')) return;
    if (!document.getElementById('interior-design')) return;

    // Gallery data structure with fixed captions per block
    const galleryData = {
        'office-gallery-1': {
            caption: 'Modern office space with collaborative workstations and natural lighting',
            images: [
                {
                    src: 'resources/Office_1_1.Reception.webp',
                    alt: 'Office interior design project'
                },
                {
                    src: 'resources/Office_1_2.Workspac.webp',
                    alt: 'Office workspace design'
                },
                {
                    src: 'resources/Office_1_3.ConferenceRoomView.webp',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_1_3.ConferenceRoomView2.webp',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_1_4.Meetingroom.webp',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_1_4.Meetingroom_(1).webp',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_1_4.Meetingroom_(2).webp',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_1_4.Meetingroom2.webp',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_1_5.PhBooth.webp',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_1_5.PhBooth2.webp',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_1_6.Cafeteriaview.webp',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_1_6.Cafeteriaview2.webp',
                    alt: 'Office meeting area'
                }

            ]
        },
        'office-gallery-2': {
            caption: 'Modern office space with collaborative workstations and natural lighting',
            images: [
                {
                    src: 'resources/Office_2_wmremove-transformed.webp',
                    alt: 'Office interior design project'
                },
                {
                    src: 'resources/Office_2_wmremove-transformed_(1).webp',
                    alt: 'Office workspace design'
                },
                {
                    src: 'resources/Office_2_wmremove-transformed_(2).webp',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_2_wmremove-transformed_(3).webp',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_2_wmremove-transformed_(4).webp',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_2_wmremove-transformed_(5).webp',
                    alt: 'Office meeting area'
                }
            ]
        },
        'office-gallery-3': {
            caption: 'Modern office space with collaborative workstations and natural lighting',
            images: [

                {
                    src: 'resources/Office_3_EXE_LOUNGE_02.webp',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_3_COLAB_ROOM_02.webp',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_3_COLAB_ROOM_03.webp',
                    alt: 'Office interior design project'
                },
                {
                    src: 'resources/Office_3_CONGF_ROOM_01.webp',
                    alt: 'Office workspace design'
                },
                {
                    src: 'resources/Office_3_EX_CABIN_01.webp',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_3_EXE_OFC_05.webp',
                    alt: 'Office interior design project'
                },
                {
                    src: 'resources/Office_3_EXE_OFC_071.webp',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_3_PODCAST_ROOM_01.webp',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_3_KITCHEN_1.webp',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_3_KITCHEN_01.webp',
                    alt: 'Office interior design project'
                },
                {
                    src: 'resources/Office_3_LOUNGE-2.webp',
                    alt: 'Office workspace design'
                },
            ]
        },
        'restaurant-gallery-1': {
            caption: 'Elegant dining space with contemporary design and ambient atmosphere',
            images: [
                {
                    src: 'resources/Restaurant__1_(1).webp',
                    alt: 'Restaurant interior design project'
                },
                {
                    src: 'resources/Restaurant__1_(2).webp',
                    alt: 'Restaurant seating area'
                },
                {
                    src: 'resources/Restaurant__1_(3).webp',
                    alt: 'Restaurant interior design project'
                },
                {
                    src: 'resources/Restaurant__1_(4).webp',
                    alt: 'Restaurant seating area'
                },
                {
                    src: 'resources/Restaurant__1_(5).webp',
                    alt: 'Restaurant interior design project'
                },
                {
                    src: 'resources/Restaurant__1_(6).webp',
                    alt: 'Restaurant seating area'
                },
                {
                    src: 'resources/Restaurant__1_(7).webp',
                    alt: 'Restaurant interior design project'
                },
                {
                    src: 'resources/Restaurant__1_(8).webp',
                    alt: 'Restaurant seating area'
                }
            ]
        },
        'restaurant-gallery-2': {
            caption: 'Elegant dining space with contemporary design and ambient atmosphere',
            images: [
              {
                  src: 'resources/Restaurant_3_(1).webp',
                  alt: 'Restaurant interior design project'
              },
              {
                  src: 'resources/Restaurant_3_(2).webp',
                  alt: 'Restaurant seating area'
              },
              {
                  src: 'resources/Restaurant_3_(3).webp',
                  alt: 'Restaurant interior design project'
              },
              {
                  src: 'resources/Restaurant_3_(4).webp',
                  alt: 'Restaurant seating area'
              },
              {
                  src: 'resources/Restaurant_3_(5).webp',
                  alt: 'Restaurant interior design project'
              }
            ]
        },
        'restaurant-gallery-3': {
            caption: 'Elegant dining space with contemporary design and ambient atmosphere',
            images: [
                {
                    src: 'resources/Restaurant_5_(1).webp',
                    alt: 'Restaurant interior design project'
                },
                {
                    src: 'resources/Restaurant_5_(2).webp',
                    alt: 'Restaurant seating area'
                },
                {
                    src: 'resources/Restaurant_5_(3).webp',
                    alt: 'Restaurant interior design project'
                },
                {
                    src: 'resources/Restaurant_5_(4).webp',
                    alt: 'Restaurant seating area'
                },
                {
                    src: 'resources/Restaurant_5_(5).webp',
                    alt: 'Restaurant interior design project'
                },
                {
                    src: 'resources/Restaurant_5_(6).webp',
                    alt: 'Restaurant seating area'
                },
                {
                    src: 'resources/Restaurant_5_(7).webp',
                    alt: 'Restaurant interior design project'
                },
                {
                    src: 'resources/Restaurant_5_(8).webp',
                    alt: 'Restaurant seating area'
                }
            ]
        },
        'restaurant-gallery-4': {
                    caption: 'Elegant dining space with contemporary design and ambient atmosphere',
                    images: [
                        {
                            src: 'resources/Restaurant_7_(1).webp',
                            alt: 'Restaurant interior design project'
                        },
                        {
                            src: 'resources/Restaurant_7_(2).webp',
                            alt: 'Restaurant seating area'
                        },
                        {
                            src: 'resources/Restaurant_7_(3).webp',
                            alt: 'Restaurant interior design project'
                        },
                        {
                            src: 'resources/Restaurant_7_(4).webp',
                            alt: 'Restaurant seating area'
                        },
                        {
                            src: 'resources/Restaurant_7_(5).webp',
                            alt: 'Restaurant interior design project'
                        },
                        {
                            src: 'resources/Restaurant_7_(6).webp',
                            alt: 'Restaurant seating area'
                        }
                    ]
                },

        'restaurant-gallery-5': {
                    caption: 'Elegant dining space with contemporary design and ambient atmosphere',
                    images: [
                        {
                            src: 'resources/Restaurant_8_(1).webp',
                            alt: 'Restaurant interior design project'
                        },
                        {
                            src: 'resources/Restaurant_8_(2).webp',
                            alt: 'Restaurant seating area'
                        },
                        {
                            src: 'resources/Restaurant_8_(3).webp',
                            alt: 'Restaurant interior design project'
                        },
                        {
                            src: 'resources/Restaurant_8_(4).webp',
                            alt: 'Restaurant seating area'
                        },
                        {
                            src: 'resources/Restaurant_8_(5).webp',
                            alt: 'Restaurant interior design project'
                        },
                        {
                            src: 'resources/Restaurant_8_(6).webp',
                            alt: 'Restaurant seating area'
                        }
                    ]
                },
        'retail-gallery-1': {
            caption: 'Inviting retail environment optimized for customer experience and product display',
            images: [
                {
                    src: 'resources/Retail_1_(1).webp',
                    alt: 'Retail interior design project'
                },
                {
                    src: 'resources/Retail_1_(2).webp',
                    alt: 'Retail showcase'
                },
                {
                    src: 'resources/Retail_1_(3).webp',
                    alt: 'Retail interior'
                },
                {
                    src: 'resources/Retail_1_(4).webp',
                    alt: 'Retail interior'
                },
                {
                    src: 'resources/Retail_1_(5).webp',
                    alt: 'Retail interior'
                }
            ]
        }
    };

    // Current image indices for each gallery
    const currentIndices = {
        'office-gallery-1': 0,
        'office-gallery-2': 0,
        'office-gallery-3': 0,
        'restaurant-gallery-1': 0,
        'restaurant-gallery-2': 0,
        'restaurant-gallery-3': 0,
        'restaurant-gallery-4': 0,
        'restaurant-gallery-5': 0,
        'retail-gallery-1': 0
    };

    // Track if images are being animated
    const isAnimating = {
        'office-gallery-1': false,
        'office-gallery-2': false,
        'office-gallery-3': false,
        'restaurant-gallery-1': false,
        'restaurant-gallery-2': false,
        'restaurant-gallery-3': false,
        'restaurant-gallery-4': false,
        'restaurant-gallery-5': false,
        'retail-gallery-1': false
    };

    // Preload all images
    function preloadImages() {
        const imagesToPreload = [];

        // Collect all image sources
        Object.values(galleryData).forEach(gallery => {
            gallery.images.forEach(imageData => {
                if (!imagesToPreload.includes(imageData.src)) {
                    imagesToPreload.push(imageData.src);
                }
            });
        });

        // Preload each image
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.src = src;
        });

        console.log(`Preloaded ${imagesToPreload.length} images for smooth transitions`);
    }

    // Initialize gallery with all images
    function initializeGalleryImages(galleryId) {
        const section = document.getElementById(galleryId);
        if (!section) return;

        const wrapper = section.querySelector('.gallery-image-wrapper');
        if (!wrapper) return;

        const galleryInfo = galleryData[galleryId];
        if (!galleryInfo || !galleryInfo.images || galleryInfo.images.length === 0) return;

        // Clear existing content
        wrapper.innerHTML = '';

        // Create all image elements
        galleryInfo.images.forEach((imageData, index) => {
            const img = document.createElement('img');
            img.src = imageData.src;
            img.alt = imageData.alt;
            img.className = 'gallery-image';
            img.decoding = 'async';
            // eager for the visible (current) + upcoming (next) slide, lazy for the rest
            img.loading = index <= 1 ? 'eager' : 'lazy';

            if (index === 0) {
                img.classList.add('current');
            } else if (index === 1) {
                img.classList.add('next');
            } else {
                img.classList.add('preload');
            }

            wrapper.appendChild(img);
        });

        // Set FIXED caption (from gallery config, not individual images)
        const caption = section.querySelector('.gallery-caption');
        if (caption) {
            caption.textContent = galleryInfo.caption;
        }
    }

    // Initialize gallery functionality
    function initGallery() {
        // Warm the remaining images after first paint so transitions stay smooth,
        // without blocking initial page render.
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => preloadImages());
        } else {
            window.addEventListener('load', () => preloadImages());
        }

        // Get all category buttons
        const categoryButtons = document.querySelectorAll('.category-btn');

        // Category button click handler - smooth scroll to gallery block
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');

                // Update button states
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Scroll to target gallery block
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            });
        });

        // Get all gallery blocks
        const galleryBlocks = document.querySelectorAll('.project-gallery-block');

        // Initialize carousel controls for each gallery block
        galleryBlocks.forEach(section => {
            const galleryId = section.id;

            // Initialize images
            initializeGalleryImages(galleryId);

            const leftArrow = section.querySelector('.carousel-arrow-left');
            const rightArrow = section.querySelector('.carousel-arrow-right');

            if (leftArrow && rightArrow) {
                leftArrow.addEventListener('click', () => navigateGallery(galleryId, -1));
                rightArrow.addEventListener('click', () => navigateGallery(galleryId, 1));
            }

            // Update arrow states on init
            updateArrowStates(galleryId);
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboardNav);
    }

    // Navigate through gallery images
    function navigateGallery(galleryId, direction) {
        // Prevent navigation during animation
        if (isAnimating[galleryId]) return;

        const galleryInfo = galleryData[galleryId];
        if (!galleryInfo || !galleryInfo.images || galleryInfo.images.length === 0) return;

        const currentIndex = currentIndices[galleryId];
        const newIndex = currentIndex + direction;

        // Check boundaries
        if (newIndex < 0 || newIndex >= galleryInfo.images.length) return;

        // Start animation
        isAnimating[galleryId] = true;

        // Update current index
        currentIndices[galleryId] = newIndex;

        // Perform slide animation (caption stays the same)
        slideToImage(galleryId, direction, newIndex);

        // Update arrow states
        updateArrowStates(galleryId);

        // End animation after transition
        setTimeout(() => {
            isAnimating[galleryId] = false;
        }, 500);
    }

    // Slide to new image (caption doesn't change)
    function slideToImage(galleryId, direction, newIndex) {
        const section = document.getElementById(galleryId);
        if (!section) return;

        const wrapper = section.querySelector('.gallery-image-wrapper');
        if (!wrapper) return;

        const allImages = wrapper.querySelectorAll('.gallery-image');
        const currentIndex = currentIndices[galleryId] - direction; // Previous index

        const currentImg = allImages[currentIndex];
        const newImg = allImages[newIndex];

        if (!currentImg || !newImg) return;

        // Set up new image position
        if (direction > 0) {
            // Going forward - new image comes from right
            newImg.classList.remove('preload', 'prev', 'current', 'next');
            newImg.classList.add('slide-from-right');
        } else {
            // Going backward - new image comes from left
            newImg.classList.remove('preload', 'prev', 'current', 'next');
            newImg.classList.add('slide-from-left');
        }

        // Force reflow
        void newImg.offsetWidth;

        // Animate current image out and new image in
        requestAnimationFrame(() => {
            // Slide current image out
            if (direction > 0) {
                currentImg.classList.add('slide-to-left');
            } else {
                currentImg.classList.add('slide-to-right');
            }
            currentImg.classList.remove('current');

            // Slide new image in
            newImg.classList.remove('slide-from-right', 'slide-from-left');
            newImg.classList.add('current');

            // NOTE: Caption stays the same - it's fixed per block
        });

        // Clean up after animation
        setTimeout(() => {
            currentImg.classList.remove('slide-to-left', 'slide-to-right');
            if (currentIndex < newIndex) {
                currentImg.classList.add('prev');
            } else {
                currentImg.classList.add('next');
            }
        }, 500);
    }

    // Update arrow button states (disabled at boundaries)
    function updateArrowStates(galleryId) {
        const section = document.getElementById(galleryId);
        if (!section) return;

        const galleryInfo = galleryData[galleryId];
        if (!galleryInfo) return;

        const currentIndex = currentIndices[galleryId];
        const leftArrow = section.querySelector('.carousel-arrow-left');
        const rightArrow = section.querySelector('.carousel-arrow-right');

        if (leftArrow) {
            leftArrow.disabled = currentIndex === 0;
        }

        if (rightArrow) {
            rightArrow.disabled = currentIndex >= galleryInfo.images.length - 1;
        }
    }

    // Keyboard navigation handler
    function handleKeyboardNav(e) {
        // Get the gallery block that's currently in view
        const galleryBlocks = document.querySelectorAll('.project-gallery-block');
        let targetGallery = null;

        // Find which gallery is most in view
        galleryBlocks.forEach(block => {
            const rect = block.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Check if block is substantially in viewport
            if (rect.top < windowHeight * 0.6 && rect.bottom > windowHeight * 0.4) {
                targetGallery = block.id;
            }
        });

        if (!targetGallery) return;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            navigateGallery(targetGallery, -1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            navigateGallery(targetGallery, 1);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery);
    } else {
        initGallery();
    }

})();