const requestList = document.getElementById("requestList");

// Wait for Firebase Auth to load the user
function waitForAuth(callback) {
  const unsub = auth.onAuthStateChanged(user => {
    if (user) {
      unsub();
      callback(user);
    }
  });
}

// Load mentor requests
function loadRequests(user) {
  console.log("Logged in as mentor UID:", user.uid);

  db.collection("requests")
    .where("to", "==", user.uid)
    .orderBy("timestamp", "desc")
    .get()
    .then(async (snapshot) => {
      requestList.innerHTML = "";

      if (snapshot.empty) {
        requestList.innerHTML = "<p>No requests yet.</p>";
        return;
      }

      for (const doc of snapshot.docs) {
        const r = doc.data();

        // Fetch learner info
        const learnerDoc = await db.collection("users").doc(r.from).get();
        const learner = learnerDoc.data();

        const card = document.createElement("div");
        card.className = "mentor-card";

        // --- FIXED TEMPLATE LITERAL ---
        card.innerHTML = `
          <h3>${r.skill}</h3>

          <p><strong>Learner:</strong> ${learner.name}</p>
          <p><strong>Email:</strong> ${learner.email}</p>
          <p><strong>Branch:</strong> ${learner.Branch}</p>
          <p><strong>Year:</strong> ${learner.year}</p>

          <p><strong>Status:</strong> ${r.status}</p>

          ${
            r.status === "accepted" || r.status === "completed"
              ? `<button onclick="openChat('${doc.id}')">Chat</button>`
              : ""
          }


          ${
            r.status === "pending"
              ? `<button onclick="acceptRequest('${doc.id}', '${r.from}')">Accept</button>`
              : r.status === "accepted"
              ? `<button onclick="completeRequest('${doc.id}', '${r.from}')">Mark Completed</button>`
              : `<p class="accepted-label">✔ Completed</p>`
          }
        `;

        requestList.appendChild(card);
      }
    })
    .catch(err => {
      console.error("Error loading requests:", err);
    });
}

// Accept request + give points
function acceptRequest(requestID, learnerID) {
  const mentor = auth.currentUser;

  if (!mentor) return;

  const mentorRef = db.collection("users").doc(mentor.uid);
  const requestRef = db.collection("requests").doc(requestID);

  const batch = db.batch();

  batch.update(requestRef, { status: "accepted" });
  batch.update(mentorRef, { points: firebase.firestore.FieldValue.increment(20) });

  batch.commit().then(() => {
    alert("Request accepted! +20 points earned 🎉");
    waitForAuth(loadRequests);
  });
}

// Start: wait for auth, then load requests
waitForAuth(loadRequests);


function completeRequest(requestID, learnerID) {
  const mentor = auth.currentUser;
  if (!mentor) return;

  const learnerRef = db.collection("users").doc(learnerID);
  const requestRef = db.collection("requests").doc(requestID);

  const batch = db.batch();

  batch.update(requestRef, { status: "completed" });
  batch.update(learnerRef, { points: firebase.firestore.FieldValue.increment(10) });

  batch.commit().then(async () => {

  

  alert("Request accepted! +20 points earned 🎉");
  waitForAuth(loadRequests);
});

}

function openChat(requestId) {
  window.location.href = `chat.html?chatId=${requestId}`;
}

