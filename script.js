// Filter functionality
const filterContainer = document.querySelector('.gallery-filter');
const galleryItems = document.querySelectorAll('.gallery-item');
const filterItems = document.querySelectorAll('.filter-item');

// Lightbox elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentIndex = 0;
const images = document.querySelectorAll('.gallery-item-inner img');

// Filter Logic
filterContainer.addEventListener('click', (event) => {
    if (event.target.closest('.filter-item')) {
        const filterItem = event.target.closest('.filter-item');
        
        // Remove active class from all filter items
        filterItems.forEach(item => item.classList.remove('active'));
        filterItem.classList.add('active');
        
        const filterValue = filterItem.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            if (item.classList.contains(filterValue) || filterValue === 'all') {
                item.classList.remove('hide');
                item.classList.add('show');
            } else {
                item.classList.remove('show');
                item.classList.add('hide');
            }
        });
    }
});

// Lightbox functionality
document.querySelectorAll('.gallery-item-inner').forEach((item, index) => {
    item.addEventListener('click', () => {
        currentIndex = parseInt(item.querySelector('img').getAttribute('data-index'));
        showLightbox();
    });
});

function showLightbox() {
    lightbox.classList.add('show');
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Navigation
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
});

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
});

// Close lightbox
closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('show')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === 'ArrowLeft') prevBtn.click();
    }
});

// Smooth transitions for gallery items
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = Math.random() * 0.2 + 's';
            entry.target.classList.add('show');
        }
    });
});

galleryItems.forEach(item => observer.observe(item));