const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/Order');
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
        let phoneNumber = '';

        if(!msg.contact.phone_number.includes("+")) {
          phoneNumber = phoneNumber.concat("\+", msg.contact.phone_number);
        } else {
          phoneNumber = msg.contact.phone_number;
        };
       
        User.find({phone: phoneNumber}).populate({path: 'orders', populate: {path: "buyer"}})
        .then((docs) => {
          const { orders } = docs.pop();

          const ordersButton = orders.map((order) => {
            return [{text: `${order.description.split(":")[0]}`, callback_data: JSON.stringify({orderId: order._id})}];
          });

          drawingBot.sendMessage(msg.chat.id, "Ваши заказы", {
            reply_markup: {
              inline_keyboard: ordersButton
            }
          });

        });
        // const phoneNumber = msg.contact.phone_number;
        // console.log(phoneNumber);
        // User.find({phone: msg.contact.phone_number}).populate({path: 'orders', populate: {path: "buyer"}})
        // .then((docs) => {
        //   const { orders } = docs.pop();
        //   if(!orders) {
        //     return ;
        //   }
       
        //   const ordersButton = orders.map((order) => {
        //     return [{text: `${order.description.split(":")[0]}`, callback_data: JSON.stringify({orderId: order._id})}];
        //   });

        //   // console.log(ordersButton);

        //   drawingBot.sendMessage(msg.chat.id, "Ваши заказы", {
        //     reply_markup: {
        //       inline_keyboard: ordersButton
        //     }
        //   })
        // });
        // drawingBot.sendMessage(message.chat.id , ``)
      })
    })
  }
  // if(message.text.includes('Заказ')) {
  //   console.log('yes');
  //   // return drawingBot.sendMessage(message.chat.id, )
  // }
});

drawingBot.on("callback_query", (callbackData) => {
  const { orderId, reassign, cancel } = JSON.parse(callbackData.data);
  // console.log(reassign, cancel);
  Order.findById(orderId)
  .then((foundOrder) => {
    drawingBot.answerCallbackQuery({
      callback_query_id: callbackData.id,
      show_alert: false,
    })
    .then((resultCallback) => {
      if(!resultCallback) {
        return;
      }
      if(reassign) {
        console.log('reassign lesson here');
        return;
      }
      if(cancel) {
        console.log('cancel lesson here');
        return;
      }
      drawingBot.sendMessage(callbackData.message.chat.id, `Вы записались на занятие ${foundOrder.description.split(":")[0]}. Что Вы хотите сделать с записью?`, {
        reply_markup: {
          inline_keyboard:[
            [{text: "Перезаписаться", callback_data: JSON.stringify({orderId: foundOrder._id, reassign: true})}],
            [{text: "Отменить запись", callback_data: JSON.stringify({orderId: foundOrder._id, cancel: true})}]
          ]
        }
      })
    })
  })
  // Order.findById
  // fetch()
})

app.use(express.json());
app.use("/", router);

app.listen(3000, () => {
  console.log(process.env.TOKEN);
});

// module.exports = {
//   artBot,
// };