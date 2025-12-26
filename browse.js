const mentorList = document.getElementById("mentorList");
const skillInput = document.getElementById("skillInput");

let mentors = [];

// ================= LOAD SKILLS =================
function loadSkills() {
  db.collection("skills").get().then(async (snapshot) => {
    mentors = [];

    for (const doc of snapshot.docs) {
      const skillData = doc.data();
      const mentorId = skillData.mentorId; // ✅ correct key

      const userDoc = await db.collection("users").doc(mentorId).get();
      if (!userDoc.exists) continue;

      const userData = userDoc.data();

      mentors.push({
        mentorId,
        mentorName: userData.name,
        mentorEmail: userData.email,
        branch: userData.branch,
        year: userData.year,
        skillName: skillData.skillName,
        days: skillData.days,
        time: skillData.time,
        description: skillData.description
      });
    }

    displayMentors(mentors);

    // 🔍 Search filter
    skillInput.addEventListener("input", () => {
      const value = skillInput.value.toLowerCase();
      const filtered = mentors.filter(m =>
        m.skillName.toLowerCase().includes(value)
      );
      displayMentors(filtered);
    });
  })
  .catch(err => console.error(err));
}

// ================= DISPLAY =================
function displayMentors(list) {
  mentorList.innerHTML = "";

  if (list.length === 0) {
    mentorList.innerHTML = "<p>No mentors found.</p>";
    return;
  }

  list.forEach(m => {
    const card = document.createElement("div");
    card.className = "mentor-card";

    card.innerHTML = `
      <h3>${m.skillName}</h3>

      <p><strong>Mentor:</strong> ${m.mentorName}</p>
      <p><strong>Email:</strong> ${m.mentorEmail}</p>
      <p><strong>Branch:</strong> ${m.branch}</p>
      <p><strong>Year:</strong> ${m.year}</p>

      <p><strong>Days:</strong> ${m.days}</p>
      <p><strong>Time:</strong> ${m.time}</p>
      <p><strong>Description:</strong> ${m.description}</p>

      <button onclick="sendRequest('${m.mentorId}', '${m.skillName}')">
        Request Mentor
      </button>
    `;

    mentorList.appendChild(card);
  });
}

// ================= SEND REQUEST =================
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

  const existing = await db.collection("requests")
    .where("from", "==", user.uid)
    .where("to", "==", mentorID)
    .where("skill", "==", skillName)
    .get();

  if (!existing.empty) {
    alert("You already requested this mentor for this skill!");
    return;
  }

  await db.collection("requests").add({
    from: user.uid,
    to: mentorID,
    skill: skillName,
    status: "pending",
    timestamp: new Date()
  });

  alert("Request sent successfully 🎉");
}

loadSkills();
