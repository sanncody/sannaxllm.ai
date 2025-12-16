const { Server } = require('socket.io');
const cookie = require('cookie');

const app = require('../app');

const initSocketServer = (httpServer) => {
    const io = new Server(httpServer, {});

    // Use Socket.io Middleware just to ensure that only logged in user can create socket connection
    io.use((socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers.cookie);
        console.log(cookies);
        
    });

    io.on('connection', (socket) => {
        console.log("New socket connection", socket.id);
    });
};

module.exports = initSocketServer;