const express = require('express');
const userModel = require('../models/user.model');

const router = express.Router();


router.post('/register', async (req, res) => {
    const { username, name, email, password } = req.body;

    const user = await userModel.create({
        username,
        name,
        email,
        password
    });

    res.status(201).json({ message: "User registered successfully!!", user });

});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check user's username
    const user = await userModel.findOne({ username });

    if (!user) {
        return res.status(401).json({ message: "User account not found" });
    }
    
    // Check user's password 
    const isPasswordValid = user.password === password;
    
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid Password" });
    }

    res.status(200).json({ message: "User logged in successfully" });
});

module.exports = router;