
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
    
    // Function to check if an image can be loaded
    const checkImage = (url) => {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    };

    // Try to find images by checking common patterns
    const today = new Date();
    const possibleDates = [];
    
    // Add dates from the last 30 days
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-GB').replace(/\//g, '-');
        possibleDates.push(dateStr);
    }

    // Check for images with these dates
    for (let i = 1; i <= 100; i++) {
        for (const dateStr of possibleDates) {
            const filename = `${i}-${category}-${dateStr}.webp`;
            const imageUrl = `assets/images/${category}/${filename}`;
            
            if (await checkImage(imageUrl)) {
                allImages.push(imageUrl);
            }
        }
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
        
        // Detect image orientation once loaded
        img.onload = () => {
            if (img.naturalWidth > img.naturalHeight) {
                imgContainer.classList.add('landscape');
            }
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