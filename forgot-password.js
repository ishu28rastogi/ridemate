let currentEmail = "";
let verifiedOTP = false;

function sendOTP() {
  const email = document.getElementById("emailInput").value.trim();

  if (!email) {
    alert("Enter email");
    return;
  }

  fetch("http://localhost:3000/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
  .then(res => {
    if (!res.ok) {
      return res.json().then(data => {
        alert(data.message || "Email not registered");
        throw new Error("Failed");
      });
    }
    return res.json();
  })
  .then(data => {
    alert(data.message);
    currentEmail = email;

    document.getElementById("step-email").classList.add("hidden");
    document.getElementById("step-otp").classList.remove("hidden");
  })
  .catch(err => console.log(err.message));
}

function verifyOTP() {
  const otp = document.getElementById("otpInput").value.trim();

  if (!otp) {
    alert("Enter OTP");
    return;
  }

  // OTP verification happens again in reset-password
  verifiedOTP = otp;

  document.getElementById("step-otp").classList.add("hidden");
  document.getElementById("step-reset").classList.remove("hidden");
}

function resetPassword() {
  const newPass = document.getElementById("newPassword").value;
  const confirmPass = document.getElementById("confirmPassword").value;

  if (!newPass || !confirmPass) {
    alert("Fill all fields");
    return;
  }

  if (newPass !== confirmPass) {
    alert("Passwords do not match");
    return;
  }

  fetch("http://localhost:3000/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: currentEmail,
      otp: verifiedOTP,
      newPassword: newPass
    })
  })
  .then(res => {
    if (!res.ok) {
      return res.json().then(data => {
        alert(data.message || "Reset failed");
        throw new Error("Reset failed");
      });
    }
    return res.json();
  })
  .then(data => {
    alert(data.message);
    window.location.href = "./auth.html";
  })
  .catch(err => console.log(err.message));
}

