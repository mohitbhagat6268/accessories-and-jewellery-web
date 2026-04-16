window.onload = function() {
    const hour = new Date().getHours();
    let greet = "";

    if (hour < 12) {
        greet = "Good Morning ☀️";
    } else if (hour < 18) {
        greet = "Good Afternoon 🌤️";
    } else {
        greet = "Good Evening 🌙";
    }

    alert(`${greet}! ✨ Welcome to our Jewelry Contact Page 💎`);
};

document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

    alert("✅ Your message has been sent successfully!");
    this.reset();
});

// --- ENHANCED STAR RATING ---
const stars = document.querySelectorAll("#starContainer span");
const ratingInput = document.getElementById("rating");

stars.forEach(star => {
    star.addEventListener("click", function () {
        const value = this.getAttribute("data-value");
        ratingInput.value = value;

        stars.forEach(s => {
            if (s.getAttribute("data-value") <= value) {
                s.textContent = "★";
                // Adds your hover maroon color to filled stars
                s.classList.add("text-brand-hover"); 
                s.classList.remove("text-brand-subtext/50");
            } else {
                s.textContent = "☆";
                // Reverts back to faded color for empty stars
                s.classList.remove("text-brand-hover");
                s.classList.add("text-brand-subtext/50");
            }
        });
    });
});

const form = document.getElementById("surveyForm");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const gender = document.getElementById("gender").value;
    const budget = document.getElementById("budget").value;
    const message = document.getElementById("message").value;
    const rating = ratingInput.value;

    const jewelry = document.querySelector('input[name="jewelry"]:checked');

    if (!name || !gender || !jewelry || rating == 0) {
        alert("⚠️ Please fill all required fields & rating!");
        return;
    }

    alert(
        `✅ Thank you ${name}!\n` +
        `Preference: ${jewelry.value}\n` +
        `Rating: ${rating} ⭐`
    );

    form.reset();

    // Reset stars back to default empty state
    stars.forEach(s => {
        s.textContent = "☆";
        s.classList.remove("text-brand-hover");
        s.classList.add("text-brand-subtext/50");
    });
    ratingInput.value = 0;
});