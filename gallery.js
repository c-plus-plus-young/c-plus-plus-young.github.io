
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
    const categoryButtons = document.querySelectorAll('.category-btn');

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
        
        // Add dates from the last 365 days to check
        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('en-GB').replace(/\//g, '-');
            possibleDates.push(dateStr);
        }

        // Try to find images with valid date patterns
        for (let i = 1; i <= imageCount; i++) {
            for (const dateStr of possibleDates) {
                const imageUrl = `assets/images/${category}/${i}-${category}-${dateStr}.webp`;
                if (await checkImage(imageUrl)) {
                    allImages.push(imageUrl);
                    break; // Found the image for this number, move to next
                }
            }
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