async function loadDashboard(){

try{

let res = await fetch("http://localhost:3000/admin/dashboard");

if(!res.ok){
throw new Error("Failed to fetch dashboard data");
}

let data = await res.json();


// ===== DASHBOARD CARDS =====
document.getElementById("totalUsers").innerText = data.totalUsers;
document.getElementById("totalRides").innerText = data.totalRides;
document.getElementById("totalBookings").innerText = data.totalBookings;


// ===== RECENT RIDES TABLE =====
let table = document.getElementById("ridesTable");

table.innerHTML = "";

data.rides.forEach(ride => {

let row = `
<tr>
<td>${ride.id}</td>
<td>${ride.pickup}</td>
<td>${ride.destination}</td>
<td>${ride.ride_date}</td>
<td>${ride.seats}</td>
</tr>
`;

table.innerHTML += row;

});

}

catch(err){

console.error("Dashboard error:", err);
alert("Failed to load dashboard data");

}

}


// ===== SIDEBAR NAVIGATION =====

document.getElementById("viewUsersBtn").onclick = function(){
window.location.href = "viewuser.html";
};

document.getElementById("viewRidesBtn").onclick = function(){
window.location.href = "viewrides.html";
};

document.getElementById("bookingsBtn").onclick = function(){
window.location.href = "bookings.html";
};


document.getElementById("feedbackBtn").onclick = function(){
    window.location.href = "feedback.html";
};
// ===== LOAD DASHBOARD ON PAGE OPEN =====

window.onload = loadDashboard;

