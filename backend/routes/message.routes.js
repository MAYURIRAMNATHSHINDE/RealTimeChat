const express = require('express');
const { messageModel } = require('../models/message.model');
const authMiddleware = require('../middleware/auth.middleware');
const { userModel } = require('../models/user.models');
const chatRoutes = express.Router();

//get user for sidebar

chatRoutes.get("/get-user", authMiddleware, async (req, res) => {
    try {
        const LogedInUserId = req.user.id;
        const otherUsers = await userModel.find({ "_id": { $ne: LogedInUserId }, password: 0 })
        res.status(200).json({ otherUsers })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
//get messages that we have sended and received before
chatRoutes.get("/get-messages/:id", authMiddleware, async (req, res) => {
    try {
        userToChatId = req.params.id;
        myId = req.user.id;
        const messages = await messageModel.find({
            $or: [{ senderId: myId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: myId }]
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

//send messages
chatRoutes.post("/send/:id", authMiddleware, async (req, res) => {
    try {
        receiverId = req.params.id;
        senderId = req.user.id;
        const { text, image } = req.body;

        let imageUrl;
        if (image) {
            const uploadedImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadedImage.secure_url;
        }
        const newMessage=await messageModel.create({
            receiverId,
            senderId,
            text,
            image:imageUrl
        })
      //real time functinality by soket.io
      res.status(200).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }

})



chatRoutes.get("/:chatRoomId/messages", async (req, res) => {
    const { chatRoomId } = req.params;

    if (!chatRoomId) {
        return res.status(400).json({ error: "Invalid chatRoomId" });
    }

    try {
        const messages = await messageModel.find({ chatRoomId });
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports = chatRoutes;
