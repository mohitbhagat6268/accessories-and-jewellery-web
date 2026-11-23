
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#loginForm');
    const emailInput = document.querySelector('#loginEmail');
    const passwordInput = document.querySelector('#loginPassword');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        let isValid = true;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(emailValue)) {
            showError(emailInput);
            isValid = false;
        } else {
            removeError(emailInput);
        }

        if (passwordValue.length < 6) {
            showError(passwordInput);
            isValid = false;
            alert("Password must be at least 6 characters.");
        } else {
            removeError(passwordInput);
        }

        if (!isValid) {
            return;
        }

        // Firebase authentication will handle login.
        console.log("Form validation successful.");
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
