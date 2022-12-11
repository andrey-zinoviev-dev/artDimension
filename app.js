const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const TelegramBot = require('node-telegram-bot-api');

const artBot = new TelegramBot(process.env.TOKEN, {
  polling: true,
});

artBot.on('message', (message) => {
  console.log(message.chat.id);
  // artBot.sendMessage()
});

app.listen(3000, () => {
  console.log(process.env.TOKEN);
})