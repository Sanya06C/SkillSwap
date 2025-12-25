const inboxList = document.getElementById("inboxList");

waitForAuth(user => {
  loadInbox(user.uid);
});

function loadInbox(myUid) {
  db.collection("chats")
    .where("users", "array-contains", myUid)
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

        const otherUid = chat.users.find(uid => uid !== myUid);

        const userSnap = await db.collection("users").doc(otherUid).get();
        if (!userSnap.exists) continue;

        const otherUser = userSnap.data();
        const unreadCount = chat.unread?.[myUid] || 0;

        const div = document.createElement("div");
        div.className = "mentor-card";

        div.innerHTML = `
          <h3>${otherUser.name}</h3>
          <p><strong>Last message:</strong> ${chat.lastMessage || ""}</p>

          ${
            unreadCount > 0
              ? `
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
                ">
                  🔔 ${unreadCount} new
                </div>
              `
              : ""
          }

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
