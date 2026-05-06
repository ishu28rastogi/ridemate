function logoutUser() {
    // Clear stored user data
    localStorage.removeItem("loggedInUser"); // safe way, only logged-in user
    sessionStorage.clear(); // optional

    alert("You have been logged out successfully!");

    // Redirect to login page
    window.location.href = "../authorization/auth.html";
}

function cancelLogout() {
    // Go back to home page
    window.location.href = "../home.html";
}
