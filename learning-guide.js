const mentors = [
  { name: "Aarav", skill: "Python", days: "Mon Wed Fri", points: 120 },
  { name: "Saavi", skill: "UI/UX", days: "Tue Thu", points: 200 },
  { name: "Rohan", skill: "Web Development", days: "Sat Sun", points: 150 }
];

async function askGemini() {
  const skill = document.getElementById("skillInput").value.trim();
  const output = document.getElementById("aiResponse");

  if (!skill) {
    output.innerText = "Please enter a skill.";
    return;
  }

  output.innerText = "Thinking... 🤔";

  // Call backend function (local emulator)
  try {
    const response = await fetch(
      "http://127.0.0.1:5001/skillswap-e13ee/us-central1/askGemini",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: skill })
      }
    );

    const data = await response.json();
    output.innerText = data.reply || "No reply from backend.";

  } catch (error) {
    console.error("Error calling backend:", error);
    output.innerText = "Error contacting backend. Check console.";
  }
}
