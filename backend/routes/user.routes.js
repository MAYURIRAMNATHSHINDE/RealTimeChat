const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userModel } = require('../models/user.models');
const authMiddleware = require('../middleware/auth.middleware');
const saltRounds = 10;
const router = express.Router();
const cloudinary = require('cloudinary').v2
// User Signup


router.get("/all-user",async (req,res)=>{
    try {
        const userData=await userModel.find()
        res.status(200).json(userData)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
})
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if(password.length<6){
            return res.status(400).json({msg:"password must be at least 6 character."})
        }
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

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
router.put("/update-profile",authMiddleware,async (req,res)=>{
    try{
        const {username,profilePic}=req.body;
        const userId=req.user.id;
// console.log(userId)
        if(!profilePic){
            return res.status(400).json({ message: 'profile pic is required.' });
        }
        const uploadPic = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await userModel.findByIdAndUpdate(userId,{ username,profilePic: uploadPic.secure_url },{ new: true });
        // console.log(updatedUser)
        res.status(200).json({msg:"pic uploaded successfully...",updatedUser});
    }catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error'});
    }
})

router.get("/profile", authMiddleware, async (req, res) => {
    try {
      // Fetch user from the database
      const user = await userModel.findById(req.user.id).select("username profilePic");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Send user profile data
      res.status(200).json({
        username: user.username,
        profilePic: user.profilePic || null,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
router.get("/check-auth",authMiddleware,(req,res)=>{
    try{
        console.log("CORS is working!");
        console.log(req.user)
        res.status(200).json(req.user)
    }catch(err){
        console.log(err)
        res.status(500).json({msg:"internal server error"})
    }
})






module.exports = router;