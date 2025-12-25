

// ===============================
// STEP 1: Get other user's UID from URL
// ===============================
const params = new URLSearchParams(window.location.search);
const otherUid = params.get("uid");

console.log("Other UID:", otherUid);

let currentChatId = "";


// ===============================
// STEP 2: Create unique chat ID
// ===============================
function getChatId(uid1, uid2) {
  return [uid1, uid2].sort().join("_");
}


// ===============================
// STEP 3: Create chat if not exists
// ===============================
async function createChat(myUid, otherUid) {
  currentChatId = getChatId(myUid, otherUid);

  const chatRef = db.collection("chats").doc(currentChatId);
  const chatSnap = await chatRef.get();

  if (!chatSnap.exists) {
    await chatRef.set({
      users: [myUid, otherUid],
      lastMessage: "",
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  loadMessages();
}


// ===============================
// STEP 4: Load messages in real time
// ===============================
function loadMessages() {
  db.collection("chats")
    .doc(currentChatId)
    .collection("messages")
    .orderBy("timestamp")
    .onSnapshot(snapshot => {

      const chatBox = document.getElementById("chatBox");
      chatBox.innerHTML = "";

      snapshot.forEach(doc => {
        const msg = doc.data();

        const div = document.createElement("div");
        div.className =
          msg.senderId === auth.currentUser.uid
            ? "my-msg"
            : "other-msg";

        div.textContent = msg.text;
        chatBox.appendChild(div);
      });

      chatBox.scrollTop = chatBox.scrollHeight;
    });
}


// ===============================
// STEP 5: Send message
// ===============================
async function sendMessage() {
  const input = document.getElementById("msgInput");
  const text = input.value.trim();
  if (!text) return;

  const user = auth.currentUser;

  await db
    .collection("chats")
    .doc(currentChatId)
    .collection("messages")
    .add({
      senderId: user.uid,
      text: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

  await db.collection("chats").doc(currentChatId).update({
    lastMessage: text,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  input.value = "";
}


// ===============================
// STEP 6: Start chat AFTER login
// ===============================
waitForAuth(user => {
  if (!otherUid) {
    alert("No user selected to chat with");
    return;
  }

  createChat(user.uid, otherUid);
});
