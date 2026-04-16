const form = document.getElementById("signupForm");

form.addEventListener("submit", function(e){
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const userError = document.getElementById("userError");
    const emailError = document.getElementById("emailError");
    const passError = document.getElementById("passError");

    // Clear previous errors
    userError.textContent = "";
    emailError.textContent = "";
    passError.textContent = "";

    let isValid = true;

    if(username === ""){
        userError.textContent = "Username is Required!";
        userError.style.color = "#ef4444"; // Using a slightly softer Tailwind red
        isValid = false;
    }

    if(!email.includes("@")){
        emailError.textContent = "Enter Valid Email!";
        emailError.style.color = "#ef4444";
        isValid = false;
    }

    if(password.length < 6){
        passError.textContent = "Password must be at least 6 characters!";
        passError.style.color = "#ef4444";
        isValid = false;
    }

    if(isValid){
        alert("Signup Successfully!");
        // Optional: form.reset(); to clear the form after success
        window.location.href = '../pages/login.html'; 
    }

    console.log("Username: ", username);
    console.log("Email: ", email);
});

function genCap(){
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+\"'<>";
    let generatedPass = "";
    
    for(let i = 0; i < 16; i++){
        let randomIndex = Math.floor(Math.random() * chars.length);
        generatedPass += chars[randomIndex];
    }

    // Fill the visual suggestion box
    document.getElementById("pass").value = generatedPass;
    
    // Automatically fill the actual password input so the user doesn't have to copy-paste
    document.getElementById("password").value = generatedPass;
}