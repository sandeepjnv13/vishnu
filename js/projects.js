// Projects Page JavaScript
// Handles category filtering and horizontal image gallery navigation

(function() {
    'use strict';

    // Only run on projects page
    if (!document.body.classList.contains('projects-page')) return;

    // ============================================
    // CATEGORY FILTERING
    // ============================================

    const categoryButtons = document.querySelectorAll('.category-btn');
    const projectCategories = document.querySelectorAll('.project-category');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetCategory = this.dataset.category;

            // Update active button state
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Show/hide appropriate category
            projectCategories.forEach(category => {
                if (category.dataset.category === targetCategory) {
                    category.classList.remove('hidden');

                    // Smooth scroll to the category
                    setTimeout(() => {
                        category.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 100);
                } else {
                    category.classList.add('hidden');
                }
            });

            // Reset all galleries in the new category to first image
            const galleries = document.querySelectorAll(`[data-category="${targetCategory}"] .project-gallery`);
            galleries.forEach(gallery => {
                const track = gallery.querySelector('.gallery-track');
                if (track) {
                    track.style.transform = 'translateX(0)';
                    track.dataset.currentIndex = '0';
                    updateNavigationButtons(gallery);
                }
            });
        });
    });

    // ============================================
    // HORIZONTAL GALLERY NAVIGATION
    // ============================================

    // Initialize all galleries
    const galleries = document.querySelectorAll('.project-gallery');

    galleries.forEach(gallery => {
        initializeGallery(gallery);
    });

    function initializeGallery(gallery) {
        const track = gallery.querySelector('.gallery-track');
        const images = track.querySelectorAll('img');
        const wrapper = gallery.closest('.project-gallery-wrapper');
        const prevBtn = wrapper.querySelector('.gallery-nav-btn.prev');
        const nextBtn = wrapper.querySelector('.gallery-nav-btn.next');

        if (!track || images.length === 0) return;

        // Set initial state
        track.dataset.currentIndex = '0';
        track.dataset.totalImages = images.length.toString();

        // Calculate how many images are visible at once
        const updateVisibleCount = () => {
            const galleryWidth = gallery.offsetWidth;
            const imageWidth = images[0].offsetWidth;
            const gap = 15; // Must match CSS gap
            return Math.floor(galleryWidth / (imageWidth + gap));
        };

        track.dataset.visibleCount = updateVisibleCount().toString();

        // Update on resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                track.dataset.visibleCount = updateVisibleCount().toString();
                updateNavigationButtons(gallery);
            }, 200);
        });

        // Navigation button handlers
        if (prevBtn) {
            prevBtn.addEventListener('click', () => navigateGallery(gallery, -1));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => navigateGallery(gallery, 1));
        }

        // Optional: Click image to view full size
        images.forEach(img => {
            img.addEventListener('click', () => {
                openImageModal(img.src, img.alt);
            });
        });

        // Initial button state
        updateNavigationButtons(gallery);
    }

    function navigateGallery(gallery, direction) {
        const track = gallery.querySelector('.gallery-track');
        const images = track.querySelectorAll('img');

        let currentIndex = parseInt(track.dataset.currentIndex) || 0;
        const visibleCount = parseInt(track.dataset.visibleCount) || 3;
        const totalImages = images.length;

        // Calculate new index
        currentIndex += direction;

        // Clamp to valid range
        const maxIndex = Math.max(0, totalImages - visibleCount);
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

        // Update position
        track.dataset.currentIndex = currentIndex.toString();

        // Calculate transform
        const imageWidth = images[0].offsetWidth;
        const gap = 15; // Must match CSS gap
        const moveDistance = (imageWidth + gap) * currentIndex;

        track.style.transform = `translateX(-${moveDistance}px)`;

        // Update button states
        updateNavigationButtons(gallery);
    }

    function updateNavigationButtons(gallery) {
        const track = gallery.querySelector('.gallery-track');
        const wrapper = gallery.closest('.project-gallery-wrapper');
        const prevBtn = wrapper.querySelector('.gallery-nav-btn.prev');
        const nextBtn = wrapper.querySelector('.gallery-nav-btn.next');

        if (!track) return;

        const currentIndex = parseInt(track.dataset.currentIndex) || 0;
        const totalImages = parseInt(track.dataset.totalImages) || 0;
        const visibleCount = parseInt(track.dataset.visibleCount) || 3;

        // Disable/enable buttons based on position
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
        }

        if (nextBtn) {
            const maxIndex = Math.max(0, totalImages - visibleCount);
            nextBtn.disabled = currentIndex >= maxIndex;
        }
    }

    // ============================================
    // IMAGE MODAL (Optional Enhancement)
    // ============================================

    function openImageModal(src, alt) {
        // Check if modal exists, create if not
        let modal = document.querySelector('.image-modal');

        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'image-modal';
            modal.innerHTML = `
                <button class="modal-close" aria-label="Close modal">×</button>
                <img src="" alt="">
            `;
            document.body.appendChild(modal);

            // Close modal on click outside image or on close button
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.classList.contains('modal-close')) {
                    closeImageModal();
                }
            });

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    closeImageModal();
                }
            });
        }

        const img = modal.querySelector('img');
        img.src = src;
        img.alt = alt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeImageModal() {
        const modal = document.querySelector('.image-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================

    document.addEventListener('keydown', (e) => {
        // Only handle if not in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const activeCategory = document.querySelector('.project-category:not(.hidden)');
        if (!activeCategory) return;

        const galleries = activeCategory.querySelectorAll('.project-gallery');

        // Arrow keys for first visible gallery
        if (galleries.length > 0 && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            e.preventDefault();
            const direction = e.key === 'ArrowLeft' ? -1 : 1;
            navigateGallery(galleries[0], direction);
        }
    });

    // ============================================
    // SMOOTH SCROLL TO PROJECTS
    // ============================================

    // If there's a hash in URL, scroll to that category
    const hash = window.location.hash.substring(1);
    if (hash) {
        const matchingBtn = document.querySelector(`[data-category="${hash}"]`);
        if (matchingBtn) {
            setTimeout(() => {
                matchingBtn.click();
            }, 300);
        }
    }

    // ============================================
    // TOUCH SWIPE SUPPORT (Mobile)
    // ============================================

    galleries.forEach(gallery => {
        const track = gallery.querySelector('.gallery-track');
        let touchStartX = 0;
        let touchEndX = 0;

        gallery.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        gallery.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                const direction = diff > 0 ? 1 : -1;
                navigateGallery(gallery, direction);
            }
        }
    });

    // ============================================
    // AUTO-SCROLL BETWEEN PROJECTS (Optional)
    // ============================================

    // You can add auto-advance functionality here if needed
    // For example, automatically scroll to next project after viewing all images

    console.log('✓ Projects page initialized with', galleries.length, 'galleries');

})();