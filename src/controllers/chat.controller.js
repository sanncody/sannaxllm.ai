const chatModel = require('../models/chat.model');

const createChat = async (req, res) => {
    const { title } = req.body;
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "User is not logged in" });
    }

    const chat = await chatModel.create({
        title,
        user: user._id,
    });

    res.status(201).json({
        message: "Chat creates successfully",
        chat: {
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }
    });
};

module.exports = {
    createChat
};