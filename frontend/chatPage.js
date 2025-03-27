const Container = document.getElementById("chatContainer");
const token = localStorage.getItem("token");
console.log("send button clicked...")
// Fetch users for sidebar
async function fetchUsers() {
  try {
    const response = await fetch("https://realtimechat-2-u3vp.onrender.com/chat/get-user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch users");

    const { otherUsers } = await response.json();
    renderUsers(otherUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// Render users in sidebar
function renderUsers(users) {
  const userList = document.getElementById("userList");
  userList.innerHTML = "";

  if (users.length === 0) {
    userList.innerHTML = "<p>No users found</p>";
    return;
  }

  users.forEach((user) => {
    const userItem = document.createElement("button");
    userItem.className = "user-item";
    userItem.innerHTML = `
      <img src="${user.profilePic || '/avatar.png'}" alt="${user.username}">
      <span>${user.username}</span>
      ${user.isOnline ? '<small class="online-badge">Online</small>' : ""}
    `;

    userItem.addEventListener("click", () => openChat(user));
    userList.appendChild(userItem);
  });
}
console.log("open chat")
// Open chat and load messages
async function openChat(user) {
  Container.innerHTML = `
    <div id="chatHeader" class="chat-header">
      <div class="user-info">
        <img src="${users.profilePic || '/avatar.png'}" alt="${users.username}">
        <div>
          <h3>${user.username}</h3>
          <p>${user.isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>
      <button id="closeChat">×</button>
    </div>

    <div id="chatMessages" class="chat-messages">Loading messages...</div>

    <div class="chat-input">
      <input id="chatInput" type="text" placeholder="Type a message...">
      <button id="chatSendBtn">Send</button>
    </div>
  `;

  document.getElementById("closeChat").addEventListener("click", () => {
    Container.innerHTML = "<p>Select a user to start chatting!</p>";
  });

  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("chatSendBtn");
  const chatMessages = document.getElementById("chatMessages");

  // Load messages
  // try {
  //   const response = await fetch(`http://localhost:3000/chats/get-messages/${user._id}`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   console.log(response)
  //   const messages = await response.json();
  //   console.log(messages)
  //   chatMessages.innerHTML = messages
  //     .map((msg) => `<div class="message ${msg.senderId === user._id ? "received" : "sent"}">${msg.text}</div>`)
  //     .join("");
  // } catch (error) {
  //   chatMessages.innerHTML = "<p>Error loading messages</p>";
  //   console.error("Error loading messages:", error);
  // }

  // Load messages
try {
  console.log("load message button clicked...")
  const response = await fetch(`https://realtimechat-2-u3vp.onrender.com/chats/get-messages/${users._id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to load messages");

  const messages = await response.json();

  chatMessages.innerHTML = messages
    .map((msg) => `
      <div class="message ${msg.senderId === user._id ? "received" : "sent"}">
        ${msg.text}
        ${msg.image ? `<img src="${msg.image}" alt="Image">` : ""}
      </div>
    `)
    .join("");

  chatMessages.scrollTop = chatMessages.scrollHeight;
} catch (error) {
  console.error("Error loading messages:", error);
  chatMessages.innerHTML = "<p>Error loading messages</p>";
}


  // Send message
  // sendBtn.addEventListener("click", async () => {
  //   const messageText = chatInput.value.trim();
  //   if (!messageText) return;

  //   // Display immediately
  //   chatMessages.innerHTML += `<div class="message sent">${messageText}</div>`;
  //   chatInput.value = "";
  //   chatMessages.scrollTop = chatMessages.scrollHeight;
  //   console.log("Receiver ID:", user._id);

  //   try {
  //     await fetch(`http://localhost:3000/chats/send/${user._id}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ text: messageText }),
  //     });
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   }
  // });
  // Send message
// sendBtn.addEventListener("click", async () => {
//   const messageText = chatInput.value.trim();
//   if (!messageText) return;

//   chatMessages.innerHTML += `<div class="message sent">${messageText}</div>`;
//   chatInput.value = "";
//   chatMessages.scrollTop = chatMessages.scrollHeight;

//   try {
//     const response = await fetch(`http://localhost:3000/chats/send/${user._id}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ text: messageText }),
//     });

//     if (!response.ok) throw new Error("Message not sent");

//     const newMessage = await response.json();
//     console.log("Message saved:", newMessage);
//   } catch (error) {
//     console.error("Error sending message:", error);
//     chatMessages.innerHTML += `<div class="error">Failed to send</div>`;
//   }
// });
console.log("send button clicked...")
sendBtn.addEventListener("click", async () => {
  const messageText = chatInput.value.trim();
  if (!messageText) return;

  chatMessages.innerHTML += `<div class="message sent">${messageText}</div>`;
  chatInput.value = "";
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const response = await fetch(`https://realtimechat-2-u3vp.onrender.com/chats/send/${users._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: messageText }),
    });

    const data = await response.json();
    console.log("Message Response:", data);
  } catch (error) {
    console.error("Error sending message:", error);
  }
});

}

// Initialize
fetchUsers();
