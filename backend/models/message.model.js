const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom'},
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    image:{type:String}

}, { timestamps: true });

 const messageModel= mongoose.model('Message', messageSchema);

 module.exports={messageModel}