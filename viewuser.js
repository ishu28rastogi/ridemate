async function loadUsers() {

try{

let res = await fetch("http://localhost:3000/admin/users");

let data = await res.json();

let table = document.getElementById("usersTable");

table.innerHTML = "";

data.forEach(user => {

let row = `
<tr>
<td>${user.id}</td>
<td>${user.name}</td>
<td>${user.email}</td>
<td>${user.role || "user"}</td>
<td>
<button onclick="deleteUser(${user.id})">Delete</button>
</td>
</tr>
`;

table.innerHTML += row;

});

}

catch(err){
console.log("Error loading users:", err);
}

}


// DELETE USER
function deleteUser(id){

if(confirm("Are you sure you want to delete this user?")){

fetch("http://localhost:3000/admin/users/" + id,{
method:"DELETE"
})
.then(res => res.json())
.then(data=>{
alert("User deleted successfully");
loadUsers();
});

}

}


// LOAD USERS WHEN PAGE OPENS
window.onload = loadUsers;