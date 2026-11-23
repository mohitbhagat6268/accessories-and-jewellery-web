
import { auth } from "../firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Protect pages that require login
export function requireAuth(redirectUrl = "../pages/login.html") {

    onAuthStateChanged(auth, (user) => {

        if (!user) {
            window.location.href = redirectUrl;
        }

    });

}

// Check whether the user is logged in
export function checkLogin(callback) {

    onAuthStateChanged(auth, (user) => {
        callback(user);
    });

}
done