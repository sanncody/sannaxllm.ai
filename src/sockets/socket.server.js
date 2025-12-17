const { Server } = require('socket.io');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');

const app = require('../app');
const userModel = require('../models/user.model');

const initSocketServer = (httpServer) => {
    const io = new Server(httpServer, {});

    // Use "Socket.io Middleware" just to ensure that only logged in user can create socket.io connection
    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers.cookie || "");
        console.log(cookies);
        
        // If token not found then pass the request further with an error
        if (!cookies.token) {
            next(new Error("Authentication Error: No token provided"));
        }

        try {
            // If token found, then verify the token
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET_KEY);

            const user = await userModel.findOne({ _id: decoded.id });

            socket.user = user;

            next();
        } catch (error) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on('connection', (socket) => {
        socket.on('ai-message', async (messagePayload) => {
            console.log(messagePayload);
        });
    });
};

module.exports = initSocketServer;