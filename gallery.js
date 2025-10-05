
// State management
let currentCategory = 'favorites';
let currentPage = 1;
const imagesPerPage = 12;
let allImages = [];

// DOM Elements
const photoGrid = document.querySelector('.photo-grid');
const loadMoreBtn = document.getElementById('load-more');
const categoryButtons = document.querySelectorAll('.category-btn');

// Helper function to parse date from filename
function getDateFromFilename(filename) {
    const dateMatch = filename.match(/(\d{2}-\d{2}-\d{4})/);
    return dateMatch ? new Date(dateMatch[1].split('-').reverse().join('-')) : new Date(0);
}

// Sort and slice the image array

// Load images for current category
async function loadImages(category, page = 1) {
    const startIndex = (page - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    
    // Get all images in the category folder
    allImages = [];
    
    try {
        // First, fetch the index to know how many images exist
        const response = await fetch('assets/images/index.json');
        if (!response.ok) throw new Error('Could not fetch image index');
        const index = await response.json();
        
        const imageCount = index[category] || 0;
        
        // Now only loop through the number of images that actually exist
        for (let i = 1; i <= imageCount; i++) {
            const imageUrl = `assets/images/${category}/${i}-${category}.webp`;
            allImages.push(imageUrl);
        }
    } catch (error) {
        console.warn('Error loading images:', error);
        return [];
    }

    // Sort images by date in filename (most recent first)
    allImages.sort((a, b) => {
        const dateA = getDateFromFilename(a);
        const dateB = getDateFromFilename(b);
        return dateB - dateA;
    });

    // Show/hide load more button
    loadMoreBtn.style.display = allImages.length > endIndex ? 'block' : 'none';

    // Return paginated results
    return allImages.slice(startIndex, endIndex);
}

// Render images to the grid
function renderImages(images, append = false) {
    if (!append) {
        photoGrid.innerHTML = '';
    }

    images.forEach(imageUrl => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'photo-item';
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Gallery Photo';
        img.loading = 'lazy';
        
        // Detect image type and orientation
        img.onload = () => {
            if (category === 'game-boy') {
                imgContainer.classList.add('gameboy');
            } else if (img.naturalWidth < img.naturalHeight) {
                imgContainer.classList.add('portrait');
            }
            // landscape is now the default, no class needed
        };
        
        imgContainer.appendChild(img);
        photoGrid.appendChild(imgContainer);
    });
}

// Switch category
async function switchCategory(category) {
    currentCategory = category;
    currentPage = 1;
    
    // Update active button
    categoryButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });

    // Load and render images
    const images = await loadImages(category);
    renderImages(images);
}

// Load more images
async function loadMore() {
    currentPage++;
    const newImages = await loadImages(currentCategory, currentPage);
    renderImages(newImages, true);
}

// Event Listeners
categoryButtons.forEach(button => {
    button.addEventListener('click', () => switchCategory(button.dataset.category));
});

loadMoreBtn.addEventListener('click', loadMore);

// Initialize with favorites
document.addEventListener('DOMContentLoaded', () => {
    switchCategory('favorites');
});