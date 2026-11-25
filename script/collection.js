// ==========================================
// AURA - COLLECTION PRODUCT SYSTEM
// ==========================================

const API_URL = "https://aura-backend-txgz.onrender.com/api/products";
const EXCHANGE_RATE = 0.79;

const currentPage = window.location.pathname.toLowerCase();

const CATEGORY_MAP = {
    bags: "Bag",
    hats: "Hat",
    belts: "Belt",
    watches: "Watch",
    perfumes: "Perfume"
};

let PAGE_CATEGORY = Object.keys(CATEGORY_MAP).find(key =>
    currentPage.includes(key)
);

PAGE_CATEGORY = CATEGORY_MAP[PAGE_CATEGORY] || "Bag";

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
// 3. PRICE FORMAT
// ==========================================

function formatPrice(price) {
    const amount = Number(price) || 0;

    return currentCurrency === "GBP"
        ? "£" + (amount * EXCHANGE_RATE).toFixed(2)
        : "$" + amount.toFixed(2);
}

// ==========================================
// 4. LOAD PRODUCTS
// ==========================================

async function loadProducts() {
    const grid = document.getElementById("productsGrid");

    if (!grid) return;

    grid.innerHTML = `
        <div class="col-span-full text-center py-16">
            <p>Loading products...</p>
        </div>
    `;

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to fetch products.");
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.products)) {
            throw new Error("Invalid product data.");
        }

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
                gender: product.gender || null
            }));

        filterProducts();

        updateCartCount();
        updateWishlistCount();

    } catch (error) {
        console.error("Product loading error:", error);

        grid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <p class="text-red-500">Unable to load products.</p>
                <button onclick="loadProducts()" class="mt-4 px-5 py-2 bg-black text-white rounded">
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

    const isInCart = cart.some(item => item.id === product.id);
    const isInWishlist = wishlist.some(item => item.id === product.id);

    const imageHTML = product.image
        ? `<img src="${escapeHTML(product.image)}"
                alt="${escapeHTML(product.name)}"
                class="w-full h-full object-cover"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <div class="hidden w-full h-full items-center justify-center text-5xl bg-brand-card">💎</div>`
        : `<div class="w-full h-full flex items-center justify-center text-5xl bg-brand-card">💎</div>`;

    card.innerHTML = `
        <div class="relative aspect-square overflow-hidden bg-white">

            ${imageHTML}

            <button
                data-action="wishlist"
                data-id="${escapeHTML(product.id)}"
                class="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">

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
                } hover:bg-brand-hover disabled:opacity-50 text-white py-2.5 rounded transition">

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
                    No products found.
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

    if (!product || product.stock <= 0) return;

    if (typeof window.addItem !== "function") {
        showNotification("Cart system is still loading.");
        return;
    }

    await window.addItem(
        product.name,
        product.price,
        product.image,
        product.category,
        product.id
    );

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
// 9. CART COUNT
// ==========================================

function updateCartCount() {
    cart = JSON.parse(localStorage.getItem("aura_cart")) || [];

    const count = cart.reduce(
        (sum, item) => sum + Number(item.qty || item.quantity || 1),
        0
    );

    const element = document.getElementById("cart-count")
        || document.getElementById("cartCount");

    if (element) {
        element.textContent = count;
        element.classList.toggle("hidden", count === 0);
        element.classList.toggle("flex", count > 0);
    }
}

// ==========================================
// 10. WISHLIST COUNT
// ==========================================

function updateWishlistCount() {
    wishlist = JSON.parse(localStorage.getItem("aura_wishlist")) || [];

    const element = document.getElementById("wishlist-count")
        || document.getElementById("wishlistCount");

    if (element) {
        element.textContent = wishlist.length;
        element.classList.toggle("hidden", wishlist.length === 0);
    }
}

// ==========================================
// 11. NOTIFICATIONS
// ==========================================

function showNotification(message) {
    const existing = document.querySelector(".notification");

    if (existing) existing.remove();

    const notification = document.createElement("div");

    notification.className =
        "notification fixed top-20 right-4 bg-brand-button text-white px-6 py-3 rounded-lg shadow-lg z-50";

    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 2500);
}

// ==========================================
// 12. FILTER PRODUCTS
// ==========================================

function filterProducts() {
    let filtered = [...allProducts];

    filtered = filtered.filter(product =>
        !product.gender ||
        product.gender.toLowerCase() === currentGender
    );

    const minInput = document.getElementById("minPrice")?.value;
    const maxInput = document.getElementById("maxPrice")?.value;

    const minPrice = minInput === "" || minInput == null
        ? 0
        : Number(minInput);

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
// 13. GENDER FILTER
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
    document.getElementById("applyFilter")
        ?.addEventListener("click", filterProducts);

    document.getElementById("resetFilter")
        ?.addEventListener("click", () => {
            document.getElementById("minPrice").value = "";
            document.getElementById("maxPrice").value = "";
            filterProducts();
        });
}

// ==========================================
// 15. SEARCH
// ==========================================

function setupSearch() {
    document.getElementById("productSearch")
        ?.addEventListener("input", filterProducts);
}

// ==========================================
// 16. CURRENCY
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

    toggle?.addEventListener("click", () => {
        menu?.classList.toggle("hidden");
    });
}

// ==========================================
// 18. NAVIGATION
// ==========================================

function goToShop() {
    const shop = document.getElementById("shop")?.value;
    if (shop) window.location.href = shop;
}

function goToPage() {
    const page = document.getElementById("collection")?.value;
    if (page) window.location.href = page;
}

// ==========================================
// 19. PRODUCT EVENTS
// ==========================================

function setupProductEvents() {
    const grid = document.getElementById("productsGrid");

    if (!grid) return;

    grid.addEventListener("click", async event => {
        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const productId = button.dataset.id;

        if (button.dataset.action === "wishlist") {
            toggleWishlist(productId);
        }

        if (button.dataset.action === "cart") {
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

// ==========================================
// 21. GLOBAL FUNCTIONS
// ==========================================

window.loadProducts = loadProducts;
window.goToShop = goToShop;
window.goToPage = goToPage;