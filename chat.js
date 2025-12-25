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
    .orderBy("timestamp", "asc")
    .onSnapshot(snapshot => {
      const box = document.getElementById("chatBox");
      box.innerHTML = "";

      snapshot.forEach(doc => {
        const msg = doc.data();
        if (!msg.text) return;

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

// ===== SEND MESSAGE (INCREMENT UNREAD FOR OTHER USER) =====
async function sendMessage() {
  const input = document.getElementById("msgInput");
  const text = input.value.trim();
  if (!text) return;

  const user = firebase.auth().currentUser;
  const chatRef = db.collection("chats").doc(chatId);

  // Get request to know participants
  const reqSnap = await db.collection("requests").doc(chatId).get();
  if (!reqSnap.exists) return;

  const { from, to } = reqSnap.data();
  const otherUid = user.uid === from ? to : from;

  // Create / update chat doc + increment unread
  await chatRef.set(
    {
      users: [from, to],
      lastMessage: text,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      unread: {
        [otherUid]: firebase.firestore.FieldValue.increment(1)
      }
    },
    { merge: true }
  );

  // Add message
  await chatRef.collection("messages").add({
    senderId: user.uid,
    text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  input.value = "";
}

// ===== START AFTER LOGIN =====
waitForAuth(async user => {
  const chatRef = db.collection("chats").doc(chatId);

  loadMessages();

  // 🔔 RESET MY UNREAD COUNT WHEN CHAT OPENS
  await chatRef.set(
    {
      unread: {
        [user.uid]: 0
      }
    },
    { merge: true }
  );
});
