document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.querySelector(".profile-btn");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (profileBtn) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", () => {
      dropdownMenu.classList.remove("show");
    });
  }
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const profileLink = document.getElementById("profileLink");
  const loginLink   = document.getElementById("loginLink");
  const logoutLink  = document.getElementById("logoutLink");
  const historyLink = document.getElementById("historyLink");

  if (user) {
    profileLink.style.display = "block";
    historyLink.style.display = "block";
    logoutLink.style.display  = "block";
    loginLink.style.display   = "none";
  } else {
    profileLink.style.display = "none";
    historyLink.style.display = "none";
    logoutLink.style.display  = "none";
    loginLink.style.display   = "block";
  }

  // ================= SET MIN DATE =================
  const dateInput = document.getElementById("rideDate");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
  }

  // ================= SEARCH BUTTON =================
  const searchBtn = document.getElementById("searchBtn");

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {

      const pickup = document.getElementById("pickupInput").value.trim();
      const destination = document.getElementById("destinationInput").value.trim();
      const date = document.getElementById("rideDate").value;
      const passengers = document.getElementById("passengerInput").value;

      if (!pickup || !destination || !date) {
        alert("Please fill all fields");
        return;
      }

      window.location.href =
        `result.html?pickup=${pickup}&destination=${destination}&date=${date}&passengers=${passengers}`;
    });
  }

});

const rideCards = document.querySelectorAll(".ride-card");

rideCards.forEach(card => {

card.addEventListener("click", () => {

const pickup = card.dataset.pickup;
const destination = card.dataset.destination;

// redirect to results page
window.location.href =
`result.html?pickup=${pickup}&destination=${destination}`;

});

});async function getSuggestions(value) {

  const box = document.getElementById("suggestionsBox");

  if (!value) {
    box.innerHTML = "";
    return;
  }

  const res = await fetch(`http://localhost:3000/suggest?search=${value}`);
  const data = await res.json();

  box.innerHTML = "";

  data.forEach(item => {
    if(item.pickup.toLowerCase() === "banasthali") return;

    const div = document.createElement("div");
    div.innerText = item.pickup;

    div.onclick = () => {
      document.getElementById("pickupInput").value = item.pickup;
      box.innerHTML = "";
    };

    box.appendChild(div);
  });
}


async function getDestinationSuggestions(value) {

  const box = document.getElementById("destinationSuggestionsBox");

  if (!value) {
    box.innerHTML = "";
    return;
  }

  const res = await fetch(`http://localhost:3000/suggest-destination?search=${value}`);
  const data = await res.json();

  console.log(data);  // 🔥 add this

  box.innerHTML = "";

  data.forEach(item => {

    let location = item.destination?.trim();

    if (!location) return;
    if (location.toLowerCase() === "banasthali") return;

    const div = document.createElement("div");
    div.innerText = location;

    div.onclick = () => {
      document.getElementById("destinationInput").value = location;
      box.innerHTML = "";
    };

    box.appendChild(div);
  });
}
function openChatbot() {
  const popup = document.getElementById("chatbotPopup");
  popup.style.display = popup.style.display === "none" ? "block" : "none";
}