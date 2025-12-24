auth.onAuthStateChanged(async (user) => {
  const infoEl = document.getElementById("nextClassInfo");
  const countdownEl = document.getElementById("countdownTimer");

  if (!user) {
    infoEl.textContent = "Please login to see your classes.";
    countdownEl.textContent = "";
    return;
  }

  try {
    const now = new Date();
    const requestsRef = db.collection("requests");

    // Get all accepted requests for this user
    const snap = await requestsRef
      .where("from", "==", user.uid)
      .where("status", "==", "accepted")
      .get();

    if (snap.empty) {
      infoEl.textContent = "No upcoming classes.";
      countdownEl.textContent = "";
      return;
    }

    // Filter only future classes
    const upcomingDocs = snap.docs.filter(doc => {
      const data = doc.data();
      return data.timestamp && data.timestamp.toDate() > now;
    });

    if (upcomingDocs.length === 0) {
      infoEl.textContent = "No upcoming classes.";
      countdownEl.textContent = "";
      return;
    }

    // Pick the earliest class
    upcomingDocs.sort((a, b) => a.data().timestamp.toDate() - b.data().timestamp.toDate());
    const doc = upcomingDocs[0];
    const data = doc.data();
    const classTime = data.timestamp.toDate();

    infoEl.textContent = `${data.skill} with ${data.to} on ${classTime.toLocaleString()}`;

    // Countdown timer
    function updateCountdown() {
      const diff = classTime - new Date();
      if (diff <= 0) {
        countdownEl.textContent = "Class is starting now!";
        clearInterval(timer);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      countdownEl.textContent = `Starts in: ${hours}h ${minutes}m ${seconds}s`;
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

  } catch (err) {
    console.error("Error loading classes:", err);
    infoEl.textContent = "No upcoming classes."; // fallback
    countdownEl.textContent = "";
  }
});
