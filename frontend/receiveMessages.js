const socket = io("https://realtimechat-2-u3vp.onrender.com"); // Connect to backend

socket.on("connect", () => {
  console.log("Connected to chat server");
});

// Listen for incoming messages
socket.on("newMessage", (message) => {
  displayMessage(message); // Function to update UI dynamically
});

// Function to display received messages
function displayMessage(message) {
  const chatMessages = document.getElementById("chatMessages");
  const messageElement = document.createElement("div");

  messageElement.classList.add("message", message.senderId === localStorage.getItem("userId") ? "sent" : "received");
  messageElement.innerHTML = `
    ${message.text}
    ${message.image ? `<img src="${message.image}" alt="Image">` : ""}
  `;

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
}
