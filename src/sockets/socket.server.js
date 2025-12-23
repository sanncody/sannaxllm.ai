const { Server } = require('socket.io');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');

const messageModel = require('../models/message.model');
const userModel = require('../models/user.model');
const aiService = require('../services/ai.service');

const { createMemory, queryMemory } = require('../services/vector.service');

const initSocketServer = (httpServer) => {
    const io = new Server(httpServer, {});

    // Use "Socket.io Middleware" just to ensure that only logged in user can create socket.io connection
    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers.cookie || "");
        
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

            const message = await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user._id,
                content: messagePayload.content,
                role: "user"
            });

            /* Saving User message to vectors */
            const vectors = await aiService.generateVector(messagePayload.content);

            /* Storing the converted vectors into pinecone vector database */
            await createMemory({ 
                vectors, 
                messageId: message._id,
                metadata: {
                    chatId: messagePayload.chat,
                    text: messagePayload.content,
                    user: socket.user._id
                }, 
            });

            /* Implementation of short term memory (or maintaining chat-history) */
            const chatHistory = await messageModel.find({
                chat: messagePayload.chat
            }).limit(4).lean();

            const response = await aiService.generateResponse(chatHistory.map(chat => {
                return {
                    role: chat.role,
                    parts: [{ text: chat.content }]
                }
            }));

            const responseMessage = await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user._id,
                content: response,
                role: "model"
            });

            /* Conversion of response message to vectors */
            const responseVectors = await aiService.generateVector(response);

            /* Storing the response vectors to vector database */
            await createMemory({
                vectors: responseVectors,
                metadata: {
                    chatId: messagePayload.chat,
                    text: response,
                    user: socket.user._id
                },
                messageId: responseMessage._id
            })

            socket.emit('ai-response', {
                content: response,
                chat: messagePayload.chat
            });

        });
    });
};

module.exports = initSocketServer;