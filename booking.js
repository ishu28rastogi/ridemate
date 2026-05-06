const params = new URLSearchParams(window.location.search);
const rideId = params.get("rideId");
const passengersCount = Number(params.get("passengers"));
const userId = localStorage.getItem("user_id");
fetch(`http://localhost:3000/api/rides/${rideId}`)
  .then(res => res.json())
  .then(data => {
    const ride = data[0];
    document.getElementById("route").innerText = ride.pickup + " → " + ride.destination;
    const date = new Date(ride.ride_date);
    document.getElementById("date").innerText = date.toLocaleDateString();
    const time = new Date("1970-01-01T" + ride.ride_time);
document.getElementById("time").innerText =
time.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
document.getElementById("rideTotal").innerText = ride.total_price;
    document.getElementById("price").innerText = ride.price_per_person;
    document.getElementById("passengers").innerText = passengersCount;
    document.getElementById("driverPhone").innerText = ride.phone; 
    document.getElementById("vehicleNo").innerText = ride.vehicle_no;
    document.getElementById("total").innerText = Number(ride.price_per_person) * passengersCount;
    const form = document.getElementById("passengerForm");
    for (let i = 1; i <= passengersCount; i++) {
      const tile = document.createElement("div");
      tile.classList.add("passengerTile");
      tile.innerHTML = `
        <button type="button" class="tileHeader">
          Passenger ${i} <span class="arrow">▼</span>
        </button>
        <div class="tileBody">
          <input type="text" class="nameInput" placeholder="Name" required>
          <input type="tel" class="phoneInput" placeholder="Phone" pattern="[6-9]{1}[0-9]{9}" required>
          <input type="email" class="emailInput" placeholder="Email" required>
        </div>
      `;
      const header = tile.querySelector(".tileHeader");
      const body = tile.querySelector(".tileBody");
      const arrow = tile.querySelector(".arrow");
      body.style.display = "none"; 
      header.addEventListener("click", () => {
        const allBodies = document.querySelectorAll(".tileBody");
        const allArrows = document.querySelectorAll(".tileHeader .arrow");
        allBodies.forEach(b => (b.style.display = "none"));
        allArrows.forEach(a => (a.style.transform = "rotate(0deg)"));
        body.style.display = "block";
        arrow.style.transform = "rotate(180deg)";
      });
      form.appendChild(tile);
    }
  })
  .catch(err => console.log("Error fetching ride:", err));
function confirmBooking() {
  if (!userId) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }
  const names = document.querySelectorAll(".nameInput");
  const phones = document.querySelectorAll(".phoneInput");
  const emails = document.querySelectorAll(".emailInput");
  const nameRegex = /^[A-Za-z ]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@banasthali\.in$/;
  const passengerArray = [];
  for (let i = 0; i < names.length; i++) {
    if (!nameRegex.test(names[i].value)) {
      alert(`Passenger ${i + 1} Name should contain only alphabets`);
      names[i].focus();
      return;
    }
    if (!phoneRegex.test(phones[i].value)) {
      alert(`Passenger ${i + 1} Enter valid phone number`);
      phones[i].focus();
      return;
    }
    if (!emailRegex.test(emails[i].value)) {
      alert(`Passenger ${i + 1} Use only @banasthali.in email`);
      emails[i].focus();
      return;
    }
    passengerArray.push({
      name: names[i].value,
      phone: phones[i].value,
      email: emails[i].value
    });
  }
  fetch("http://localhost:3000/api/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ride_id: rideId,
      user_id: userId,
      passengers: passengerArray,
      total_amount: document.getElementById("total").innerText
    })
  })
    .then(res => res.json())
    .then(data => {
  if (data.message === "Booking successful ✅") {
    alert("Booking successful ✅");
    window.location.href = "/frontend/home.html";   

  } else {
    alert(data.message);
  }
    })
    .catch(err => console.log("Booking error:", err));
}