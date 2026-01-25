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
                    src: 'resources/Office_1_1.Reception.jpeg',
                    alt: 'Office interior design project'
                },
                {
                    src: 'resources/Office_1_2.Workspac.jpeg',
                    alt: 'Office workspace design'
                },
                {
                    src: 'resources/Office_1_3.ConferenceRoomView.jpeg',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_1_3.ConferenceRoomView2.jpeg',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_1_4.Meetingroom.jpeg',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_1_4.Meetingroom (1).jpeg',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_1_4.Meetingroom (2).jpeg',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_1_4.Meetingroom2.jpeg',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_1_5.PhBooth.jpeg',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_1_5.PhBooth2.jpeg',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_1_6.Cafeteriaview.jpeg',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_1_6.Cafeteriaview2.jpeg',
                    alt: 'Office meeting area'
                }

            ]
        },
        'office-gallery-2': {
            caption: 'Modern office space with collaborative workstations and natural lighting',
            images: [
                {
                    src: 'resources/Office_2_wmremove-transformed.jpeg',
                    alt: 'Office interior design project'
                },
                {
                    src: 'resources/Office_2_wmremove-transformed (1).jpeg',
                    alt: 'Office workspace design'
                },
                {
                    src: 'resources/Office_2_wmremove-transformed (2).jpeg',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_2_wmremove-transformed (3).jpeg',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_2_wmremove-transformed (4).jpeg',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_2_wmremove-transformed (5).jpeg',
                    alt: 'Office meeting area'
                }
            ]
        },
        'office-gallery-3': {
            caption: 'Modern office space with collaborative workstations and natural lighting',
            images: [

                {
                    src: 'resources/Office_3_EXE LOUNGE 02.jpg',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_3_COLAB ROOM 02.jpg',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_3_COLAB ROOM 03.jpg',
                    alt: 'Office interior design project'
                },
                {
                    src: 'resources/Office_3_CONGF ROOM 01.jpg',
                    alt: 'Office workspace design'
                },
                {
                    src: 'resources/Office_3_EX CABIN 01.jpg',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_3_EXE OFC 05.jpg',
                    alt: 'Office interior design project'
                },
                {
                    src: 'resources/Office_3_EXE OFC 071.jpg',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_3_PODCAST ROOM 01.jpg',
                    alt: 'Office meeting area'
                }
                {
                    src: 'resources/Office_3_KITCHEN 1.jpg',
                    alt: 'Office meeting area'
                },
                {
                    src: 'resources/Office_3_KITCHEN 01.jpg',
                    alt: 'Office interior design project'
                },
                {
                    src: 'resources/Office_3_LOUNGE-2.jpg',
                    alt: 'Office workspace design'
                },
            ]
        },
        'restaurant-gallery-1': {
            caption: 'Elegant dining space with contemporary design and ambient atmosphere',
            images: [
                {
                    src: 'resources/Restaurant_01.jpeg',
                    alt: 'Restaurant interior design project'
                },
                {
                    src: 'resources/Image3.jpg',
                    alt: 'Restaurant seating area'
                }
            ]
        },
        'restaurant-gallery-2': {
            caption: 'Elegant dining space with contemporary design and ambient atmosphere',
            images: [
                {
                    src: 'resources/Restaurant_01.jpeg',
                    alt: 'Restaurant interior design project'
                },
                {
                    src: 'resources/Image3.jpg',
                    alt: 'Restaurant seating area'
                }
            ]
        },
        'restaurant-gallery-3': {
            caption: 'Elegant dining space with contemporary design and ambient atmosphere',
            images: [
                {
                    src: 'resources/Restaurant_01.jpeg',
                    alt: 'Restaurant interior design project'
                },
                {
                    src: 'resources/Image3.jpg',
                    alt: 'Restaurant seating area'
                }
            ]
        },
        'restaurant-gallery-4': {
                    caption: 'Elegant dining space with contemporary design and ambient atmosphere',
                    images: [
                        {
                            src: 'resources/Restaurant_01.jpeg',
                            alt: 'Restaurant interior design project'
                        },
                        {
                            src: 'resources/Image3.jpg',
                            alt: 'Restaurant seating area'
                        }
                    ]
                },

        'restaurant-gallery-5': {
                    caption: 'Elegant dining space with contemporary design and ambient atmosphere',
                    images: [
                        {
                            src: 'resources/Restaurant_01.jpeg',
                            alt: 'Restaurant interior design project'
                        },
                        {
                            src: 'resources/Image3.jpg',
                            alt: 'Restaurant seating area'
                        }
                    ]
                },
        'retail-gallery-1': {
            caption: 'Inviting retail environment optimized for customer experience and product display',
            images: [
                {
                    src: 'resources/RetailSection_01.jpeg',
                    alt: 'Retail interior design project'
                },
                {
                    src: 'resources/Image1.jpg',
                    alt: 'Retail showcase'
                },
                {
                    src: 'resources/Image2.jpg',
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
        'restaurant-gallery': 0,
        'retail-gallery-1': 0
    };

    // Track if images are being animated
    const isAnimating = {
        'office-gallery-1': false,
        'office-gallery-2': false,
        'office-gallery-3': false,
        'restaurant-gallery': false,
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
        // Preload all images first
        preloadImages();

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