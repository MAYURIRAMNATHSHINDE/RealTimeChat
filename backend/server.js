// const express = require("express");
// const { ConnectToDB } = require("./config/mongo.config");
// const router = require("./routes/user.routes");
// require("dotenv").config();
// const cors = require("cors");
// const http = require("http");
// const socketIo = require("socket.io");
// const chatRoutes = require("./routes/message.routes");
// const path = require("path");


// const chatRoomRoutes = require("./routes/chatroom.routes");

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(express.json());
// app.use("/user", router);
// app.use("/chats", chatRoutes);
// app.use("/room", chatRoomRoutes);
// app.use(express.static(path.join(__dirname, '../frontend')));

// app.use(cors({ origin: "*", credentials: true }));
// app.get("/", (req, res) => {
//     console.log('Serving static files from:', path.join(__dirname, 'frontend'));

//     res.sendFile(path.join(__dirname, "../frontend", "index.html"));
// });
// // Create HTTP server and attach Socket.IO
// const server = http.createServer(app);
// const io = socketIo(server, {
//     cors: {
//         origin: "*", // Allow requests from any origin (for development)
//         methods: ["GET", "POST"]
//     }
// });

// // MongoDB Connection
// ConnectToDB();

// // Socket.IO Connection

// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     // Join a specific chat room
//     socket.on('joinRoom', (chatRoomId) => {
//         socket.join(chatRoomId);
//         console.log(`User joined room: ${chatRoomId}`);
//     });

//     // Handle sending messages
//     socket.on('sendMessage', (messageData) => {
//         console.log('Message received:', messageData);
//         const { chatRoomId, senderId,text,image } = messageData;

//         // Emit message to all users in the room
//         io.to(chatRoomId).emit('receiveMessage', {
//             senderId,
//             text,
//             image,
//             timestamp: new Date(),
//         });
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });

// // Start Server
// server.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });





const express = require("express");
const { ConnectToDB } = require("./config/mongo.config");
const router = require("./routes/user.routes");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const chatRoutes = require("./routes/message.routes");
const path = require("path");
const chatRoomRoutes = require("./routes/chatroom.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ **Fix CORS Configuration**
app.use(cors({
    origin: "https://mychattywebsite.netlify.app",   // Allow all origins (change to specific domain in production)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// ✅ **Middleware Order Matters**
app.use(express.json()); 

app.use("/user", router);
app.use("/chats", chatRoutes);
app.use("/room", chatRoomRoutes);

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

// ✅ **MongoDB Connection**
ConnectToDB();

// ✅ **Socket.IO Connection**
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', (chatRoomId) => {
        socket.join(chatRoomId);
        console.log(`User joined room: ${chatRoomId}`);
    });

    socket.on('sendMessage', (messageData) => {
        console.log('Message received:', messageData);
        const { chatRoomId, senderId, text, image } = messageData;

        io.to(chatRoomId).emit('receiveMessage', {
            senderId,
            text,
            image,
            timestamp: new Date(),
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// ✅ **Start Server**
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

