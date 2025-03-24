// const express=require("express");
// const { ConnectToDB } = require("./config/mongo.config");
// const router = require("./routes/user.routes");
// require('dotenv').config()

// const http = require('http');
// const socketIo = require('socket.io');
// const chatRoutes = require("./routes/chat.routes");
// const path = require("path");

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());
// const server = http.createServer(app);
// const io = socketIo(server); 
// app.use("/user",router)
// app.use('/chats', chatRoutes);



// app.use(express.static(path.join(__dirname, 'frontend')));


// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     // Handle joining a room
//     socket.on('joinRoom', (roomId) => {
//         socket.join(roomId);
//         console.log(`User ${socket.id} joined room: ${roomId}`);
//     });

//     // Handle sending a message
//     socket.on('sendMessage', (data) => {
//         io.to(data.roomId).emit('receiveMessage', {
//             sender: data.sender,
//             content: data.content,
//         });
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });






// server.listen(PORT, () => {
//     ConnectToDB()
//     console.log(`Server running on http://localhost:${PORT}`);
// });




const express = require("express");
const { ConnectToDB } = require("./config/mongo.config");
const router = require("./routes/user.routes");
require("dotenv").config();

const http = require("http");
const socketIo = require("socket.io");
const chatRoutes = require("./routes/chat.routes");
const path = require("path");
const chatrouter = require("./routes/chatroom.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use("/user", router);
app.use("/chats", chatRoutes);
app.use("/room", chatrouter);
app.use(express.static(path.join(__dirname, '../frontend')));
app.get("/", (req, res) => {
    console.log('Serving static files from:', path.join(__dirname, 'frontend'));

    res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});
// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow requests from any origin (for development)
        methods: ["GET", "POST"]
    }
});

// MongoDB Connection
ConnectToDB();

// Socket.IO Connection
// io.on("connection", (socket) => {
//     console.log("A user connected:", socket.id);

//     // Handle joining a room
//     socket.on("joinRoom", (chatRoomId) => {
//         socket.join(chatRoomId);
//         console.log(`User ${socket.id} joined room: ${chatRoomId}`);
//     });

//     // Handle sending a message
//     socket.on("sendMessage", (data) => {
//         io.to(data.chatRoomId).emit("receiveMessage", {
//             sender: data.sender,
//             content: data.content,
//         });
//     });

//     // Handle disconnection
//     socket.on("disconnect", () => {
//         console.log("User disconnected:", socket.id);
//     });
// });
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a specific chat room
    socket.on('joinRoom', (chatRoomId) => {
        socket.join(chatRoomId);
        console.log(`User joined room: ${chatRoomId}`);
    });

    // Handle sending messages
    socket.on('sendMessage', (messageData) => {
        console.log('Message received:', messageData);
        const { chatRoomId, sender, content } = messageData;

        // Emit message to all users in the room
        io.to(chatRoomId).emit('receiveMessage', {
            sender,
            content,
            timestamp: new Date(),
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start Server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});






