

const userList = document.getElementById("userList");
const onlineToggle = document.getElementById("onlineToggle");
const onlineCount = document.getElementById("onlineCount");
const chatContainer1 = document.getElementById("chatContainer");
const chatHeader = document.getElementById("chatHeader");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const chatSendBtn = document.getElementById("chatSendBtn");

let users = [];
let selectedUser = null;

// Fetch user data from backend
async function fetchUsers() {
  try {
    const response = await fetch("https://realtimechat-2-u3vp.onrender.com/user/all-user");
    console.log(response)
    if (!response.ok) throw new Error("Failed to fetch users");
    users = await response.json();
    console.log("Fetched Users:", users);
    renderUsers();
  } catch (error) {
    userList.innerHTML = "<p>Error loading users</p>";
    console.error("Error fetching users:", error);
  }
}

// Render users in sidebar
function renderUsers(filterOnline = false) {
  userList.innerHTML = "";

  const filteredUsers = filterOnline
    ? users.filter((user) => user.isOnline)
    : users;

  onlineCount.textContent = users.filter((user) => user.isOnline).length;

  if (filteredUsers.length === 0) {
    userList.innerHTML = "<p>No users found</p>";
    return;
  }

  filteredUsers.forEach((user) => {
    const userItem = document.createElement("button");
    userItem.className = "user-item";
    userItem.innerHTML = `
      <img id="sidebar-img" src="${user.profilePic || '/avatar.png'}" alt="${user.username}">
      <span>${user.username}</span>
      ${user.isOnline ? '<small class="online-badge">Online</small>' : ""}
    `;

    userItem.addEventListener("click", () => {
      selectUser(user);
    });

    userList.appendChild(userItem);
  });
}

// Select user and open chat
function selectUser(user) {
  selectedUser = user;
  renderChat();
}

// Render chat container
function renderChat() {
  if (!selectedUser) {
    chatContainer1.innerHTML = `
      <div class="welcome-message">
        <h2>Welcome to Chat!</h2>
        <p>Select a contact to start chatting.</p>
      </div>
    `;
    return;
  }

  chatContainer1.innerHTML = `
    <div id="chatHeader" class="chat-header">
      <div class="user-info">
        <img id="user-avatar" src="${selectedUser.profilePic || '/avatar.png'}" alt="${selectedUser.username}">
        <div>
          <h3 id="userName">${selectedUser.username}</h3>
          <p id="userStatus">${selectedUser.isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>
      <button id="closeChat">×</button>
    </div>

    <div id="chatMessages" class="chat-messages"></div>

    <div class="chat-input">
      <input id="chatInput" type="text" placeholder="Type a message...">
      <button id="chatSendBtn">Send</button>
    </div>
  `;

  // Close chat
  document.getElementById("closeChat").addEventListener("click", () => {
    selectedUser = null;
    renderChat();
  });

  // Send message
  document
    .getElementById("chatSendBtn")
    .addEventListener("click", sendMessage);
}

// Send message logic (dummy for now)
function sendMessage() {
  const message = document.getElementById("chatInput").value.trim();
  if (!message) return;

  const messageDiv = document.createElement("div");
  messageDiv.className = "message sent";
  messageDiv.innerHTML = `<p>${message}</p>`;
  document.getElementById("chatMessages").appendChild(messageDiv);

  document.getElementById("chatInput").value = "";

  const chatMessages = document.getElementById("chatMessages");

if (chatMessages) {
  chatMessages.scrollTop = chatMessages.scrollHeight; // Safe to access now
}

  // chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
}

// Handle online filter toggle
onlineToggle.addEventListener("change", (e) => {
  renderUsers(e.target.checked);
});

// Initial setup
fetchUsers();
renderChat(); // Load welcome message on start
