document.getElementById("createRideBtn").addEventListener("click", () => {

  const data = {
    pickup: document.getElementById("pickup").value,
    destination: document.getElementById("destination").value,
    ride_date: document.getElementById("date").value,
    ride_time: document.getElementById("time").value,
    seats: Number(document.getElementById("seats").value),
    total_price: Number(document.getElementById("total_price").value),
    price_per_person: Number(document.getElementById("price_per_person").value),
    phone: document.getElementById("phone").value,
    vehicle_no: document.getElementById("vehicle_no").value,
    user_id: Number(document.getElementById("user_id").value)
  };

  fetch("http://localhost:3000/createRide", {   // 🔥 MAIN FIX
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(result => {
    alert(result.message);
  })
  .catch(err => {
    console.error("Fetch Error:", err);
    alert("Error ❌");
  });

});
