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

const Redis = require("ioredis");

const redis = new Redis(); // Connect to Redis server

// 📌 Utility function to generate cache key for a chat
const getCacheKey = (user1, user2) => `chat:${[user1, user2].sort().join("_")}`;

// 🟢 Get messages from cache or database
chatRoutes.get("/get-messages/:id", authMiddleware, async (req, res) => {
  try {
    const userToChatId = req.params.id;
    const myId = req.user.id;
    const cacheKey = getCacheKey(myId, userToChatId);

    // Check if messages are cached in Redis
    const cachedMessages = await redis.get(cacheKey);
    if (cachedMessages) {
      console.log("📌 Returning messages from Redis cache");
      return res.status(200).json(JSON.parse(cachedMessages));
    }

    // Fetch from MongoDB if not in cache
    const messages = await messageModel.find({
      $or: [{ senderId: myId, receiverId: userToChatId }, { senderId: userToChatId, receiverId: myId }],
    });

    // Store in Redis cache for 1 hour
    await redis.setex(cacheKey, 3600, JSON.stringify(messages));

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🟢 Send message and update cache
chatRoutes.post("/send/:id", authMiddleware, async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user.id;
    const { text, image } = req.body;

    let imageUrl;
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadedImage.secure_url;
    }

    // Store new message in DB
    const newMessage = await messageModel.create({
      receiverId,
      senderId,
      text,
      image: imageUrl,
    });

    // Update Redis cache
    const cacheKey = getCacheKey(senderId, receiverId);
    const cachedMessages = await redis.get(cacheKey);
    let messages = cachedMessages ? JSON.parse(cachedMessages) : [];

    messages.push(newMessage);
    await redis.setex(cacheKey, 3600, JSON.stringify(messages));

    res.status(200).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// /////////////////////////////////////////////////////////////////////////////////
// //get messages that we have sended and received before
// chatRoutes.get("/get-messages/:id", authMiddleware, async (req, res) => {
//     try {
//         userToChatId = req.params.id;
//         myId = req.user.id;
//         const messages = await messageModel.find({
//             $or: [{ senderId: myId, receiverId: userToChatId },
//             { senderId: userToChatId, receiverId: myId }]
//         });
//         res.status(200).json(messages);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// })

// //send messages
// chatRoutes.post("/send/:id", authMiddleware, async (req, res) => {
//     try {
//         receiverId = req.params.id;
//         senderId = req.user.id;
//         const { text, image } = req.body;

//         let imageUrl;
//         if (image) {
//             const uploadedImage = await cloudinary.uploader.upload(image);
//             imageUrl = uploadedImage.secure_url;
//         }
//         const newMessage=await messageModel.create({
//             receiverId,
//             senderId,
//             text,
//             image:imageUrl
//         })
//       //real time functinality by soket.io
//       res.status(200).json(newMessage);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }

// })

//////////////////////////////////////////////////////////////////////////////////////

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
