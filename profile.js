window.onload = () => {
  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    loadUserInfo(user.uid);
    loadUserSkills(user.uid);
  });
};

// ------------------------------
// Load User Info
// ------------------------------
function loadUserInfo(uid) {
  db.collection("users").doc(uid).get().then(doc => {
    if (!doc.exists) return;

    const data = doc.data();

    document.getElementById("userName").textContent = data.name;
    document.getElementById("userEmail").textContent = data.email;
    document.getElementById("userPoints").textContent = data.points || 0;
    document.getElementById("userBadge").textContent = getBadge(data.points || 0);
    document.getElementById("userBranch").textContent = data.branch;
    document.getElementById("userYear").textContent = data.year;
  });
}

// ------------------------------
// Badge Logic
// ------------------------------
function getBadge(points) {
  if (points < 50) return "🟦 Beginner";
  if (points < 150) return "🟩 Helper";
  if (points < 300) return "🟧 Skilled Mentor";
  return "🟨 Master Mentor";
}

// ------------------------------
// Load skills posted by user
// ------------------------------
function loadUserSkills(uid) {
  const skillsList = document.getElementById("skillsList");
  skillsList.innerHTML = "Loading...";

  db.collection("skills")
    .where("mentorId", "==", uid)   // ✅ FIXED
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        skillsList.innerHTML = "<p>You haven't posted any skills yet.</p>";
        return;
      }

      skillsList.innerHTML = "";

      snapshot.forEach(doc => {
        const skill = doc.data();

        const card = document.createElement("div");
        card.className = "skill-card";

        card.innerHTML = `
          <h3>${skill.skillName}</h3>
          <p>${skill.description}</p>
          <p><strong>Days:</strong> ${skill.days}</p>
          <p><strong>Time:</strong> ${skill.time}</p>
        `;

        skillsList.appendChild(card);
      });
    })
    .catch(err => console.error(err));
}
