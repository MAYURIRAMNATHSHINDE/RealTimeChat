const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    {
        timestamps: true
    });

const chatModel = mongoose.model('ChatRoom', chatRoomSchema);
module.exports={chatModel}