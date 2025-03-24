// Connect to the backend server (adjust URL as needed)
const socket = io('http://localhost:3000'); 

// Room and user information (replace with dynamic values if needed)
const chatRoomId = '67e14b5fed3e9dcd8daef19d';
const user = { id: '67e130b447fd4c5bfe80aa5d', name: 'a' };

// Join the chat room
socket.emit('joinRoom', chatRoomId);

// Display room title
document.getElementById('room-title').innerText = `Chat Room: ${chatRoomId}`;

// Listen for incoming messages
socket.on('receiveMessage', (newMessage) => {
    displayMessage(newMessage);
});

// Send message event
document.getElementById('sendButton').addEventListener('click', () => {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message) {
        socket.emit('sendMessage', {
            chatRoomId,
            senderId: user.id,
            sender: user.name,
            content: message,
        });
        messageInput.value = '';
    }
});

// Display messages in the chat
function displayMessage(msg) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<strong>${msg.sender}:</strong> ${msg.content}`;
    messagesDiv.appendChild(messageElement);
}
