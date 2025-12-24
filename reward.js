// ===============================
// WAIT FOR USER
// ===============================
auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  const uid = user.uid;

  loadUserPoints(uid);
  setupRewardButtons(uid);
});


// ===============================
// REWARD COSTS (same order as HTML)
// ===============================
const rewardCosts = [500, 200, 1000];

const userPointsEl = document.getElementById("userPoints");
const claimButtons = document.querySelectorAll(".claim-btn");


// ===============================
// LOAD USER POINTS
// ===============================
function loadUserPoints(uid) {
  db.collection("users").doc(uid).get().then(doc => {
    if (doc.exists) {
      const points = doc.data().points || 0;
      userPointsEl.textContent = points;
      updateButtons(points);
    }
  });
}


// ===============================
// ENABLE / DISABLE BUTTONS
// ===============================
function updateButtons(points) {
  claimButtons.forEach((btn, index) => {
    if (points < rewardCosts[index]) {
      btn.disabled = true;
      btn.textContent = "Not Enough Points";
      btn.classList.add("disabled");
    } else {
      btn.disabled = false;
      btn.textContent = "Claim Reward";
      btn.classList.remove("disabled");
    }
  });
}


// ===============================
// CLAIM REWARD
// ===============================
function setupRewardButtons(uid) {
  claimButtons.forEach((btn, index) => {
    btn.addEventListener("click", async () => {
      const cost = rewardCosts[index];
      const currentPoints = Number(userPointsEl.textContent);

      if (currentPoints < cost) return;

      const newPoints = currentPoints - cost;

      try {
        await db.collection("users").doc(uid).update({
          points: newPoints
        });

        userPointsEl.textContent = newPoints;
        updateButtons(newPoints);

        alert("Reward claimed 🎉");
      } catch (err) {
        console.error("Error claiming reward:", err);
      }
    });
  });
}
