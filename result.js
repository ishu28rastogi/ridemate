const ridesList = document.getElementById("ridesList");
const noRideBox = document.getElementById("noRideBox");
let currentRides = [];
document.getElementById("searchAgainBtn").addEventListener("click", searchRides);
document.getElementById("applySortBtn").addEventListener("click", applySort);
async function searchRides() {
  const pickup = document.getElementById("pickupInput").value.trim();
  const destination = document.getElementById("destinationInput").value.trim();
  const date = document.getElementById("dateInput").value;
  const passengers = document.getElementById("passengerInput").value;
  if (!pickup || !destination || !date) {
    alert("Please fill pickup, destination and date");
    return;
  }
  try {
    const response = await fetch(
      `http://localhost:3000/search-rides?pickup=${pickup}&destination=${destination}&date=${date}&passengers=${passengers}`
    );
    const data = await response.json();
    ridesList.innerHTML = "";
    if (!data.success || data.rides.length === 0) {
      noRideBox.style.display = "block";
      return;
    }
    noRideBox.style.display = "none";
    currentRides = data.rides;
    displayRides(currentRides);
  } catch (error) {
    console.log("SEARCH ERROR:", error);
  }
}
function displayRides(rides) {
  ridesList.innerHTML = "";
  rides.forEach(ride => {
    const card = document.createElement("div");
    card.className = "ride-card";
        const date = new Date(ride.ride_date);
const formattedDate = date.toLocaleDateString("en-IN");
    card.innerHTML = `
      <div>
        <div class="route">${ride.pickup} → ${ride.destination}</div>
        <div class="time">${formattedDate} | ${ride.ride_time}</div>
        <div>Seats: ${ride.seats}</div>
      </div>
      <div>
        <div class="price">₹${ride.price_per_person}</div>
        <button class="book-btn" onclick="bookRide(${ride.id})">Book</button>
      </div>
    `;
    ridesList.appendChild(card);
  });
}
function applySort() {
  const sortValue = document.querySelector('input[name="sort"]:checked').value;
  if (sortValue === "price") {
    currentRides.sort((a, b) => a.price_per_person - b.price_per_person);
  }
  else if (sortValue === "seats") {
    currentRides.sort((a, b) => b.seats - a.seats);
  }
  else if (sortValue === "time") {
    currentRides.sort((a, b) => a.ride_time.localeCompare(b.ride_time));
  }
  displayRides(currentRides);
}
function bookRide(rideId) {
  const user = localStorage.getItem("loggedInUser");
  if (!user) {
    alert("You are not logged in. Please login first.");
    return;
  }
  const passengers = document.getElementById("passengerInput").value;
  window.location.href =
    `booking.html?rideId=${rideId}&passengers=${passengers}`;
}
window.onload = function () {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("dateInput").min = today;
  const params = new URLSearchParams(window.location.search);
  const pickup = params.get("pickup");
  const destination = params.get("destination");
  const date = params.get("date");
  const passengers = params.get("passengers");
  if (pickup) document.getElementById("pickupInput").value = pickup;
  if (destination) document.getElementById("destinationInput").value = destination;
  if (date) document.getElementById("dateInput").value = date;
  if (passengers) document.getElementById("passengerInput").value = passengers;
  if (pickup && destination && date) {
    searchRides();
  }
}
const params = new URLSearchParams(window.location.search);
const pickup = params.get("pickup");
const destination = params.get("destination");
if(pickup){
document.getElementById("pickupInput").value = pickup;
}
if(destination){
document.getElementById("destinationInput").value = destination;
};
