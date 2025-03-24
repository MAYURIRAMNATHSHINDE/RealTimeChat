const express = require('express');
const chatrouter = express.Router();

const mongoose = require('mongoose');
const { chatModel } = require('../models/messageRoom.models');

// Create a new chat room
chatrouter.post('/create/chat', async (req, res) => {
    try {
        const { name, participants } = req.body;

        //if a room with the same name already exists
        const existingRoom = await chatModel.findOne({ name });
        if (existingRoom) {
            return res.status(400).json({ error: 'Chat room already exists' });
        }

   
        if (!participants || !Array.isArray(participants)) {
            return res.status(400).json({ error: 'Participants must be an array' });
        }

        // new chat room
        const newChatRoom = new chatModel({ name, participants });
        await newChatRoom.save();
        res.status(201).json(newChatRoom);
    } catch (error) {
        console.error('Error creating chat room:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all chat rooms
// router.get('/', async (req, res) => {
//     try {
//         const chatRooms = await chatModel.find().populate('participants', 'name email');
//         res.status(200).json(chatRooms);
//     } catch (error) {
//         console.error('Error fetching chat rooms:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// Get a chat room by ID
// router.get('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ error: 'Invalid chatRoomId' });
//         }

//         const chatRoom = await chatModel.findById(id).populate('participants', 'name email');
//         if (!chatRoom) {
//             return res.status(404).json({ error: 'Chat room not found' });
//         }

//         res.status(200).json(chatRoom);
//     } catch (error) {
//         console.error('Error fetching chat room:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// Update a chat room by ID
// router.put('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name, participants } = req.body;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ error: 'Invalid chatRoomId' });
//         }

//         const updatedChatRoom = await chatModel.findByIdAndUpdate(
//             id,
//             { name, participants },
//             { new: true, runValidators: true }
//         );

//         if (!updatedChatRoom) {
//             return res.status(404).json({ error: 'Chat room not found' });
//         }

//         res.status(200).json(updatedChatRoom);
//     } catch (error) {
//         console.error('Error updating chat room:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// Delete a chat room by ID
// router.delete('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ error: 'Invalid chatRoomId' });
//         }

//         const deletedChatRoom = await chatModel.findByIdAndDelete(id);

//         if (!deletedChatRoom) {
//             return res.status(404).json({ error: 'Chat room not found' });
//         }

//         res.status(200).json({ message: 'Chat room deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting chat room:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

module.exports = chatrouter;
