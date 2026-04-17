const form = document.getElementById("signupForm");

form.addEventListener("submit", function(e){
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const userError = document.getElementById("userError");
    const emailError = document.getElementById("emailError");
    const passError = document.getElementById("passError");

    userError.textContent = " ";
    emailError.textContent = " ";
    passError.textContent = " ";

    let isValid = true;

    if(username === ""){
        userError.textContent = "Username is Required!";
        userError.style.color = "red";
        isValid = false;
    }

    if(!email.includes("@")){
        emailError.textContent = "Enter Valid Email!";
        emailError.style.color = "red";
        isValid = false;
    }

    if(password.length < 6){
        passError.textContent = "Password must be at least 6 characters!";
        passError.style.color = "red";
        isValid = false;
    }

    if(isValid){
        alert("Signup Successfully!");
    }

    console.log("Username: ", username);
    console.log("Email: ", email);
})
function genCap(){
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQUVWXYZ0123456789!@#$%^&*()_+\"'<>";
    let password = "";
    for(let i=0; i<16; i++){
        let randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    document.getElementById("pass").value = password;
}