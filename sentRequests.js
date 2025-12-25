const sentList = document.getElementById("sentList");

function waitForAuth(callback) {
  const unsub = auth.onAuthStateChanged(user => {
    if (user) {
      unsub();
      callback(user);
    }
  });
}


function loadSentRequests(user) {
  db.collection("requests")
    .where("from", "==", user.uid)
    .orderBy("timestamp", "desc")
    .get()
    .then(async (snapshot) => {
      sentList.innerHTML = "";

      if (snapshot.empty) {
        sentList.innerHTML = "<p>You haven't sent any requests yet.</p>";
        return;
      }

      for (const doc of snapshot.docs) {
        const r = doc.data();

        // Fetch mentor info
        const mentorDoc = await db.collection("users").doc(r.to).get();
        const mentor = mentorDoc.data();

        const card = document.createElement("div");
        card.className = "mentor-card";

        card.innerHTML = `
          <h3>${r.skill}</h3>

          <p><strong>Mentor:</strong> ${mentor.name}</p>
          <p><strong>Email:</strong> ${mentor.email}</p>
          <p><strong>Branch:</strong> ${mentor.Branch}</p>
          <p><strong>Year:</strong> ${mentor.year}</p>

          <p><strong>Status:</strong>
            ${
              r.status === "pending"
                ? "⏳ Pending"
                : r.status === "accepted"
                ? "✔ Accepted"
                : "🏁 Completed"
            }
          </p>

          ${
            r.status === "accepted" || r.status === "completed"
              ? `<button onclick="openChat('${r.to}')">Chat</button>`
              : ""
          }
        `;

        sentList.appendChild(card);
      }
    })
    .catch(err => {
      console.error("Error loading sent requests:", err);
    });
}


waitForAuth(loadSentRequests);

// 🔥 CHAT REDIRECT FUNCTION
function openChat(otherUid) {
  window.location.href = `chat.html?uid=${otherUid}`;
}