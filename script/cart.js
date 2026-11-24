
import { auth } from "../firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// ==========================================
// 1. CART INITIALIZATION
// ==========================================

let cart = JSON.parse(localStorage.getItem("aura_cart")) || [];
let currentUser = null;

let resolveAuthReady;

const authReady = new Promise((resolve) => {
    resolveAuthReady = resolve;
});

// ==========================================
// 2. FIREBASE AUTHENTICATION
// ==========================================

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    resolveAuthReady(user);

    if (user) {
        const pendingItem = sessionStorage.getItem("aura_pending_item");

        if (pendingItem) {
            try {
                const item = JSON.parse(pendingItem);
                sessionStorage.removeItem("aura_pending_item");

                function addItemDirectly(
    name,
    price,
    image = "",
    category = "Jewelry",
    productId = null
) {
    const existingItem = cart.find(item =>
        productId
            ? item.id === productId
            : !item.id && item.name === name
    );

    if (existingItem) {
        existingItem.qty++;

        if (image) existingItem.image = image;
        if (category) existingItem.category = category;

    } else {
        cart.push({
            id: productId,
            name,
            price: Number(price),
            image,
            category,
            qty: 1
        });
    }

    saveCart();
    showItem();

    alert(`${name} added to your bag!`);
}

            } catch (error) {
                console.error("Pending cart item error:", error);
                sessionStorage.removeItem("aura_pending_item");
            }
        }
    }
});

// ==========================================
// 3. SAVE CART
// ==========================================

function saveCart() {
    localStorage.setItem("aura_cart", JSON.stringify(cart));
}

// ==========================================
// 4. ADD PRODUCT DIRECTLY
// ==========================================

function addItemDirectly(name, price, image = "", category = "Jewelry") {

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.qty++;

        if (image) existingItem.image = image;
        if (category) existingItem.category = category;

    } else {
        cart.push({
            name,
            price: Number(price),
            image,
            category,
            qty: 1
        });
    }

    saveCart();
    showItem();

    alert(`${name} added to your bag!`);
}

// ==========================================
// 5. ADD PRODUCT WITH LOGIN PROTECTION
// ==========================================

async function addItem(
    name,
    price,
    image = "",
    category = "Jewelry",
    productId = null
) {
    const user = await authReady;

    if (!user) {
        sessionStorage.setItem(
            "aura_pending_item",
            JSON.stringify({
                id: productId,
                name,
                price,
                image,
                category
            })
        );

        alert("Please login to add products to your bag.");

        const path = window.location.pathname;

        const loginPage = path.includes("/shop/")
            ? "../pages/login.html"
            : path.includes("/pages/")
                ? "./login.html"
                : "./pages/login.html";

        window.location.href = loginPage;
        return;
    }

    addItemDirectly(name, price, image, category, productId);
}

// ==========================================
// 6. FORMAT PRICE
// ==========================================

