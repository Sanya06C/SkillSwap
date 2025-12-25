// ===== GET CHAT ID FROM URL =====
const params = new URLSearchParams(window.location.search);
const chatId = params.get("chatId");

if (!chatId) {
  alert("Chat ID missing");
}

// ===== LOAD MESSAGES =====
function loadMessages() {
  db.collection("chats")
    .doc(chatId)
    .collection("messages")
    .orderBy("timestamp")
    .onSnapshot(snapshot => {
      const box = document.getElementById("chatBox");
      box.innerHTML = "";

      snapshot.forEach(doc => {
        const msg = doc.data();
        const div = document.createElement("div");

        div.className =
          msg.senderId === firebase.auth().currentUser.uid
            ? "my-msg"
            : "other-msg";

        div.textContent = msg.text;
        box.appendChild(div);
      });

      box.scrollTop = box.scrollHeight;
    });
}

// ===== SEND MESSAGE =====
async function sendMessage() {
  const input = document.getElementById("msgInput");
  const text = input.value.trim();
  if (!text) return;

  const user = firebase.auth().currentUser;

  const chatRef = db.collection("chats").doc(chatId);

  // ✅ ENSURE CHAT DOCUMENT EXISTS
  await chatRef.set(
    {
      lastMessage: text,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  // ✅ ADD MESSAGE
  await chatRef.collection("messages").add({
    senderId: user.uid,
    text: text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  input.value = "";
}


// ===== START AFTER LOGIN =====
waitForAuth(() => {
  loadMessages();
});
