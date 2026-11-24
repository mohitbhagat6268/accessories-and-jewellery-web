
// ==========================================
// AURA - FIRESTORE PRODUCT SYSTEM
// ==========================================

const API_URL = "http://localhost:5000/api/products";
const currentPage = window.location.pathname.toLowerCase();

let PAGE_CATEGORY = "Bracelet";

if (currentPage.includes("earrings.html")) {
    PAGE_CATEGORY = "Earrings";
} else if (currentPage.includes("rings.html")) {
    PAGE_CATEGORY = "Ring";
} else if (currentPage.includes("pendants.html")) {
    PAGE_CATEGORY = "Pendant";
} else if (currentPage.includes("diamond.html")) {
    PAGE_CATEGORY = "Diamond";
} else if (currentPage.includes("platinum.html")) {
    PAGE_CATEGORY = "Platinum";
}
const EXCHANGE_RATE = 0.79;

// ==========================================
// 1. GLOBAL STATE
// ==========================================

let cart = JSON.parse(localStorage.getItem("aura_cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("aura_wishlist")) || [];

let currentCurrency = localStorage.getItem("currency") || "USD";
let currentGender = "women";

let allProducts = [];
let filteredProducts = [];

// ==========================================
// 2. SAFE HTML
// ==========================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// ==========================================
// 3. FORMAT PRICE
// ==========================================

function formatPrice(price) {
    const amount = Number(price) || 0;

    if (currentCurrency === "GBP") {
        return "£" + (amount * EXCHANGE_RATE).toFixed(2);
    }

    return "$" + amount.toFixed(2);
}

// ==========================================
// 4. FETCH PRODUCTS FROM BACKEND
// ==========================================

async function loadProducts() {
    const grid = document.getElementById("productsGrid");

    if (!grid) return;

    grid.innerHTML = `
        <div class="col-span-full text-center py-16">
            <p class="text-brand-subtext text-lg">
                Loading products...
            </p>
        </div>
    `;

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to fetch products from server.");
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.products)) {
            throw new Error("Invalid product data received.");
        }

        // Keep only products belonging to this page
        allProducts = data.products
            .filter(product =>
                String(product.category || "").toLowerCase() ===
                PAGE_CATEGORY.toLowerCase()
            )
            .map(product => ({
                id: product.id,
                name: product.name || "Unnamed Product",
                description: product.description || "",
                price: Number(product.price) || 0,
                category: product.category,
                image: product.imageUrl || "",
                stock: Number(product.stock) || 0,
                featured: Boolean(product.featured),
                gender: product.gender || null
            }));

        filterProducts();

        updateCartCount();
        updateWishlistCount();

    } catch (error) {
        console.error("Product loading error:", error);

        grid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <p class="text-red-400 text-lg mb-3">
                    Unable to load products.
                </p>
                <p class="text-brand-subtext text-sm">
                    Please make sure your backend server is running on port 5000.
                </p>
                <button onclick="loadProducts()"
                    class="mt-5 bg-brand-button text-white px-6 py-2 rounded-lg">
                    Try Again
                </button>
            </div>
        `;
    }
}

// ==========================================
// 5. PRODUCT CARD
// ==========================================

function createProductCard(product) {
    const card = document.createElement("div");

    card.className =
        "product-card bg-brand-card rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1";

    card.setAttribute("data-price", product.price);

    const isInCart = cart.some(item => item.id === product.id);
    const isInWishlist = wishlist.some(item => item.id === product.id);

    const imageHTML = product.image
        ? `<img src="${escapeHTML(product.image)}"
                alt="${escapeHTML(product.name)}"
                class="w-full h-full object-cover"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <div class="hidden w-full h-full items-center justify-center text-5xl bg-brand-card">
                💎
           </div>`
        : `<div class="w-full h-full flex items-center justify-center text-5xl bg-brand-card">
                💎
           </div>`;

    card.innerHTML = `
        <div class="relative aspect-square overflow-hidden bg-white">

            ${imageHTML}

            <button
                data-action="wishlist"
                data-id="${escapeHTML(product.id)}"
                class="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition">

                <svg class="w-5 h-5 ${
                    isInWishlist
                        ? "fill-red-500 stroke-red-500"
                        : "fill-none stroke-gray-800"
                }" viewBox="0 0 24 24">

                    <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
            </button>

        </div>

        <div class="p-4">

            <p class="text-xs uppercase tracking-widest text-brand-subtext mb-2">
                ${escapeHTML(product.category)}
            </p>

            <h3 class="font-serif text-lg mb-2 truncate">
                ${escapeHTML(product.name)}
            </h3>

            <p class="text-sm text-brand-subtext mb-3">
                ${escapeHTML(product.description)}
            </p>

            <div class="flex items-center justify-between mb-4">

                <span class="text-xl font-semibold">
                    ${formatPrice(product.price)}
                </span>

                <span class="text-xs text-brand-subtext">
                    ${product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>

            </div>

            <button
                data-action="cart"
                data-id="${escapeHTML(product.id)}"
                ${product.stock <= 0 ? "disabled" : ""}
                class="w-full ${
                    isInCart ? "bg-green-600" : "bg-brand-button"
                } hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded transition font-medium">

                ${
                    product.stock <= 0
                        ? "Out of Stock"
                        : isInCart
                            ? "Added to Cart ✓"
                            : "Add to Cart"
                }

            </button>

        </div>
    `;

    return card;
}

// ==========================================
// 6. RENDER PRODUCTS
// ==========================================

function renderProducts(products) {
    const grid = document.getElementById("productsGrid");

    if (!grid) return;

    grid.innerHTML = "";

    if (products.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <p class="text-brand-subtext text-lg">
                    No products found matching your filters.
                </p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        grid.appendChild(createProductCard(product));
    });
}

// ==========================================
// 7. ADD TO CART
// ==========================================

async function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);

    if (!product) return;

    if (product.stock <= 0) {
        showNotification("This product is out of stock.");
        return;
    }

    // Use the existing Firebase-protected cart function
    if (typeof window.addItem !== "function") {
        showNotification("Cart system is still loading. Try again.");
        return;
    }

    await window.addItem(
        product.name,
        product.price,
        product.image,
        product.category,
        product.id
    );

    // Update the local display
    cart = JSON.parse(localStorage.getItem("aura_cart")) || [];

    updateCartCount();
    renderProducts(filteredProducts);
}

// ==========================================
// 8. WISHLIST
// ==========================================

function toggleWishlist(productId) {
    const product = allProducts.find(p => p.id === productId);

    if (!product) return;

    const index = wishlist.findIndex(item => item.id === productId);

    if (index !== -1) {
        wishlist.splice(index, 1);
        showNotification("Removed from wishlist.");
    } else {
        wishlist.push({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.image
        });

        showNotification("Added to wishlist!");
    }

    localStorage.setItem("aura_wishlist", JSON.stringify(wishlist));

    updateWishlistCount();
    renderProducts(filteredProducts);
}

// ==========================================
// 9. UPDATE CART COUNT
// ==========================================

function updateCartCount() {
    cart = JSON.parse(localStorage.getItem("aura_cart")) || [];

    const count = cart.reduce(
        (sum, item) => sum + Number(item.qty || item.quantity || 1),
        0
    );

    const cartCount = document.getElementById("cart-count")
        || document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = count;
        if (count > 0) {
    cartCount.textContent = count;
    cartCount.classList.remove("hidden");
    cartCount.classList.add("flex");
} else {
    cartCount.classList.add("hidden");
    cartCount.classList.remove("flex");
}
    }
}

// ==========================================
// 10. UPDATE WISHLIST COUNT
// ==========================================

function updateWishlistCount() {
    wishlist = JSON.parse(localStorage.getItem("aura_wishlist")) || [];

    const wishlistCount = document.getElementById("wishlist-count")
        || document.getElementById("wishlistCount");

    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
        wishlistCount.classList.toggle("hidden", wishlist.length === 0);
    }
}

// ==========================================
// 11. NOTIFICATION
// ==========================================

function showNotification(message) {
    const existing = document.querySelector(".notification");

    if (existing) existing.remove();

    const notification = document.createElement("div");

    notification.className =
        "notification fixed top-20 right-4 bg-brand-button text-white px-6 py-3 rounded-lg shadow-lg z-50";

    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2500);
}

// ==========================================
// 12. FILTER PRODUCTS
// ==========================================

function filterProducts() {
    let filtered = [...allProducts];

    // Filter by gender only when Firestore has gender information.
    // Currently, your products do not have a gender field.
    filtered = filtered.filter(product =>
        !product.gender || product.gender === currentGender
    );

    // Price filtering uses original USD prices.
    const minPrice = Number(
        document.getElementById("minPrice")?.value
    ) || 0;

    const maxInput = document.getElementById("maxPrice")?.value;
    const maxPrice = maxInput === "" || maxInput == null
        ? Infinity
        : Number(maxInput);

    if (minPrice > maxPrice) {
        showNotification("Minimum price cannot exceed maximum price.");
        return;
    }

    filtered = filtered.filter(product =>
        product.price >= minPrice && product.price <= maxPrice
    );

    // Search filtering
    const searchTerm = (
        document.getElementById("productSearch")?.value || ""
    ).toLowerCase().trim();

    if (searchTerm) {
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }

    filteredProducts = filtered;

    renderProducts(filteredProducts);
}

// ==========================================
// 13. GENDER TOGGLE
// ==========================================

function setupGenderToggle() {
    const womenBtn = document.getElementById("genderWomen");
    const menBtn = document.getElementById("genderMen");

    if (!womenBtn || !menBtn) return;

    womenBtn.addEventListener("click", () => {
        currentGender = "women";

        womenBtn.classList.add("active");
        menBtn.classList.remove("active");

        filterProducts();
    });

    menBtn.addEventListener("click", () => {
        currentGender = "men";

        menBtn.classList.add("active");
        womenBtn.classList.remove("active");

        filterProducts();
    });
}

// ==========================================
// 14. PRICE FILTER
// ==========================================

function setupPriceFilter() {
    const applyBtn = document.getElementById("applyFilter");
    const resetBtn = document.getElementById("resetFilter");

    if (applyBtn) {
        applyBtn.addEventListener("click", filterProducts);
    }

    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            document.getElementById("minPrice").value = "";
            document.getElementById("maxPrice").value = "";

            filterProducts();
        });
    }
}

// ==========================================
// 15. SEARCH
// ==========================================

function setupSearch() {
    const searchInput = document.getElementById("productSearch");

    if (searchInput) {
        searchInput.addEventListener("input", filterProducts);
    }
}

// ==========================================
// 16. CURRENCY SELECTOR
// ==========================================

function setupCurrencySelector() {
    const selector = document.getElementById("currencySelector");

    if (!selector) return;

    if (!["USD", "GBP"].includes(currentCurrency)) {
        currentCurrency = "USD";
    }

    selector.value = currentCurrency;

    selector.addEventListener("change", event => {
        currentCurrency = event.target.value;

        localStorage.setItem("currency", currentCurrency);

        renderProducts(filteredProducts);
    });
}

// ==========================================
// 17. MOBILE MENU
// ==========================================

function setupMobileMenu() {
    const toggle = document.getElementById("mobileMenuToggle");
    const menu = document.getElementById("mobileMenu");

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            menu.classList.toggle("hidden");
        });
    }
}

// ==========================================
// 18. NAVIGATION FUNCTIONS
// ==========================================

function goToShop() {
    const shop = document.getElementById("shop")?.value;

    if (shop) {
        window.location.href = shop;
    }
}

function goToPage() {
    const page = document.getElementById("collection")?.value;

    if (page) {
        window.location.href = page;
    }
}

// ==========================================
// 19. PRODUCT CARD EVENTS
// ==========================================

function setupProductEvents() {
    const grid = document.getElementById("productsGrid");

    if (!grid) return;

    grid.addEventListener("click", async event => {
        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const productId = button.dataset.id;
        const action = button.dataset.action;

        if (action === "wishlist") {
            toggleWishlist(productId);
        }

        if (action === "cart") {
            await addToCart(productId);
        }
    });
}

// ==========================================
// 20. INITIALIZE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    setupGenderToggle();
    setupPriceFilter();
    setupSearch();
    setupCurrencySelector();
    setupMobileMenu();
    setupProductEvents();

    updateCartCount();
    updateWishlistCount();

    loadProducts();
});

// Make functions available to HTML when needed
window.loadProducts = loadProducts;
window.goToShop = goToShop;
window.goToPage = goToPage;
