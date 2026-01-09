const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userModel = require('../models/user.model');

const registerUser = async (req, res) => {
    const { fullName: { firstName, lastName }, email, password } = req.body;
    
    const userExists = await userModel.findOne({ email });

    if (userExists) {
        return res.status(409).json({ message: "User already exists with provided email" });
    }

    const user = await userModel.create({
        fullName: {
            firstName,
            lastName
        },
        email,
        password: await bcrypt.hash(password, 10)
    });

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    res.cookie('token', token);

    res.status(201).json({ 
        message: "User registered successfully", 
        user: {
            email: user.email,
            _id: user._id,
            fullName: user.fullName
        }
    });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        res.status(401).json({ message: "User account not found" });
    }

    // Check validity of password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

    res.cookie('token', token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3) // 3 days
    });

    res.status(200).json({ 
        message: "User logged in successfully",
        user: {
            email: user.email,
            _id: user._id,
            fullName: user.fullName
        }
    });
};

module.exports = {
    registerUser,
    loginUser
};