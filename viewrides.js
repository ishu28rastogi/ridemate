async function loadRides(){

try{

let res = await fetch("http://localhost:3000/admin/rides");

let data = await res.json();

let table = document.getElementById("ridesTable");

table.innerHTML = "";

data.forEach(ride => {

let row = `
<tr>
<td>${ride.id}</td>
<td>${ride.pickup}</td>
<td>${ride.destination}</td>
<td>${ride.ride_date}</td>
<td>${ride.ride_time}</td>
<td>${ride.seats}</td>
<td>${ride.price_per_person}</td>
<td>${ride.phone}</td>
<td>
<button onclick="deleteRide(${ride.id})">Delete</button>
</td>
</tr>
`;

table.innerHTML += row;

});

}

catch(err){
console.log("Error fetching rides:", err);
}

}


// DELETE RIDE
function deleteRide(id){

if(confirm("Are you sure you want to delete this ride?")){

fetch("http://localhost:3000/admin/rides/" + id,{
method:"DELETE"
})
.then(res => res.json())
.then(data => {
alert("Ride deleted successfully");
loadRides();
})
.catch(err=>{
console.log(err);
});

}

}

window.onload = loadRides;
