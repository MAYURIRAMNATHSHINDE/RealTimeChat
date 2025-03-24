const express = require('express');
const { messageModel } = require('../models/message.model');
const chatRoutes = express.Router();

// Get Message History
// chatRoutes.get('/:roomId/messages', async (req, res) => {
//     try {
//         const { roomId } = req.params;
//         const messages = await messageModel.find({ chatRoomId: roomId }).populate('sender', 'username');
//         res.status(200).json(messages);
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ message: 'Server error', error });
//     }
// });
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
