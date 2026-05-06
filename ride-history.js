const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
  window.location.href = "login.html";
}

const email = user.email;


// TAB SWITCH
function showTab(tabName, event) {

  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.classList.remove("active");
  });

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  document.getElementById(tabName).classList.add("active");

  event.target.classList.add("active");
}


// LOAD RIDE HISTORY
async function loadRideHistory() {

  try {

    const res = await fetch(
      `http://localhost:3000/ride-history?email=${email}`
    );

    const data = await res.json();

    if (!data.success) {
      alert("Error loading ride history");
      return;
    }

    displayRides(data.upcoming, "upcomingList", "upcoming");
    displayRides(data.completed, "completedList", "completed");
    displayRides(data.created, "createdList", "created");

  } catch (err) {

    console.log("Ride history error:", err);

  }

}


// DISPLAY RIDES
function displayRides(rides, containerId, type) {

  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!rides || rides.length === 0) {
    container.innerHTML = `<p>No rides found</p>`;
    return;
  }

  rides.forEach(ride => {

    const card = document.createElement("div");
    card.className = "ride-card";

    const date = new Date(ride.ride_date);
    const formattedDate = date.toLocaleDateString("en-IN");

    let buttons = "";

    // UPCOMING
    if (type === "upcoming") {

      buttons = `
        <button class="cancel-btn" onclick="cancelRide(${ride.id})">
          Cancel Ride
        </button>
      `;
    }

    // COMPLETED
    if (type === "completed") {

  buttons = `
    <button class="feedback-btn" onclick="openRating(${ride.id})">
      Rate ⭐
    </button>
  `;
}

    

    card.innerHTML = `

    <div class="ride-left">

      <div class="route">
        ${ride.pickup} → ${ride.destination}
      </div>

      <div class="info">
        ${formattedDate} | ${ride.ride_time}
      </div>

    </div>

    <div class="ride-right">

      <div class="price">
        ₹${ride.price_per_person}
      </div>

      ${buttons}

    </div>
    `;

    container.appendChild(card);

  });

}

// PAGE LOAD
window.onload = function () {
history.pushState(null, null, location.href);
  loadRideHistory();

};


// ===== CANCEL REDIRECT =====
function cancelRide(rideId) {

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  fetch(`http://localhost:3000/ride-passengers?ride_id=${rideId}&user_id=${user.id}`)
    .then(res => res.json())
    .then(data => {

      if (!data.success) {
        alert("Error fetching bookings");
        return;
      }

      const passengers = data.passengers;

      // only 1 booking
      if (passengers.length === 1) {

        if (!confirm("Cancel this ride?")) return;

        fetch("http://localhost:3000/cancel-ride", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ride_id: rideId,
            user_id: user.id,
            booking_ids: [passengers[0].id]
          })
        })
        .then(res => res.json())
        .then(result => {

          if (result.success) {
            alert("Ride cancelled");
            window.location.reload();
          } else {
            alert(result.message);
          }

        });
      }
      else {
        window.location.href = `cancel.html?ride_id=${rideId}`;
      }
    });
}
function openRating(ride_id) {
  window.location.href = `/frontend/rating.html?ride_id=${ride_id}`;
}
window.onpopstate = function () {
  window.location.href = "home.html";
};