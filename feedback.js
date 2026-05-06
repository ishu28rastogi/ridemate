async function loadFeedback(){

try{

let res = await fetch("http://localhost:3000/admin/feedback");

if(!res.ok){
throw new Error("Failed to fetch feedback");
}

let data = await res.json();

let table = document.getElementById("feedbackTable");

table.innerHTML = "";

data.forEach(fb => {

let row = `
<tr>
<td>${fb.id}</td>
<td>${fb.user_name}</td>
<td>${fb.pickup} → ${fb.destination}</td>
<td>${fb.rating} ⭐</td>
<td>${fb.comment || "No comment"}</td>
<td>${fb.created_at}</td>
</tr>
`;

table.innerHTML += row;

});

}

catch(err){
console.log("Error:", err);
alert("Feedback load nahi ho raha");
}

}

window.onload = loadFeedback;