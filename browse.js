const mentorList = document.getElementById("mentorList");
const skillInput = document.getElementById("skillInput");

// Fetch all skills from Firestore
function loadSkills() {
  db.collection("skills").get().then(snapshot => {
    const mentors = [];

    snapshot.forEach(doc => {
      mentors.push(doc.data());   // add each skill to array
    });

    displayMentors(mentors);

    // Search bar filter
    skillInput.addEventListener("input", () => {
      const value = skillInput.value.toLowerCase();

      const filtered = mentors.filter(m =>
        m.skillName.toLowerCase().includes(value)
      );

      displayMentors(filtered);
    });

  }).catch(err => {
    console.error("Error loading skills:", err);
  });
}

// Display mentors dynamically
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
      <p><strong>Days:</strong> ${m.days}</p>
      <p><strong>Time:</strong> ${m.time}</p>
      <p><strong>Description:</strong> ${m.description}</p>
      <button>Request Mentor</button>
    `;

    mentorList.appendChild(card);
  });
}

// Load skills when page opens
loadSkills();
