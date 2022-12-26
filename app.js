const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { router } = require('./routes/router');

const TelegramBot = require('node-telegram-bot-api');

const drawingBot = new TelegramBot(process.env.TOKEN, {
  polling: true,
});

app.use(cors({origin: "http://127.0.0.1:5173", credentials: true, allowedHeaders: "Content-Type, Authorization"}))

// drawingBot.on("new_chat_members", (message) => {
//   console.log(message.chat.id);
//   // artBot.sendMessage()
// });

drawingBot.on('message', (message) => {
  if(message.text === '/start') {
    drawingBot.sendMessage(message.chat.id, "Как рисование?")
  }
  // artBot.sendMessage()
});
app.use(express.json());
app.use("/", router);

app.listen(3000, () => {
  console.log(process.env.TOKEN);
});

// module.exports = {
//   artBot,
// };