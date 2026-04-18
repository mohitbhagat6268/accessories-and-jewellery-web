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
        'https://i.pinimg.com/736x/56/b2/3f/56b23f50fdc7cd8fbd4341c98b65a43a.jpg',
        'https://i.pinimg.com/736x/59/cc/13/59cc136f5e9d1d461b5afbba7588a3c4.jpg',
        'https://i.pinimg.com/1200x/5a/d1/4f/5ad14f154acffa35370253a0795658dd.jpg',
        'https://i.pinimg.com/1200x/e9/11/58/e91158a6b5bcc8d990e3ac5405823ac2.jpg',
        'https://i.pinimg.com/1200x/6f/5d/3d/6f5d3d017f54e2d5034601e6031795d6.jpg',
        'https://i.pinimg.com/1200x/37/d5/e5/37d5e58392fe7ceb11f60cb2e91789ab.jpg',
        'https://i.pinimg.com/736x/8b/25/fb/8b25fb33144ffc8fad19a59df5125432.jpg',
        'https://i.pinimg.com/736x/bb/08/ac/bb08acf0a91a5a29a29346900688be49.jpg',
        'https://i.pinimg.com/736x/f7/32/08/f73208b2d6eb56aa0dcc115cb3b798f7.jpg',
        'https://i.pinimg.com/736x/dd/39/43/dd3943c21754281ad6c8cb80e47e64bc.jpg',
        'https://i.pinimg.com/1200x/55/b2/3f/55b23f9779b53989f564b32444693155.jpg',
        'https://i.pinimg.com/1200x/20/f5/21/20f5215788683ec988cc6eef4180b1f1.jpg',
        'https://i.pinimg.com/1200x/36/17/e2/3617e231b437bf620253efc9396b3f3d.jpg',
        'https://i.pinimg.com/736x/5e/85/fe/5e85fe76b178eafc5ff0e2f7cd9abecd.jpg',
        'https://i.pinimg.com/736x/80/c5/d0/80c5d028a1b7694f62ae7bd7b86b994c.jpg',
        'https://i.pinimg.com/1200x/b2/ac/45/b2ac45e3ce2541d56f65154f0df59d26.jpg'
    ],
    pendants: [
        'https://i.pinimg.com/1200x/bf/83/cb/bf83cb696fb3c1114fb72ee6843daf7a.jpg',
        'https://i.pinimg.com/736x/73/bc/73/73bc733034da908793854879b24787d4.jpg',
        'https://i.pinimg.com/1200x/18/e5/34/18e53422d9e608e19e1d3b6b36e7cf7b.jpg',
        'https://i.pinimg.com/736x/00/24/a9/0024a91cc9265807c2f5a3e9c8165b7b.jpg',
        'https://i.pinimg.com/1200x/8b/43/bb/8b43bbd980bdeeff58d2c5874ebf3340.jpg',
        'https://i.pinimg.com/736x/dd/42/a0/dd42a0638ca24ee478ae062fb35bb44e.jpg',
        'https://i.pinimg.com/736x/25/5d/80/255d80e055c12289a8ef9aedcb5851e5.jpg',
        'https://i.pinimg.com/736x/18/bd/5d/18bd5d06e343c2b808110aef4dc2a8de.jpg',
        'https://i.pinimg.com/736x/19/ec/56/19ec56c5552cf97e9dbd55d5e31152c9.jpg',
        'https://i.pinimg.com/736x/5b/ad/d5/5badd5d8835a04c49a3dfadddafb2ee2.jpg',
        'https://i.pinimg.com/1200x/bb/13/d5/bb13d50f887556c28b937bb3acc36e74.jpg',
        'https://i.pinimg.com/1200x/d3/72/9f/d3729fe5f9113184f45a34c990337b9d.jpg',
        'https://i.pinimg.com/1200x/db/b8/3a/dbb83a85d4ae5318ba9cb81f9f8f0c16.jpg',
        'https://i.pinimg.com/1200x/fd/2a/95/fd2a9592c3d120443f4b7ae728d0fb7d.jpg',
        'https://i.pinimg.com/1200x/ea/a5/d7/eaa5d750f6acf895cfa1dec8afb39bfc.jpg',
        'https://i.pinimg.com/736x/30/ce/fa/30cefa832592350ecd656a63902316f7.jpg'
    ],
    earrings: [
        'https://i.pinimg.com/736x/bc/56/dc/bc56dc81e696235fceb1cd572580a291.jpg',
        'https://i.pinimg.com/736x/9c/92/7b/9c927b17ddd91f1dfb7e59bf269d9c59.jpg',
        'https://i.pinimg.com/1200x/bf/cf/20/bfcf208a4d0e9af89ade3be7c27e676b.jpg',
        'https://i.pinimg.com/736x/e4/9a/b7/e49ab755481dec3a6474b70fa5c09c7c.jpg',
        'https://i.pinimg.com/736x/4b/55/fb/4b55fbaa32af3e3bfd7c45556eddb1a3.jpg',
        'https://i.pinimg.com/1200x/fb/5b/80/fb5b80f279de5e37c9cb1f3291f69852.jpg',
        'https://i.pinimg.com/1200x/79/b4/b7/79b4b7da2aaefc6da0330b6e3561d24e.jpg',
        'https://i.pinimg.com/736x/07/01/e3/0701e3d4fc3f73eded546f4b011216f5.jpg',
        'https://i.pinimg.com/1200x/fa/4e/29/fa4e294b9624c0ec3daf401902c8349c.jpg',
        'https://i.pinimg.com/1200x/d3/d9/d8/d3d9d8542e2bd5cbcd1c95ecf78a7647.jpg',
        'https://i.pinimg.com/736x/1d/2b/ac/1d2bac63d9dd01fab984a25d72cb54f6.jpg',
        'https://i.pinimg.com/736x/dc/29/1f/dc291f33faa82564820a77fb01fa1621.jpg',
        'https://i.pinimg.com/736x/f3/4c/ce/f34cce505979eb129ed8076ee413741e.jpg',
        'https://i.pinimg.com/1200x/7d/9a/48/7d9a48edb1a1d34703c93e42fa84b01f.jpg',
        'https://i.pinimg.com/1200x/d6/83/33/d68333c9e9591d7739f90f8b5c47ff82.jpg',
        'https://i.pinimg.com/1200x/ba/6c/42/ba6c429a340868d08a2017f75fd0456d.jpg',
        'https://i.pinimg.com/736x/1e/a9/2e/1ea92e1b9698122d9ac09e2ec3800a70.jpg'
    ],
    bracelets: [
        'https://i.pinimg.com/1200x/8c/8a/5d/8c8a5dd8dc9bf4854f24d07356c990b5.jpg',
        'https://i.pinimg.com/1200x/d6/86/60/d686605e497080db6aad53ed15456e44.jpg',
        'https://i.pinimg.com/1200x/36/3b/fd/363bfd5d90d23927d03b8caa488c5c7b.jpg',
        'https://i.pinimg.com/1200x/68/64/78/68647815a4542dd40dda7f856207dd33.jpg',
        'https://i.pinimg.com/1200x/ed/7b/70/ed7b7009cf5a95c1ad76a62623406517.jpg',
        'https://i.pinimg.com/736x/10/90/69/1090692dac391a38d481bf8b4ed5d15a.jpg',
        'https://i.pinimg.com/736x/4d/68/c7/4d68c7d452f0f3b057be60899c6f1157.jpg',
        'https://i.pinimg.com/1200x/bc/9f/39/bc9f397816b0181cb62602805d2cd2b1.jpg',
        'https://i.pinimg.com/1200x/0b/95/8d/0b958d3b0bcda327b3384bb4466656b2.jpg',
        'https://i.pinimg.com/736x/4f/f2/b9/4ff2b97d0c5496226b4473a84be102a5.jpg',
        'https://i.pinimg.com/1200x/60/2b/c1/602bc1f383632906b57f204d5c1261f3.jpg',
        'https://i.pinimg.com/736x/df/68/b7/df68b72cc4d50d63d5a2bb93287f8bf2.jpg',
        'https://i.pinimg.com/1200x/9b/e6/86/9be686b5fb63835aa4e4af2b654de2f0.jpg',
        'https://i.pinimg.com/736x/57/17/13/5717132e934c24ce314b51b9dbc14125.jpg',
        'https://i.pinimg.com/736x/e6/3d/d4/e63dd4c530b7225d68bbef4a1c2b240e.jpg',
        'https://i.pinimg.com/1200x/7c/81/6f/7c816ff3b24f74d464cce394c0063864.jpg',
        'https://i.pinimg.com/1200x/76/28/30/762830393b4b0db95c97c646cec08c57.jpg'
    ],
    diamond: [
        'https://i.pinimg.com/736x/d0/72/48/d07248c539bb2d8e12e7e42eca69e6fa.jpg',
        'https://i.pinimg.com/1200x/ab/6d/c5/ab6dc58571093cf05ea931cd1e5ecfe5.jpg',
        'https://i.pinimg.com/736x/9b/78/6e/9b786e06a941a2e7b4e17a061d039509.jpg',
        'https://i.pinimg.com/1200x/0b/4b/34/0b4b345db90cf00ff142e288af3d40e9.jpg',
        'https://i.pinimg.com/736x/05/38/dc/0538dce4155af443a9238d05d597a301.jpg',
        'https://i.pinimg.com/1200x/ea/5b/ad/ea5bad3d64f90355fd063d04cfabd842.jpg',
        'https://i.pinimg.com/736x/22/31/c4/2231c42c4ee0791c4abb3de34ced0f88.jpg',
        'https://i.pinimg.com/736x/d2/5f/dd/d25fdd03593600ddca5a992d5327fbe2.jpg',
        'https://i.pinimg.com/1200x/d3/03/00/d303008619bd0b60d9b3e8056599fee0.jpg',
        'https://i.pinimg.com/1200x/17/0a/2e/170a2ed886761680f5475952d1af35a8.jpg',
        'https://i.pinimg.com/736x/3d/44/79/3d4479e818c8a8cb445089fcb8693aa8.jpg',
        'https://i.pinimg.com/736x/3f/0f/80/3f0f80ac3ba1c97139f566a3e47257de.jpg',
        'https://i.pinimg.com/1200x/17/ad/f7/17adf79228ee2b3dda45fb935f323ffa.jpg',
        'https://i.pinimg.com/1200x/b5/73/cb/b573cbcefb295325efb25ab115a948d6.jpg',
        'https://i.pinimg.com/736x/3a/83/e5/3a83e578fb4f5417d63f3e5984915c2a.jpg',
        'https://i.pinimg.com/736x/c9/ff/20/c9ff208f50282e83b30288d72052dcfa.jpg'
    ],
    platinum: [
        'https://i.pinimg.com/1200x/d4/19/5b/d4195b427ec9cb1114fa1bdd27602e5d.jpg',
        'https://i.pinimg.com/1200x/6f/28/ca/6f28ca4809eecf311efa6d33dc611322.jpg',
        'https://i.pinimg.com/736x/8d/d5/89/8dd589cda7eac9b7c3e5f5969c57dbed.jpg',
        'https://i.pinimg.com/736x/6f/28/ca/6f28ca4809eecf311efa6d33dc611322.jpg',
        'https://i.pinimg.com/1200x/1f/fa/1d/1ffa1d7fe59df1d5bcae345f9e32365c.jpg',
        'https://i.pinimg.com/736x/82/b4/93/82b4932a5c9ea807fe2f6143045d4c51.jpg',
        'https://i.pinimg.com/1200x/2f/3d/63/2f3d630a6fca93d02cd25f359830b5d2.jpg',
        'https://i.pinimg.com/736x/52/1f/94/521f943ede3fe2dd5b5796fdc3273abe.jpg',
        'https://i.pinimg.com/1200x/a8/48/44/a84844816db5910ac9def5dbad94b1f8.jpg',
        'https://i.pinimg.com/736x/17/cc/4d/17cc4dc0a2cc497eb2cff79a95415d34.jpg',
        'https://i.pinimg.com/1200x/bb/9d/30/bb9d30d38899317d00288c2e6f1da508.jpg',
        'https://i.pinimg.com/736x/f5/dd/08/f5dd088c859f2353d1302d6f3a518188.jpg',
        'https://i.pinimg.com/1200x/d6/47/17/d647172936e289a3c4ecff818439cf63.jpg'
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