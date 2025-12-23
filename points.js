// Data
const dashboardData = {
  classesTaken: 12,
  classesTaught: 5,
  pointsEarned: 320,
  skillProgress: {
    JavaScript: 70,
    UIUX: 50,
    Python: 90
  },
  topMentors: ["Aarav", "Saavi", "Rohan"],
  badges: ["First 5 Classes", "100 Points", "Top Mentor"]
};

// --- NEW: Count-Up Animation Function ---
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerText = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Trigger animations
animateValue("classesTaken", 0, dashboardData.classesTaken, 1500);
animateValue("classesTaught", 0, dashboardData.classesTaught, 1500);
animateValue("pointsEarned", 0, dashboardData.pointsEarned, 2000);

// Update skill progress (smooth width transition)
setTimeout(() => {
    document.getElementById("progressJS").style.width = dashboardData.skillProgress.JavaScript + "%";
    document.getElementById("progressUI").style.width = dashboardData.skillProgress.UIUX + "%";
    document.getElementById("progressPython").style.width = dashboardData.skillProgress.Python + "%";
}, 500);

// Update top mentors
const topMentorsList = document.getElementById("topMentors");
dashboardData.topMentors.forEach(mentor => {
  const li = document.createElement("li");
  li.innerText = mentor;
  topMentorsList.appendChild(li);
});

// Update badges
const badgesDiv = document.getElementById("badges");
dashboardData.badges.forEach(badge => {
  const span = document.createElement("span");
  span.className = "badge";
  span.innerText = badge;
  badgesDiv.appendChild(span);
});