function formatPrice(price) {
    return "$" + Number(price).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// ==========================================
// 7. SAFE HTML TEXT
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
// 8. DISPLAY CART ITEMS
// ==========================================

function showItem() {

    const list = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");

    if (!list || !totalEl) return;

    list.innerHTML = "";

    let subtotal = 0;
    let totalQuantity = 0;

    if (cart.length === 0) {

        list.innerHTML = `
            <div class="text-center py-16">
                <div class="text-5xl mb-5">🛍️</div>

                <h3 class="font-serif text-2xl text-brand-text mb-2">
                    Your bag is empty
                </h3>

                <p class="text-brand-subtext mb-6">
                    Discover something beautiful for yourself.
                </p>

                <a href="../index.html"
                   class="inline-block px-8 py-3 bg-brand-button text-white rounded-full hover:opacity-80 transition">
                    Continue Shopping
                </a>
            </div>
        `;

        totalEl.innerText = formatPrice(0);

        const subtotalEl = document.getElementById("cart-subtotal");
        if (subtotalEl) subtotalEl.innerText = formatPrice(0);

        const quantityEl = document.getElementById("cart-quantity");
        if (quantityEl) quantityEl.innerText = "0";

        return;
    }

    cart.forEach((item, index) => {

        const price = Number(item.price) || 0;
        const qty = Number(item.qty) || 1;

        subtotal += price * qty;
        totalQuantity += qty;

        const imageHTML = item.image
            ? `<img src="${escapeHTML(item.image)}"
                    alt="${escapeHTML(item.name)}"
                    class="w-full h-full object-cover"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
               <div class="hidden w-full h-full items-center justify-center text-3xl bg-brand-card">💎</div>`
            : `<div class="w-full h-full flex items-center justify-center text-3xl bg-brand-card">💎</div>`;

        list.innerHTML += `
            <div class="flex flex-col sm:flex-row gap-5 items-center
                        bg-brand-card p-5 rounded-xl mb-4
                        border border-brand-card/50 shadow-sm">

                <div class="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                    ${imageHTML}
                </div>

                <div class="flex-1 text-center sm:text-left">

                    <p class="text-xs uppercase tracking-widest text-brand-subtext mb-2">
                        ${escapeHTML(item.category || "Jewelry")}
                    </p>

                    <h4 class="font-serif text-xl text-brand-text">
                        ${escapeHTML(item.name)}
                    </h4>

                    <p class="text-brand-subtext mt-2">
                        ${formatPrice(price)} each
                    </p>

                </div>

                <div class="flex items-center border border-brand-button rounded-full px-3 py-2">

                    <button onclick="dec(${index})"
                            class="px-3 text-xl text-brand-text hover:opacity-60">
                        −
                    </button>

                    <span class="font-bold px-3 text-brand-text">
                        ${qty}
                    </span>

                    <button onclick="inc(${index})"
                            class="px-3 text-xl text-brand-text hover:opacity-60">
                        +
                    </button>

                </div>

                <div class="text-center sm:text-right min-w-24">

                    <p class="font-bold text-brand-text">
                        ${formatPrice(price * qty)}
                    </p>

                    <button onclick="dlt(${index})"
                            class="text-red-500 text-sm mt-3 hover:underline">
                        Remove
                    </button>

                </div>

            </div>
        `;
    });

    // UPDATE TOTALS

    totalEl.innerText = formatPrice(subtotal);

    const subtotalEl = document.getElementById("cart-subtotal");
    if (subtotalEl) subtotalEl.innerText = formatPrice(subtotal);

    const quantityEl = document.getElementById("cart-quantity");
    if (quantityEl) quantityEl.innerText = totalQuantity;
}

// ==========================================
// 9. INCREASE QUANTITY
// ==========================================

function inc(index) {

    if (!cart[index]) return;

    cart[index].qty++;

    saveCart();
    showItem();
}

// ==========================================
// 10. DECREASE QUANTITY
// ==========================================

function dec(index) {

    if (!cart[index]) return;

    if (cart[index].qty > 1) {
        cart[index].qty--;
    } else {
        return;
    }

    saveCart();
    showItem();
}

// ==========================================
// 11. DELETE PRODUCT
// ==========================================

function dlt(index) {

    if (!cart[index]) return;

    cart.splice(index, 1);

    saveCart();
    showItem();
}

// ==========================================
// 12. PROCEED TO CHECKOUT
// ==========================================

async function proceedToCheckout() {

    // Check whether cart is empty
    if (cart.length === 0) {
        alert("Your bag is empty. Please add products first.");
        return;
    }

    // Wait for Firebase authentication
    const user = await authReady;

    // Check login status
    if (!user) {
        alert("Please login before proceeding to checkout.");
        window.location.href = "./login.html";
        return;
    }

    // Navigate to checkout page
    window.location.href = "./checkout.html";
}

// ==========================================
// 13. MAKE FUNCTIONS AVAILABLE TO HTML
// ==========================================

window.addItem = addItem;
window.showItem = showItem;
window.inc = inc;
window.dec = dec;
window.dlt = dlt;
window.proceedToCheckout = proceedToCheckout;

// ==========================================
// 14. LOAD CART
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    showItem();
});
