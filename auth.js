// ===== SLIDE CONTROLS =====
function showRegister() {
    document.getElementById("container")
        .classList.add("right-panel-active");
}

function showLogin() {
    document.getElementById("container")
        .classList.remove("right-panel-active");
}

// ===== SEND OTP =====
function registerUser() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const userid = document.getElementById("userid").value;
    const password = document.getElementById("password").value;

    if (!name || !email || !userid || !password) {
        alert("All fields required");
        return;
    }
    const strongRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if (!strongRegex.test(password)) {
    alert("Please enter a strong password!");
    return;
}

    fetch("http://localhost:3000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, userid, password })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(data => {
                alert(data.message);
                showLogin(); // already registered
                throw new Error("Stop");
            });
        }
        return res.json();
    })
    .then(data => {
        alert(data.message);

        document.getElementById("otp").style.display = "block";
        document.getElementById("verifyBtn").style.display = "block";

        const regBtn = document.getElementById("registerBtn");
        if (regBtn) regBtn.style.display = "none";

         const loginSwitch = document.getElementById("loginSwitch");
    if (loginSwitch) loginSwitch.style.display = "none";
    })
    .catch(err => console.log(err.message));
}



// ===== VERIFY OTP =====
function verifyOtp() {
    const otp = document.getElementById("otp").value;
    const email = document.getElementById("email").value;

    if (!otp) {
        alert("Enter OTP");
        return;
    }

    fetch("http://localhost:3000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(data => {
                alert(data.message || "Invalid OTP, try again");
                throw new Error("Invalid OTP");
            });
        }
        return res.json();
    })
    .then(data => {
        alert(data.message);
        window.location.href = "../home.html";
    })
    .catch(err => console.log(err.message));
}

// ===== LOGIN =====
function loginUser() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Email & password required");
        return;
    }

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(res => {
    if (!res.ok) {
        return res.json().then(data => {
            alert(data.message || "Invalid credentials");
            throw new Error("Login failed");
        });
    }
    return res.json();
})


.then(data => {
    alert(data.message);
    // ✅ Store logged-in user info in localStorage
    localStorage.setItem("loggedInUser", JSON.stringify({
        name: data.user.name,
        email: data.user.email,
        id: data.user.id, 
        userid: data.user.userid,
        role: data.user.role
    }));

    localStorage.setItem("user_id", data.user.id);
    if(data.user.role=="admin"){
         window.location.href = "../admin/admin.html"; // ✅ sirf VALID login pe
    }
    else{
         window.location.href = "../home.html"; // ✅ sirf VALID login pe
    }
})
.catch(err => console.log(err.message));

}
const nameInput = document.getElementById("name");
const errorMsg = document.getElementById("nameError");

nameInput.addEventListener("input", function () {
    const regex = /^[A-Za-z ]*$/;

    if (!regex.test(this.value)) {
        errorMsg.style.display = "block";
    } else {
        errorMsg.style.display = "none";
    }
});
const passwordInput = document.getElementById("password");
const passwordError = document.getElementById("passwordError");

passwordInput.addEventListener("input", function () {

    const strongRegex =
        
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (!strongRegex.test(this.value)) {
        passwordError.style.display = "block";
    } else {
        passwordError.style.display = "none";
    }
});
window.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.reset();
    }

    setTimeout(() => {

        const loginEmail = document.getElementById("loginEmail");
        const loginPassword = document.getElementById("loginPassword");

        if (loginEmail) loginEmail.value = "";
        if (loginPassword) loginPassword.value = "";

    }, 100);

});
function logout() {

    localStorage.clear();
    sessionStorage.clear();

    window.location.href = "authorization/auth.html";
}