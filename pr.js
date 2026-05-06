
// Get logged-in user from localStorage
const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (user) {
    const nameInput = document.getElementById("name");
    const hostelInput = document.getElementById("hostel");
    const emailInput = document.getElementById("email");

    nameInput.value = user.name;
    hostelInput.value = user.userid;
    emailInput.value = user.email;

    // ✅ Make them read-only
    nameInput.readOnly = true;
    hostelInput.readOnly = true;
    emailInput.readOnly = true;
} else {
    alert("No user logged in");
    window.location.href = "../authorization/auth.html";
}
