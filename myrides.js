console.log("MY RIDES JS LOADED"); // 🔥 proof

const container = document.getElementById("ridesContainer");

// 1️⃣ login check
const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user || !user.id) {
  alert("Please login first");
  window.location.href = "../authorization/auth.html";
} else {
  loadMyRides(user.id);
}

// 2️⃣ fetch rides
function loadMyRides(userId) {
  fetch(`http://localhost:3000/my-rides?user_id=${userId}`)
    .then(res => res.json())
    .then(data => {
      if (!data.success || data.rides.length === 0) {
        container.innerHTML =
          "<p class='empty'>You have not created any rides yet 🚗</p>";
        return;
      }

      data.rides.forEach(ride => {
        const div = document.createElement("div");
        div.className = "ride";
        div.innerHTML = `
          <h3>${ride.pickup} → ${ride.destination}</h3>
          <p><b>Date:</b> ${ride.ride_date}</p>
          <p><b>Time:</b> ${ride.ride_time}</p>
          <p><b>Seats Available:</b> ${ride.seats}</p>
        `;
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML =
        "<p class='empty'>Server error ❌</p>";
    });
}
