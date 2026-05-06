document.getElementById("createRideBtn").addEventListener("click", async () => {
 e.preventDefault(); 
  const formData = new FormData();
  formData.append("pickup", pickup.value);
  formData.append("destination", destination.value);
  formData.append("date", date.value);
  formData.append("time", time.value);
  formData.append("seats", seats.value);
  formData.append("car_seater", car_type.value);
  formData.append("total_price", total_price.value);
  formData.append("price_per_person", price_per_person.value);
  formData.append("phone", phone.value);
  formData.append("vehicle_no", vehicle_no.value);
  formData.append("licence", licence.files[0]);
  formData.append("user_id", user_id.value);
  try {
    const res = await fetch("http://localhost:3000/create-ride", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      alert("Ride Created Successfully ✅");
      window.location.href = "../home.html";
      document.getElementById("rideForm").reset();
    } else {
      alert(data.message || "DB Error ❌");
    }
  } catch (err) {
    console.error(err);
    alert("Server Error ❌");
  }
});


