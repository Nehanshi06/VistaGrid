const filterContainer = document.querySelector('.gallery-filter');
const galleryItems = document.querySelectorAll('.gallery-item');
const filterItems = document.querySelectorAll('.filter-item');

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

const allImages = Array.from(document.querySelectorAll('.gallery-item-inner img'));

let currentFilter = 'all';
let currentImages = [];
let currentIndex = 0;
let zoomScale = 1;

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function applyShuffle(filterValue) {
    currentFilter = filterValue;

    const itemsToShow = Array.from(galleryItems).filter(item => {
        return filterValue === 'all' || item.classList.contains(filterValue);
    });

    const shuffled = shuffleArray(itemsToShow);

    galleryItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
            item.classList.remove('hide');
            item.classList.add('show');
        } else {
            item.classList.remove('show');
            item.classList.add('hide');
        }
        item.style.order = '';
    });

    shuffled.forEach((item, index) => {
        item.style.order = index;
    });

    currentImages = shuffled.map(item => item.querySelector('img'));
}

applyShuffle('all');

filterContainer.addEventListener('click', (event) => {
    if (event.target.closest('.filter-item')) {
        const filterItem = event.target.closest('.filter-item');

        filterItems.forEach(item => item.classList.remove('active'));
        filterItem.classList.add('active');

        const filterValue = filterItem.getAttribute('data-filter');
        applyShuffle(filterValue);
    }
});

document.querySelectorAll('.gallery-item-inner').forEach((item) => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const visibleImgs = currentImages.length ? currentImages : allImages;
        currentIndex = visibleImgs.findIndex(image => image === img);
        if (currentIndex === -1) currentIndex = 0;
        zoomScale = 1;
        showLightbox();
    });
});

function showLightbox() {
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
    updateLightboxImage();
}

function updateLightboxImage() {
    const img = currentImages[currentIndex];
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxImg.style.transform = `scale(${zoomScale})`;
}

function closeLightbox() {
    lightbox.classList.remove('show');
    document.body.style.overflow = 'auto';
    zoomScale = 1;
    lightboxImg.style.transform = 'scale(1)';
}

function nextImage() {
    if (!currentImages.length) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    zoomScale = 1;
    updateLightboxImage();
}

function prevImage() {
    if (!currentImages.length) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    zoomScale = 1;
    updateLightboxImage();
}

nextBtn.addEventListener('click', nextImage);
prevBtn.addEventListener('click', prevImage);

closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('show')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === '+' || e.key === '=') {
            zoomScale = Math.min(zoomScale + 0.1, 3);
            lightboxImg.style.transform = `scale(${zoomScale})`;
        }
        if (e.key === '-' || e.key === '_') {
            zoomScale = Math.max(zoomScale - 0.1, 0.5);
            lightboxImg.style.transform = `scale(${zoomScale})`;
        }
    }
});

lightboxImg.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
        zoomScale = Math.min(zoomScale + 0.1, 3);
    } else {
        zoomScale = Math.max(zoomScale - 0.1, 0.5);
    }
    lightboxImg.style.transform = `scale(${zoomScale})`;
}, { passive: false });