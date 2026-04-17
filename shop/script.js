// Global State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentCurrency = localStorage.getItem('currency') || 'USD';
let currentGender = 'women';
let allProducts = [];
let filteredProducts = [];

// Exchange rate (1 USD = 0.79 GBP approximately)
const EXCHANGE_RATE = 0.79;

// Product Images by Category
const productImages = {
    rings: [
        'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmluZ3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmluZ3xlbnwwfHwwfHx8MA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1678834778658-9862d9987dd3?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmluZ3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1739591414031-edd27896c8bf?w=600',
        'https://images.unsplash.com/photo-1695238856436-caaa0e926030?w=600',
        'https://images.unsplash.com/photo-1758995116121-60090f17ae20?w=600',
        'https://images.unsplash.com/photo-1712314131223-37afaecc4a86?w=600',
        'https://images.unsplash.com/photo-1758362197676-228703a17e69?w=600',
    ],
    pendants: [
        'https://plus.unsplash.com/premium_photo-1739557422500-9067b2e6e128?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGVuZGFudHN8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1705575554647-4dfba6d7cdd5?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVuZGFudHN8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVuZGFudHN8ZW58MHx8MHx8fDA%3D',
        'https://plus.unsplash.com/premium_photo-1681276170092-446cd1b5b32d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVuZGFudHN8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1758995115560-59c10d6cc28f?w=600',
        'https://images.unsplash.com/photo-1762337378734-f4e7a1a99234?w=600',
        'https://images.unsplash.com/photo-1758995115560-59c10d6cc28f?w=600'
    ],
    earrings: [
        'https://images.unsplash.com/photo-1774504347388-3d01f7cac097?w=600',
        'https://images.unsplash.com/photo-1767210338407-54b9264c326b?w=600',
        'https://images.unsplash.com/photo-1774504347388-3d01f7cac097?w=600',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1-epvBDplyJv1yiGlVm9vbiWz99lLRWOW8Q&s',
        'https://media.istockphoto.com/id/1275859113/photo/beautiful-golden-pair-of-earrings-on-white-background-luxury-female-jewelry-indian.webp?a=1&b=1&s=612x612&w=0&k=20&c=PoHD1iN2VDNtCr1cvNGz3-oEE2sZtHW9bkKA8bhZWXE=',
        'https://plus.unsplash.com/premium_photo-1681276170291-27698ccc0a8e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8RWFycmluZ3N8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RWFycmluZ3N8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1693212793204-bcea856c75fe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RWFycmluZ3N8ZW58MHx8MHx8fDA%3D',
    ],
    bracelets: [
        'https://images.unsplash.com/photo-1681091638214-99727acc173f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQyfHx8ZW58MHx8fHx8',
        'https://images.unsplash.com/photo-1740567389909-b36e9cadbef9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D',
        'https://media.istockphoto.com/id/1738742514/photo/womens-gold-bracelet-in-girl-hands-woman.webp?a=1&b=1&s=612x612&w=0&k=20&c=tQtztbX7SeHRp13VEZgaKKScI-sQiuNlIFhfhTAOEGM=',
        'https://images.unsplash.com/photo-1725368844213-c167fe556f98?w=600',
        'https://images.unsplash.com/photo-1763029513623-37d488cb97b1?w=600',
        'https://images.unsplash.com/photo-1725368844213-c167fe556f98?w=600'
    ],
    diamond: [
        'https://images.unsplash.com/photo-1739591414031-edd27896c8bf?w=600',
        'https://images.unsplash.com/photo-1695238856436-caaa0e926030?w=600',
        'https://images.unsplash.com/photo-1774504347388-3d01f7cac097?w=600'
    ],
    platinum: [
        'https://images.unsplash.com/photo-1561995734-ef4b62bb6586?w=600',
        'https://images.unsplash.com/photo-1758362197676-228703a17e69?w=600',
        'https://images.unsplash.com/photo-1712314131223-37afaecc4a86?w=600'
    ]
};

