// ===============================
// WAIT FOR USER
// ===============================
auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  const uid = user.uid;

  loadUserPoints(uid);
  loadClassesTaught(uid);
  loadClassesTaken(uid);
  loadRecentUsers(uid);
  loadSkillProgress(uid);
});


// ===============================
// 1. USER POINTS + LEVEL
// ===============================
function loadUserPoints(uid) {
  db.collection("users").doc(uid).get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      const points = data.points || 0;

      document.getElementById("pointsEarned").textContent = points;

      updateLevel(points);
    }
  });
}

function updateLevel(points) {
  let level = 1;
  let title = "Beginner";
  let progress = 0;

  if (points < 50) {
    level = 1; title = "Beginner"; progress = (points / 50) * 100;
  } else if (points < 150) {
    level = 2; title = "Intermediate"; progress = ((points - 50) / 100) * 100;
  } else if (points < 300) {
    level = 3; title = "Advanced"; progress = ((points - 150) / 150) * 100;
  } else {
    level = 4; title = "Master"; progress = 100;
  }

  document.getElementById("userLevelText").textContent = `Level ${level} — ${title}`;
  document.getElementById("levelProgress").style.width = progress + "%";
}


// ===============================
// 2. CLASSES TAUGHT
// ===============================
function loadClassesTaught(uid) {
  db.collection("requests")
    .where("to", "==", uid)
    .where("status", "==", "completed")
    .get()
    .then(snap => {
      document.getElementById("classesTaught").textContent = snap.size;
    });
}


// ===============================
// 3. CLASSES TAKEN
// ===============================
function loadClassesTaken(uid) {
  db.collection("requests")
    .where("from", "==", uid)
    .where("status", "==", "completed")
    .get()
    .then(snap => {
      document.getElementById("classesTaken").textContent = snap.size;
    });
}


// ===============================
// 4. SKILL PROFICIENCY
// ===============================
function loadSkillProgress(uid) {
  const container = document.getElementById("skillProgressContainer");
  container.innerHTML = "<p>Loading...</p>";

  const reqRef = db.collection("requests");

  Promise.all([
    reqRef.where("from", "==", uid).where("status", "==", "completed").get(), // learned
    reqRef.where("to", "==", uid).where("status", "==", "completed").get()    // taught
  ])
  .then(([learnSnap, teachSnap]) => {
    let skillCounts = {};

    // Skills YOU LEARNED
    learnSnap.forEach(doc => {
      const skill = doc.data().skill;
      if (!skill) return;
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });

    // Skills YOU TAUGHT
    teachSnap.forEach(doc => {
      const skill = doc.data().skill;
      if (!skill) return;
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });

    if (Object.keys(skillCounts).length === 0) {
      container.innerHTML = "<p>No skill activity yet.</p>";
      return;
    }

    container.innerHTML = "";

    Object.keys(skillCounts).forEach(skill => {
      const count = skillCounts[skill];
      const percent = Math.min(100, count * 20); // each session = 20%

      container.innerHTML += `
        <div class="skill-block">
          <p>${skill} <span style="float:right;">${percent}%</span></p>
          <div class="progress-bar-bg">
            <div class="progress-fill" style="width:${percent}%;"></div>
          </div>
        </div>
      `;
    });
  })
  .catch(() => {
    container.innerHTML = "<p>Error loading skills.</p>";
  });
}


// ===============================
// 5. RECENT USERS I INTERACTED WITH
// ===============================
function loadRecentUsers(uid) {
  const list = document.getElementById("recentUsers");
  list.innerHTML = "<li>Loading...</li>";

  const reqRef = db.collection("requests");

  Promise.all([
    reqRef.where("from", "==", uid).get(),   // You learned
    reqRef.where("to", "==", uid).get()      // You taught
  ])
  .then(async ([learnSnap, teachSnap]) => {
    const combined = [];

    learnSnap.forEach(doc => combined.push({ ...doc.data(), role: "learned" }));
    teachSnap.forEach(doc => combined.push({ ...doc.data(), role: "taught" }));

    // fix: Firestore timestamp sorting
    combined.sort((a, b) => (b.timestamp?.toMillis?.() || 0) - (a.timestamp?.toMillis?.() || 0));

    const recent = combined.slice(0, 5);

    if (recent.length === 0) {
      list.innerHTML = "<li>No activity yet.</li>";
      return;
    }

    list.innerHTML = "";

    for (const r of recent) {
      const otherUserID = r.role === "learned" ? r.to : r.from;
      const userDoc = await db.collection("users").doc(otherUserID).get();
      const other = userDoc.data();

      const label = r.role === "learned" ? "Mentor" : "Student";

      list.innerHTML += `
        <li>${other.name} (${label}) — ${r.skill}</li>
      `;
    }
  })
  .catch(err => {
    console.error("Recent users error:", err);
    list.innerHTML = "<li>Error loading data</li>";
  });
}
