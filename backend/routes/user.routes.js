const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userModel } = require('../models/user.models');
const saltRounds = 10;
const router = express.Router();

// User Signup
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // password hashing
        const OriginalPassword = req.body.password;
        bcrypt.hash(OriginalPassword, saltRounds, async function (err, hash) {
            if (err) {
                res.status(500).json({ message: 'error occured while hashing.', err });
            } else {
                const hashedPassword = hash;
                const newUser = await userModel.create({...req.body, password:hashedPassword});
                res.status(201).json({ message: 'User created successfully' });
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const OriginalPassword = req.body.password;
        const hashedPassword = user.password;
        bcrypt.compare(OriginalPassword, hashedPassword, function(err, result) {
            if(err){
                res.status(400).json({ message: 'Invalid credentials' });
            }else{
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
            }
        });

        //const isMatch = await bcrypt.compare(password, user.password);
 
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error'});
    }
});


router.post('/logout', async (req, res) => {
    try {
        const { userId } = req.body;
        await userModel.findByIdAndDelete(userId);
        res.status(200).json({ message: 'Logged out successfully and user data deleted' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error during logout', error });
    }
});









module.exports = router;