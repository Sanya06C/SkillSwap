document.addEventListener("DOMContentLoaded", () => {
  const peers = [
    { name: "Aarav", skill: "DSA Mentor", animal: "cat" },
    { name: "Ira", skill: "Frontend Buddy", animal: "dog" },
    { name: "Yug", skill: "Java Learner", animal: "bear" },
    { name: "Saavi", skill: "UI/UX Designer", animal: "fox" }
  ];

  const grid = document.getElementById("peerGrid");

  if (!grid) {
    console.error("peerGrid not found");
    return;
  }

  peers.forEach((peer, index) => {
    const card = document.createElement("div");
    card.className = "peer-card";

    const imgUrl = `https://loremflickr.com/200/200/${peer.animal}?lock=${index}`;

    card.innerHTML = `
      <img src="${imgUrl}" alt="profile" />
      <h3>${peer.name}</h3>
      <p>${peer.skill}</p>
      <button>Connect</button>
    `;

    grid.appendChild(card);
  });
});