// Product name templates by category
const productNames = {
    rings: ['Engagement Ring', 'Wedding Band', 'Casual Ring', 'Statement Ring', 'Eternity Band', 'Solitaire Ring', 'Halo Ring', 'Vintage Ring', 'Modern Ring', 'Classic Ring'],
    pendants: ['Diamond Pendant', 'Gold Pendant', 'Silver Pendant', 'Heart Pendant', 'Cross Pendant', 'Gemstone Pendant', 'Pearl Pendant', 'Vintage Pendant', 'Modern Pendant', 'Designer Pendant'],
    earrings: ['Stud Earrings', 'Hoop Earrings', 'Drop Earrings', 'Dangle Earrings', 'Pearl Earrings', 'Diamond Studs', 'Gold Hoops', 'Statement Earrings', 'Vintage Earrings', 'Modern Earrings'],
    bracelets: ['Tennis Bracelet', 'Chain Bracelet', 'Bangle', 'Cuff Bracelet', 'Charm Bracelet', 'Diamond Bracelet', 'Gold Bracelet', 'Silver Bracelet', 'Statement Bracelet', 'Vintage Bracelet'],
    diamond: ['Diamond Ring', 'Diamond Necklace', 'Diamond Earrings', 'Diamond Bracelet', 'Diamond Pendant', 'Solitaire Diamond', 'Diamond Studs', 'Diamond Band', 'Diamond Set', 'Diamond Jewelry'],
    platinum: ['Platinum Ring', 'Platinum Band', 'Platinum Necklace', 'Platinum Earrings', 'Platinum Bracelet', 'Platinum Pendant', 'Platinum Chain', 'Platinum Jewelry', 'Platinum Set', 'Platinum Collection']
};

// Generate Products Function
function generateProducts(category, count) {
    const products = [];
    const images = productImages[category] || productImages.rings;
    const names = productNames[category] || productNames.rings;
    
    for (let i = 0; i < count; i++) {
        const basePrice = Math.floor(Math.random() * 3000) + 500; // $500 - $3500
        const discountedPrice = Math.floor(basePrice * 0.63); // 37% off
        
        products.push({
            id: `${category}-${i + 1}`,
            name: `${names[i % names.length]} ${i + 1}`,
            category: category,
            gender: i % 2 === 0 ? 'women' : 'men',
            originalPrice: basePrice,
            price: discountedPrice,
            image: images[i % images.length],
            discount: 37,
            rating: 5
        });
    }
    
    return products;
}

// Format Price based on currency
function formatPrice(price) {
    if (currentCurrency === 'GBP') {
        return `£${Math.floor(price * EXCHANGE_RATE)}`;
    }
    return `$${price}`;
}

// Create Product Card HTML
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card bg-brand-card rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1';
    card.setAttribute('data-price', product.price);
    card.setAttribute('data-gender', product.gender);
    
    const isInCart = cart.some(item => item.id === product.id);
    const isInWishlist = wishlist.some(item => item.id === product.id);
    
    card.innerHTML = `
        <div class="relative aspect-square overflow-hidden">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
            <div class="absolute top-3 right-3 bg-brand-button text-white text-xs px-3 py-1 rounded-full font-semibold">
                ${product.discount}% OFF
            </div>
            <button 
                onclick="toggleWishlist('${product.id}')" 
                class="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition">
                <svg class="w-5 h-5 ${isInWishlist ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-brand-bg'}" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
            </button>
        </div>
        <div class="p-4">
            <h3 class="font-serif text-lg mb-2 truncate">${product.name}</h3>
            <div class="flex items-center mb-3">
                ${generateStars(product.rating)}
                <span class="ml-2 text-xs text-brand-subtext">(${Math.floor(Math.random() * 200) + 50})</span>
            </div>
            <div class="flex items-center space-x-2 mb-4">
                <span class="text-xl font-semibold">${formatPrice(product.price)}</span>
                <span class="text-sm text-brand-subtext line-through">${formatPrice(product.originalPrice)}</span>
            </div>
            <button 
                onclick="addToCart('${product.id}')" 
                class="w-full ${isInCart ? 'bg-green-600' : 'bg-brand-button'} hover:bg-brand-hover text-white py-2.5 rounded transition font-medium">
                ${isInCart ? 'Added to Cart ✓' : 'Add to Cart'}
            </button>
        </div>
    `;
    
    return card;
}

