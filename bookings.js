// 🔥 store data globally for sorting
let bookingsData = [];


// ===== LOAD BOOKINGS =====
async function loadBookings() {

  try {

    let res = await fetch("http://localhost:3000/admin/bookings");

    if (!res.ok) {
      throw new Error("Failed to fetch bookings");
    }

    bookingsData = await res.json(); // store data

    displayBookings(bookingsData); // show data

  } catch (err) {
    console.error("Error fetching bookings:", err);
    alert("Unable to load bookings. Check server.");
  }

}


// ===== DISPLAY BOOKINGS =====
function displayBookings(data){

  let table = document.getElementById("bookingsTable");
  table.innerHTML = "";

  data.forEach(booking => {

    let action = `<button onclick="cancelBooking(${booking.id})">Cancel</button>`;

    let row = `
    <tr>
      <td>${booking.id}</td>
      <td>${booking.user_id}</td>
      <td>${booking.ride_id}</td>
      <td>${booking.passenger_name}</td>
      <td>${booking.phone}</td>
      <td>${booking.email}</td>
      <td>${booking.seats_booked}</td>
      <td>${booking.total_amount}</td>
      <td>${booking.booking_time}</td>
      <td>${action}</td>
    </tr>
    `;

    table.innerHTML += row;

  });

}


// ===== SORT BY LATEST =====
function sortLatest(){
  let sorted = [...bookingsData].sort(
    (a, b) => new Date(b.booking_time) - new Date(a.booking_time)
  );
  displayBookings(sorted);
}


// ===== SORT BY OLDEST =====
function sortOldest(){
  let sorted = [...bookingsData].sort(
    (a, b) => new Date(a.booking_time) - new Date(b.booking_time)
  );
  displayBookings(sorted);
}


// ===== CANCEL BOOKING =====
function cancelBooking(id) {

  if (confirm("This ride booking has been cancelled by admin. Continue?")) {

    fetch("http://localhost:3000/admin/bookings/cancel/" + id, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {

      if (data.success) {
        alert("Booking cancelled successfully");
        loadBookings(); // reload updated data
      } else {
        alert("Error cancelling booking");
      }

    })
    .catch(err => {
      console.log(err);
      alert("Server error");
    });

  }

}


// ===== INITIAL LOAD =====
window.onload = loadBookings;