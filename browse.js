const mentors = [
  {
    name: "Aarav",
    skill: "Python",
    days: "Mon, Wed, Fri",
    time: "6 PM – 8 PM",
    points: 120
  },
  {
    name: "Saavi",
    skill: "UI/UX",
    days: "Tue, Thu",
    time: "5 PM – 7 PM",
    points: 200
  },
  {
    name: "Rohan",
    skill: "Web Development",
    days: "Sat, Sun",
    time: "11 AM – 2 PM",
    points: 150
  }
];

const mentorList = document.getElementById("mentorList");
const skillInput = document.getElementById("skillInput");

function displayMentors(filteredMentors) {
  mentorList.innerHTML = "";

  if (filteredMentors.length === 0) {
    mentorList.innerHTML = "<p>No mentors found.</p>";
    return;
  }

  filteredMentors.forEach(m => {
    const card = document.createElement("div");
    card.className = "mentor-card";

    card.innerHTML = `
      <h3>${m.name}</h3>
      <p><strong>Skill:</strong> ${m.skill}</p>
      <p><strong>Days:</strong> ${m.days}</p>
      <p><strong>Time:</strong> ${m.time}</p>
      <p><strong>Points:</strong> ⭐ ${m.points}</p>
      <button>Request Mentor</button>
    `;

    mentorList.appendChild(card);
  });
}

skillInput.addEventListener("input", () => {
  const value = skillInput.value.toLowerCase();

  const filtered = mentors.filter(m =>
    m.skill.toLowerCase().includes(value)
  );

  displayMentors(filtered);
});

displayMentors(mentors);
