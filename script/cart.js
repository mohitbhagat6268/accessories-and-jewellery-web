// Initialize cart from localStorage, or use an empty array if nothing is saved
let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];

// Save the current state of the cart to localStorage
function saveCart() {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
}

// Add item to cart
function addItem(name, price) {
    let item = cart.find(i => i.name === name);

    if (item) {
        item.qty++;
    } else {
        cart.push({ name: name, price: price, qty: 1 });
    }
    
    saveCart();
    
    // Optional: A small visual feedback for the user
    alert(`${name} added to cart!`); 
}

// Display Cart Items (Only runs on the cart page)
function showItem() {
    let list = document.getElementById("cart-items");
    let totalEl = document.getElementById("cart-total");
    
    // If these elements don't exist (like on the home page), stop the function
    if (!list || !totalEl) return; 

    list.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        list.innerHTML = "<p class='text-brand-subtext text-center py-8'>Your cart is currently empty.</p>";
        totalEl.innerText = "$0.00";
        return;
    }

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        list.innerHTML += `
        <div class="flex justify-between items-center bg-brand-card p-6 rounded-lg mb-4 border border-brand-card/50 shadow-md">
            <div>
                <h4 class="font-serif text-xl text-brand-text">${item.name}</h4>
                <p class="text-brand-subtext mt-1">$${item.price.toLocaleString(undefined, {minimumFractionDigits: 2})} each</p>
            </div>
            <div class="flex items-center space-x-6">
                <div class="flex items-center border border-brand-button rounded-full px-3 py-1">
                    <button onclick="dec(${index})" class="text-brand-text hover:text-brand-hover text-xl px-2 transition-colors">-</button>
                    <span class="text-brand-text font-bold px-4">${item.qty}</span>
                    <button onclick="inc(${index})" class="text-brand-text hover:text-brand-hover text-xl px-2 transition-colors">+</button>
                </div>
                <div class="font-bold text-brand-text w-24 text-right">
                    $${(item.price * item.qty).toLocaleString(undefined, {minimumFractionDigits: 2})}
                </div>
                <button onclick="dlt(${index})" class="text-brand-hover hover:text-red-500 text-xl ml-4 transition-colors" title="Remove Item">✖</button>
            </div>
        </div>`;
    });

    totalEl.innerText = "$" + total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function inc(i) {
    cart[i].qty++;
    saveCart();
    showItem();
}

function dec(i) {
    if (cart[i].qty > 1) {
        cart[i].qty--;
        saveCart();
        showItem();
    }
}

function dlt(i) {
    cart.splice(i, 1);
    saveCart();
    showItem();
}

// Automatically render the cart when the page loads (if we are on the cart page)
document.addEventListener('DOMContentLoaded', () => {
    showItem();
});