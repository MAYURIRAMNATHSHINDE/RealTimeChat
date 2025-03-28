const mongoose = require('mongoose');
require('dotenv').config()

const ConnectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected')

    } catch (err) {
        console.error('MongoDB connection error:', err)
    }
}

module.exports={ConnectToDB}
