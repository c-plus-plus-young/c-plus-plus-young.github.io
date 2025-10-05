
document.addEventListener('DOMContentLoaded', () => {
    // State management
    let currentCategory = 'favorites';
    let currentPage = 1;
    const imagesPerPage = 12;
    let allImages = [];
    let categoryData = null;  // Cache for category data from index.json

    // DOM Elements
    const photoGrid = document.querySelector('.photo-grid');
    const loadMoreBtn = document.getElementById('load-more');
    const categoryButtons = document.querySelectorAll('.category-btn')
});

// Function to load and display images for current category
async function loadImages(category, page = 1) {
    const startIndex = (page - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    
    try {
        // Fetch the index if we haven't cached it yet
        if (!categoryData) {
            const response = await fetch('assets/images/index.json');
            if (!response.ok) throw new Error('Could not fetch image index');
            const index = await response.json();
            categoryData = index; // Cache all category data
        }
        
        // Get the category's image data
        const categoryImages = categoryData[category]?.images || [];
        allImages = categoryImages;

        // Clear the grid if it's the first page
        if (page === 1) {
            photoGrid.innerHTML = '';
        }

        // Display images for current page
        const pagesToShow = allImages.slice(startIndex, endIndex);
        
        // Create and append image elements
        for (const imageData of pagesToShow) {
            const photoElement = document.createElement('div');
            photoElement.className = `photo-item ${imageData.aspectRatio}`;
            
            const img = document.createElement('img');
            img.src = `assets/images/${category}/${imageData.filename}`;
            img.alt = `${category} photo from ${imageData.date}`;
            img.loading = 'lazy';
            
            photoElement.appendChild(img);
            photoGrid.appendChild(photoElement);
        }

        // Update load more button visibility
        loadMoreBtn.style.display = endIndex < allImages.length ? 'block' : 'none';
    } catch (error) {
        console.error('Error loading images:', error);
        photoGrid.innerHTML = '<p class="error">Error loading images. Please try again later.</p>';
    }
}

// Event Listeners
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const newCategory = button.dataset.category;
        if (newCategory !== currentCategory) {
            currentCategory = newCategory;
            currentPage = 1;
            loadImages(currentCategory);
            
            // Update active button state
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        }
    });
});

loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    loadImages(currentCategory, currentPage);
});

// Initial load
loadImages(currentCategory);