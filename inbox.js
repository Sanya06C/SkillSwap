const inboxList = document.getElementById("inboxList");

waitForAuth(user => {
  loadInbox(user.uid);
});

async function loadInbox(myUid) {
  db.collection("chats")
    .orderBy("updatedAt", "desc")
    .onSnapshot(async snapshot => {
      inboxList.innerHTML = "";

      if (snapshot.empty) {
        inboxList.innerHTML = "<p>No chats yet.</p>";
        return;
      }

      for (const doc of snapshot.docs) {
        const chat = doc.data();
        const chatId = doc.id;

        // 1️⃣ Get related request
        const reqSnap = await db.collection("requests").doc(chatId).get();
        if (!reqSnap.exists) continue;

        const req = reqSnap.data();

        // 2️⃣ Find other user's UID
        const otherUid =
          req.from === myUid ? req.to : req.from;

        // 3️⃣ Fetch other user's profile
        const userSnap = await db.collection("users").doc(otherUid).get();
        if (!userSnap.exists) continue;

        const otherUser = userSnap.data();

        // 4️⃣ Get unread count safely
        const lastRead = chat.lastReadAt?.[myUid];
const updatedAt = chat.updatedAt;

let isUnread = false;

if (!lastRead && updatedAt) {
  isUnread = true;
} else if (lastRead && updatedAt) {
  isUnread = updatedAt.toMillis() > lastRead.toMillis();
}


        const div = document.createElement("div");
        div.className = "mentor-card";

        console.log("Unread debug:", chat.unread, "myUid:", myUid);

        div.innerHTML = `
          <h3>${otherUser.name}</h3>

          <p><strong>Last message:</strong> ${chat.lastMessage || ""}</p>

          ${isUnread ? `
  <div style="
    display:inline-flex;
    align-items:center;
    gap:6px;
    background:#ff4757;
    color:white;
    padding:4px 10px;
    border-radius:999px;
    font-size:13px;
    font-weight:600;
    margin-top:6px;
    box-shadow:0 0 8px rgba(255,71,87,0.6);
  ">
    🔔 New
  </div>
` : ""}



          <br>
          <button onclick="openChat('${chatId}')">Open Chat</button>
        `;

        inboxList.appendChild(div);
      }
    });
}

function openChat(chatId) {
  window.location.href = `chat.html?chatId=${chatId}`;
}


