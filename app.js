const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const { router } = require('./routes/router');
const TelegramBot = require('node-telegram-bot-api');

const app = express();

app.use(cors({origin: "http://127.0.0.1:5173", credentials: true, allowedHeaders: "Content-Type, Authorization"}));

const drawingBot = new TelegramBot(process.env.TOKEN, {
  polling: true,
});

//db connection
mongoose.connect('mongodb://127.0.0.1:27017/bot');

//bot commands
drawingBot.on('message', (message) => {
  if(message.text === '/start') {
    return drawingBot.sendMessage(message.chat.id, `Здравствуйте, ${message.chat.first_name}!`)
  }

  if(message.text === '/profile') {
    // console.log(message);
    return drawingBot.sendMessage(message.chat.id, `Ваш профиль - ${message.from.username}. Предоставьте, пожалуйста, свой номер телефона, чтобы найти Ваши заказы`, {
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [[{text: "Поделиться контактом", request_contact: true}], [{text: "Не делиться"}]],
      }
    })
    .then(() => {
      drawingBot.once("contact", (msg) => {
        //continue here
        User.find({phone: msg.contact.phone_number}).populate({path: 'orders', populate: {path: "buyer"}})
        .then((docs) => {

        });
        // drawingBot.sendMessage(message.chat.id , ``)
      })
    })
  }
  
});
app.use(express.json());
app.use("/", router);

app.listen(3000, () => {
  console.log(process.env.TOKEN);
});

// module.exports = {
//   artBot,
// };