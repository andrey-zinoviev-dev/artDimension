const express = require('express');
const router = express();
const { sendMessageToBot } = require('../controllers/messages');

router.post('/sendMessage', sendMessageToBot);

module.exports = {
  router,
}