// Generate Star Rating
function generateStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        stars += `<svg class="w-4 h-4 ${i < rating ? 'fill-yellow-400' : 'fill-gray-400'}" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>`;
    }
    return stars;
}

// Render Products
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <p class="text-brand-subtext text-lg">No products found matching your filters.</p>
            </div>
        `;
        return;
    }
    
    products.forEach(product => {
        grid.appendChild(createProductCard(product));
    });
}

// Add to Cart
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Re-render to update button state
    renderProducts(filteredProducts);
    
    // Show notification
    showNotification('Added to cart!');
}

// Toggle Wishlist
function toggleWishlist(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const index = wishlist.findIndex(item => item.id === productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist');
    } else {
        wishlist.push(product);
        showNotification('Added to wishlist!');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    
    // Re-render to update button state
    renderProducts(filteredProducts);
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
    }
}

// Update Wishlist Count
function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
}

// Show Notification
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification fixed top-20 right-4 bg-brand-button text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Filter Products
function filterProducts() {
    let filtered = [...allProducts];
    
    // Filter by gender
    filtered = filtered.filter(p => p.gender === currentGender);
    
    // Filter by price range
    const minPrice = parseInt(document.getElementById('minPrice')?.value) || 0;
    const maxPrice = parseInt(document.getElementById('maxPrice')?.value) || Infinity;
    
    if (minPrice > 0 || maxPrice < Infinity) {
        filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
    }
    
    filteredProducts = filtered;
    renderProducts(filteredProducts);
}

// Setup Gender Toggle
function setupGenderToggle() {
    const womenBtn = document.getElementById('genderWomen');
    const menBtn = document.getElementById('genderMen');
    
    if (!womenBtn || !menBtn) return;
    
    womenBtn.addEventListener('click', () => {
        currentGender = 'women';
        womenBtn.classList.add('active');
        menBtn.classList.remove('active');
        filterProducts();
    });
    
    menBtn.addEventListener('click', () => {
        currentGender = 'men';
        menBtn.classList.add('active');
        womenBtn.classList.remove('active');
        filterProducts();
    });
}

// Setup Price Filter
function setupPriceFilter() {
    const applyBtn = document.getElementById('applyFilter');
    const resetBtn = document.getElementById('resetFilter');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', filterProducts);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.getElementById('minPrice').value = '';
            document.getElementById('maxPrice').value = '';
            filterProducts();
        });
    }
}

// Setup Currency Selector
function setupCurrencySelector() {
    const selector = document.getElementById('currencySelector');
    if (!selector) return;
    
    selector.value = currentCurrency;
    
    selector.addEventListener('change', (e) => {
        currentCurrency = e.target.value;
        localStorage.setItem('currency', currentCurrency);
        renderProducts(filteredProducts);
    });
}

// Setup Mobile Menu
function setupMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('mobileMenu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }
}

// Navigation Functions
function goToShop() {
    var shop = document.getElementById("shop").value;
    if (shop) {
        window.location.href = shop;
    }
}

function goToPage() {
    var page = document.getElementById("collection").value;
    if (page) {
        window.location.href = page;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Initialize counts
    updateCartCount();
    updateWishlistCount();
    
    // Setup event listeners
    setupGenderToggle();
    setupPriceFilter();
    setupCurrencySelector();
    setupMobileMenu();
    
    // If products were generated by the page, filter and render them
    if (typeof pageData !== 'undefined' && pageData.products) {
        allProducts = pageData.products;
        filteredProducts = allProducts.filter(p => p.gender === currentGender);
        renderProducts(filteredProducts);
    }
});