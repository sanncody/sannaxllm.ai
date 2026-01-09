const express = require('express');

/* Requiring Auth middleware */
const authMiddleware = require('../middlewares/auth.middleware');

/* Requiring chat Controller */
const chatController = require('../controllers/chat.controller');

const router = express.Router();

router.post('/', authMiddleware.authUser, chatController.createChat);

module.exports = router;