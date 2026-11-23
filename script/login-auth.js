
import { auth } from "../firebase-config.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const button = loginForm.querySelector('button[type="submit"]');

    let message = document.getElementById("loginMessage");

    if (!message) {
        message = document.createElement("p");
        message.id = "loginMessage";
        message.className = "text-xs text-center mt-3";
        loginForm.appendChild(message);
    }

    try {
        button.disabled = true;
        button.textContent = "Signing In...";

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        message.textContent = "Login successful!";
        message.style.color = "#4ADE80";

        console.log("Logged in user:", userCredential.user.uid);

        setTimeout(() => {
            window.location.href = "../index.html";
        }, 1000);

    } catch (error) {
        console.error("Login error:", error);

        const errors = {
            "auth/invalid-credential": "Incorrect email or password.",
            "auth/user-not-found": "Account not found.",
            "auth/wrong-password": "Incorrect password.",
            "auth/invalid-email": "Please enter a valid email."
        };

        message.textContent =
            errors[error.code] || "Login failed. Please try again.";

        message.style.color = "#F87171";

        button.disabled = false;
        button.textContent = "Sign In";
    }
});
