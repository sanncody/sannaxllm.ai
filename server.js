require('dotenv').config();

const { createServer } = require('node:http');

const app = require("./src/app");
const connectDB = require('./src/db/db');
const initSocketServer = require('./src/sockets/socket.server');

connectDB();

const httpServer = createServer(app);
initSocketServer(httpServer);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server is listening at PORT ${PORT}✔️`);
});