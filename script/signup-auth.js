
import { auth } from "../firebase-config.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const button = signupForm.querySelector('button[type="submit"]');

    // Create a message area
    let message = document.getElementById("signupMessage");

    if (!message) {
        message = document.createElement("p");
        message.id = "signupMessage";
        message.className = "text-xs text-center mt-3";
        signupForm.appendChild(message);
    }

    if (password.length < 6) {
        message.textContent = "Password must contain at least 6 characters.";
        message.style.color = "#F87171";
        return;
    }

    try {
        button.disabled = true;
        button.textContent = "Creating Account...";
        message.textContent = "Please wait...";
        message.style.color = "#BEABA7";

        // Create Firebase account
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Save user's name in Firebase Authentication profile
        await updateProfile(userCredential.user, {
            displayName: name
        });

        message.textContent = "Account created successfully!";
        message.style.color = "#4ADE80";

        // Redirect to login page
        setTimeout(() => {
            window.location.href = "./login.html";
        }, 1500);

    } catch (error) {
        console.error("Signup error:", error);

        const errors = {
            "auth/email-already-in-use": "This email is already registered.",
            "auth/invalid-email": "Please enter a valid email address.",
            "auth/weak-password": "Please choose a stronger password.",
            "auth/network-request-failed": "Network error. Check your internet."
        };

        message.textContent =
            errors[error.code] || "Registration failed. Please try again.";

        message.style.color = "#F87171";

        button.disabled = false;
        button.textContent = "Sign Up";
    }
});
