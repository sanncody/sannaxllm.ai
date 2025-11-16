const express = require('express');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user.model');

const router = express.Router();

/**
 * POST /register
 * POST /login
 * GET /user [protected]
 */

router.post('/register', async (req, res) => {
    const { username, name, email, password } = req.body;

    const userExists = await userModel.findOne({ username });

    if (userExists) {
        return res.status(409).json({ message: "Username already in use" });
    }

    const user = await userModel.create({
        username,
        name,
        email,
        password
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    res.cookie('token', token);

    res.status(201).json({ message: "User registered successfully", user });
});

module.exports = router;