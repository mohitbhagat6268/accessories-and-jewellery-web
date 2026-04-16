    document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop form from refreshing the page
        
        let isValid = true;
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // Simple Email Regex
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validate Email
        if (!emailPattern.test(emailValue)) {
            showError(emailInput);
            isValid = false;
        } else {
            removeError(emailInput);
        }

        // Validate Password (min 6 chars)
        if (passwordValue.length < 6) {
            showError(passwordInput);
            isValid = false;
            if(passwordValue.length === 0) {
                console.log("Password is required");
            } else {
                alert("Password must be at least 6 characters.");
            }
        } else {
            removeError(passwordInput);
        }

        if (isValid) {
            // Success State 
            const btn = loginForm.querySelector('button[type="submit"]');
            const originalBtnText = btn.innerText; // Store original text
            
            btn.innerText = "Authenticating...";
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            
            console.log("Form Submitted Successfully:", { email: emailValue });
            
            // Simulate a delay for login
            setTimeout(() => {
                alert("Welcome back to Aura Jewels!");
                // If login fails in a real app, you would reset the button like this:
                // btn.innerText = originalBtnText;
                // btn.disabled = false;
                // btn.classList.remove('opacity-50', 'cursor-not-allowed');
                
                window.location.href = '../index.html'; 
                
            }, 1500);
        }
    });

    function showError(input) {
        input.classList.add('border-red-500');
        input.classList.remove('border-brand-subtext/30');
    }

    function removeError(input) {
        input.classList.remove('border-red-500');
        input.classList.add('border-brand-subtext/30');
    }
});