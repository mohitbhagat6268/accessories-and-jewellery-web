// =======================
// PAGE NAVIGATION
// =======================
function goToPage() {
    const page = document.getElementById("collection").value;
    if (page !== "") {
        window.location.href = page;
    }
}

function goToShop() {
    const page = document.getElementById("shop").value;
    if (page !== "") {
        window.location.href = page;
    }
}


// =======================
// WISHLIST FUNCTION ❤️
// =======================
const wishlistButtons = document.querySelectorAll(".wishlist-icon");

wishlistButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
        e.preventDefault();

        if (btn.classList.contains("active")) {
            btn.classList.remove("active");
            btn.innerText = "♡";
        } else {
            btn.classList.add("active");
            btn.innerText = "❤️";
        }
    });
});


// =======================
// ADD TO CART 🛒
// =======================
const buyButtons = document.querySelectorAll(".buy-btn");

buyButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
        e.preventDefault();

        const productCard = btn.closest(".product-card");
        const title = productCard.querySelector("h3").innerText;
        const price = productCard.querySelector(".new").innerText;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart.push({
            name: title,
            price: price
        });

        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Added to cart: " + title);
    });
});


// =======================
// BUY NOW BUTTON
// =======================
buyButtons.forEach((btn) => {
    btn.addEventListener("dblclick", function () {
        window.location.href = "cart.html";
    });
});


// =======================
// HERO BUTTON (SHOP NOW)
// =======================
const heroBtn = document.querySelector(".hero-btn");

if (heroBtn) {
    heroBtn.addEventListener("click", () => {
        document.querySelector(".product-container").scrollIntoView({
            behavior: "smooth"
        });
    });
}
// BUY NOW → OPEN SINGLE PRODUCT PAGE
document.querySelectorAll(".buy-btn").forEach((btn) => {
    btn.addEventListener("click", function () {

        const card = btn.closest(".product-card");

        const product = {
            image: card.querySelector("img").src,
            title: card.querySelector("h3").innerText,
            description: card.querySelector("p").innerText,
            price: card.querySelector(".new").innerText,
            oldPrice: card.querySelector(".old").innerText
        };

        // Save product in localStorage
        localStorage.setItem("selectedProduct", JSON.stringify(product));

        // Redirect to single product page
        window.location.href = "single-product.html";
    });
});
// ===============================
// NAVBAR SCROLL EFFECT
// ===============================
const navbar = document.querySelector("nav");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.style.background = "rgba(19,19,19,0.95)";
        navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,0.5)";
    } else {
        navbar.style.background = "rgba(19,19,19,0.8)";
        navbar.style.boxShadow = "none";
    }
});


// ===============================
// MOBILE MENU (AUTO CREATE)
// ===============================
const nav = document.querySelector("nav");
const menuBtn = document.createElement("div");

menuBtn.innerHTML = "☰";
menuBtn.style.fontSize = "24px";
menuBtn.style.cursor = "pointer";
menuBtn.style.display = "none";
menuBtn.style.color = "#F4D6D8";

nav.appendChild(menuBtn);

const navList = document.querySelector("nav ul");

// Mobile view
function handleResize() {
    if (window.innerWidth <= 768) {
        menuBtn.style.display = "block";
        navList.style.display = "none";
        navList.style.flexDirection = "column";
        navList.style.background = "#131313";
        navList.style.position = "absolute";
        navList.style.top = "70px";
        navList.style.left = "0";
        navList.style.width = "100%";
        navList.style.padding = "20px";
    } else {
        menuBtn.style.display = "none";
        navList.style.display = "flex";
    }
}

window.addEventListener("resize", handleResize);
handleResize();

// Toggle menu
menuBtn.addEventListener("click", () => {
    if (navList.style.display === "none") {
        navList.style.display = "flex";
    } else {
        navList.style.display = "none";
    }
});


// ===============================
// ADD TO CART (LOCAL STORAGE)
// ===============================
const cartButtons = document.querySelectorAll(".buy-btn");

cartButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        let product = btn.closest(".product-card");

        let name = product.querySelector("h3").innerText;
        let desc = product.querySelector("p").innerText;
        let price = product.querySelector(".new").innerText;
        let img = product.querySelector("img").src;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart.push({ name, desc, price, img });

        localStorage.setItem("cart", JSON.stringify(cart));

        alert(name + " added to cart ✅");
    });
});


// ===============================
// WISHLIST TOGGLE ❤️
// ===============================
const wishlistBtns = document.querySelectorAll(".wishlist-icon");

wishlistBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.innerText === "♡") {
            btn.innerText = "❤️";
            btn.style.color = "red";
        } else {
            btn.innerText = "♡";
            btn.style.color = "#000";
        }
    });
});


// ===============================
// SMOOTH SCROLL FOR LINKS
// ===============================
document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});


// ===============================
// LAZY IMAGE LOAD (PERFORMANCE)
// ===============================
const images = document.querySelectorAll("img");

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.transition = "0.5s";
            img.style.opacity = "1";
            observer.unobserve(img);
        }
    });
});

images.forEach(img => {
    img.style.opacity = "0";
    imageObserver.observe(img);
});