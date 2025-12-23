const mentorList = document.getElementById("mentorList");
const skillInput = document.getElementById("skillInput");

// Fetch all skills + mentor info
function loadSkills() {
  db.collection("skills").get().then(async (snapshot) => {
    const mentors = [];

    for (const doc of snapshot.docs) {
      const skillData = doc.data();
      const userID = skillData.userID;

      // Fetch mentor/user details
      const userDoc = await db.collection("users").doc(userID).get();
      const userData = userDoc.data();

      // Merge skill + user info together
      mentors.push({
        mentorName: userData.name,
        mentorEmail: userData.email,
        userID: userID,
        skillName: skillData.skillName,
        days: skillData.days,
        time: skillData.time,
        description: skillData.description
      });
    }

    // Show all mentors initially
    displayMentors(mentors);

    // Enable search filter
    skillInput.addEventListener("input", () => {
      const value = skillInput.value.toLowerCase();

      const filtered = mentors.filter(m =>
        m.skillName.toLowerCase().includes(value)
      );

      displayMentors(filtered);
    });
  })
  .catch(err => {
    console.error("Error loading skills:", err);
  });
}

// Display mentor cards
function displayMentors(mentors) {
  mentorList.innerHTML = "";

  if (mentors.length === 0) {
    mentorList.innerHTML = "<p>No mentors found.</p>";
    return;
  }

  mentors.forEach(m => {
    const card = document.createElement("div");
    card.className = "mentor-card";

    card.innerHTML = `
      <h3>${m.skillName}</h3>
      <p><strong>Mentor:</strong> ${m.mentorName}</p>
      <p><strong>Email:</strong> ${m.mentorEmail}</p>
      <p><strong>Days:</strong> ${m.days}</p>
      <p><strong>Time:</strong> ${m.time}</p>
      <p><strong>Description:</strong> ${m.description}</p>
      <button onclick="sendRequest('${m.userID}', '${m.skillName}')" id="btn-${m.userID}-${m.skillName}">Request Mentor</button>

    `;

    mentorList.appendChild(card);
  });
}

// Placeholder function (we will complete this in Request System)
function sendRequest(mentorID, skillName) {
  alert("Request system coming next!");
}

// Load everything when page opens
loadSkills();

async function sendRequest(mentorID, skillName) {
  const user = auth.currentUser;

  if (!user) {
    alert("Please login first.");
    return;
  }

  if (user.uid === mentorID) {
    alert("You cannot request yourself.");
    return;
  }

  // 1️⃣ Check if request already exists
  const existing = await db.collection("requests")
    .where("from", "==", user.uid)
    .where("to", "==", mentorID)
    .where("skill", "==", skillName)
    .get();

  if (!existing.empty) {
    alert("You already requested this mentor for this skill! Check Sent Requests.");
    return;
  }

  // 2️⃣ Create new request
  db.collection("requests").add({
    from: user.uid,
    to: mentorID,
    skill: skillName,
    status: "pending",
    timestamp: new Date()
  })
  .then(() => {
    alert("Your request has been sent! 🎉");
  })
  .catch(error => {
    alert("Error: " + error.message);
  });
}
