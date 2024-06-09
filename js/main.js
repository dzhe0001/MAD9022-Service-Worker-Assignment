let registration = null;
window.addEventListener("load", registerSW);

document.addEventListener("DOMContentLoaded", async () => {
  //listen for navigation popstate event
  window.addEventListener("popstate", (e) => {
    const uid = location.hash.slice(1);
    showCards(uid);
    sendMessageToSW(uid);
  });

  //get the data for the page
  showCards();

  //add click listener to #cards
  document.getElementById("cards").addEventListener("click", handleCardClicks);
});

async function registerSW() {
  if ("serviceWorker" in navigator) {
    try {
      registration = await navigator.serviceWorker.register("/sw.js");

      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }

      navigator.serviceWorker.addEventListener("message", receiveMessageFromSW);
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
}

async function getData() {
  return await fetch("https://random-data-api.com/api/v2/users?size=20")
    .then((resp) => {
      if (!resp.ok) {
        throw new Error("Failed to fetch data");
      }
      return resp.json();
    })
    .catch((err) => {
      alert("Failed to fetch data");
      console.error(err);
    });
}

function handleCardClicks(e) {
  if (!e.target.classList.contains("card")) return;

  const uid = e.target.getAttribute("data-uid");

  location.href = `#${uid}`;
}

async function showCards(filter = false) {
  let data = await getData();
  const cards = document.getElementById("cards");
  const df = new DocumentFragment();

  if (filter) {
    data = data.filter((user) => user.uid === filter);
  }

  data.forEach((user) => {
    const card = document.createElement("li");
    card.classList = "card";
    card.style = `--background-img: url('${user.avatar}');`;
    card.setAttribute("data-uid", user.uid);

    card.innerHTML = `<div class="card__content">
      <h3 class="card__title">${user.first_name} ${user.last_name}</h3>
      <p class="card__text">${user.email}</p>
    </div>`;

    df.appendChild(card);
  });

  cards.innerHTML = "";
  cards.appendChild(df);
}

function sendMessageToSW(data) {
  registration.active.postMessage({ uid: data, colour: generateRandomHexColor() });
}

function receiveMessageFromSW(e) {
  showCards(e.data.uid);
  document.querySelector("header").style.background = e.data.colour;
}

function generateRandomHexColor() {
  //source: https://g.co/gemini/share/b2fc54d500d8
  const hexDigits = "0123456789ABCDEF";

  let hexColor = "#";
  for (let i = 0; i < 6; i++) {
    hexColor += hexDigits.charAt(Math.floor(Math.random() * 16));
  }

  return hexColor;
}
