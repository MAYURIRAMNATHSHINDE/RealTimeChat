const express = require('express');
const { messageModel } = require('../models/message.model');

const authMiddleware = require('../middleware/auth.middleware');
const { userModel } = require('../models/user.models');
const { chatRoomModel } = require('../models/messageRoom.models');
const cloudinary = require('cloudinary').v2;
const chatRoomRoutes = express.Router();

// 📌 Create Chatroom
chatRoomRoutes.post("/create-chatroom", authMiddleware, async (req, res) => {
    try {
        const { name, participants } = req.body;
        const newChatroom = await chatRoomModel.create({ name, participants });
        res.status(201).json({ message: "Chatroom created successfully", newChatroom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Get User Chatrooms
chatRoomRoutes.get("/get-chatrooms", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const chatrooms = await chatRoomModel.find({ participants: userId }).populate('participants', '-password');
        res.status(200).json(chatrooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Send Message to Chatroom
chatRoomRoutes.post("/send/:chatroomId", authMiddleware, async (req, res) => {
    try {
        const { chatroomId } = req.params;
        const senderId = req.user.id;
        const { text, image } = req.body;

        let imageUrl = null;
        if (image) {
            const uploadedImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadedImage.secure_url;
        }

        const newMessage = await messageModel.create({
            chatroomId,
            senderId,
            text,
            image: imageUrl
        });

        // Emit message to chatroom via socket.io (added later)
        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Get Messages in a Chatroom
chatRoomRoutes.get("/get-messages/:chatroomId", authMiddleware, async (req, res) => {
    try {
        const { chatroomId } = req.params;
        const messages = await messageModel.find({ chatroomId }).populate('senderId', 'username');
        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = chatRoomRoutes;
