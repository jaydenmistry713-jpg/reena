// ========================================
// VIDEO GALLERY FUNCTIONALITY
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initVideoGallery();
    initPhotoGallery();
});

// ========================================
// VIDEO AUTOPLAY & CONTROLS
// ========================================

function initVideoGallery() {
    const videos = document.querySelectorAll('.vertical-video');
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    
    // Set up Intersection Observer for autoplay
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('.vertical-video');
            
            if (entry.isIntersecting) {
                video.play().catch(error => {
                    console.log('Autoplay prevented:', error);
                });
            } else {
                video.pause();
            }
        });
    }, observerOptions);
    
    // Observe all video wrappers
    videoWrappers.forEach(wrapper => {
        videoObserver.observe(wrapper);
    });
    
    // Add sound toggle functionality
    const soundToggles = document.querySelectorAll('.video-sound-toggle');
    
    soundToggles.forEach((toggle, index) => {
        const video = videos[index];
        // icons are swapped by the .is-unmuted class (see main.css)
        
        toggle.addEventListener('click', () => {
            if (video.muted) {
                // Unmute this video
                video.muted = false;
                toggle.classList.add('is-unmuted');
                
                // Mute all other videos
                videos.forEach((otherVideo, otherIndex) => {
                    if (otherIndex !== index) {
                        otherVideo.muted = true;
                        soundToggles[otherIndex].classList.remove('is-unmuted');
                    }
                });
            } else {
                // Mute this video
                video.muted = true;
                toggle.classList.remove('is-unmuted');
            }
        });
    });
    
    // Handle video click to toggle play/pause
    videos.forEach((video, index) => {
        video.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
    });
    
    // Add loading indicators
    videos.forEach((video) => {
        const wrapper = video.closest('.video-wrapper');
        
        video.addEventListener('loadstart', () => {
            wrapper.classList.add('loading');
        });
        
        video.addEventListener('canplay', () => {
            wrapper.classList.remove('loading');
        });
        
        video.addEventListener('error', () => {
            wrapper.classList.add('error');
            console.error('Video failed to load:', video.src);
        });
    });
}

// ========================================
// PHOTO GALLERY LIGHTBOX (Optional)
// ========================================

function initPhotoGallery() {
    const photoItems = document.querySelectorAll('.photo-item');
    
    photoItems.forEach((item, index) => {
        const img = item.querySelector('img');
        
        // Add click handler for potential lightbox
        item.addEventListener('click', () => {
            openLightbox(img.src, index);
        });
        
        // Add keyboard navigation
        item.setAttribute('tabindex', '0');
        item.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(img.src, index);
            }
        });
    });
}

// ========================================
// LIGHTBOX FUNCTIONALITY
// ========================================

function openLightbox(imageSrc, index) {
    // Create lightbox if it doesn't exist
    let lightbox = document.getElementById('lightbox');
    
    if (!lightbox) {
        lightbox = createLightbox();
    }
    
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Store current index for navigation
    lightbox.dataset.currentIndex = index;
}

function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
            <button class="lightbox-prev" aria-label="Previous image">&#10094;</button>
            <img src="" alt="" class="lightbox-image">
            <button class="lightbox-next" aria-label="Next image">&#10095;</button>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 9999;
            align-items: center;
            justify-content: center;
        }
        
        .lightbox.active {
            display: flex;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .lightbox-image {
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
            border-radius: 8px;
        }
        
        .lightbox-close {
            position: absolute;
            top: -50px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 40px;
            cursor: pointer;
            padding: 10px;
            line-height: 1;
            transition: opacity 0.3s ease;
        }
        
        .lightbox-close:hover {
            opacity: 0.7;
        }
        
        .lightbox-prev,
        .lightbox-next {
            position: absolute;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            font-size: 30px;
            padding: 20px;
            cursor: pointer;
            transition: background 0.3s ease;
            border-radius: 4px;
        }
        
        .lightbox-prev:hover,
        .lightbox-next:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .lightbox-prev {
            left: 20px;
        }
        
        .lightbox-next {
            right: 20px;
        }
        
        @media (max-width: 768px) {
            .lightbox-prev,
            .lightbox-next {
                font-size: 20px;
                padding: 15px;
            }
            
            .lightbox-close {
                font-size: 30px;
                top: -40px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add event listeners
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        }
    });
    
    return lightbox;
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    const lightbox = document.getElementById('lightbox');
    const photoItems = document.querySelectorAll('.photo-item img');
    let currentIndex = parseInt(lightbox.dataset.currentIndex);
    
    currentIndex += direction;
    
    // Wrap around
    if (currentIndex < 0) {
        currentIndex = photoItems.length - 1;
    } else if (currentIndex >= photoItems.length) {
        currentIndex = 0;
    }
    
    const newImg = photoItems[currentIndex];
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    lightboxImg.src = newImg.src;
    lightbox.dataset.currentIndex = currentIndex;
}

// ========================================
// LAZY LOADING OPTIMIZATION
// ========================================

// Add fade-in animation for lazy loaded images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '1';
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('.photo-item img[loading="lazy"]').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    imageObserver.observe(img);
});

// ========================================
// PERFORMANCE MONITORING
// ========================================

console.log('Gallery initialized successfully');
console.log(`Videos: ${document.querySelectorAll('.vertical-video').length}`);
console.log(`Photos: ${document.querySelectorAll('.photo-item').length}`);