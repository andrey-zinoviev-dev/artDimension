const Order = require('../models/Order');
const User = require('../models/User');

const testDesc = 'Фактура и текстура в коллаже: 1000 (1 x 1000) Процент на благотворительность: 15% на благотворительность';
const saveOrder = (req, res) => {

  const { name, email, phone } = req.body;
  User.find({ phone: phone })
  .then((doc) => {
    const foundUser = doc.pop();
    if(!foundUser) {
      User.create({ name, email, phone })
      .then((createdUser) => {
        if(!createdUser) {
          return;
        }
        Order.create({ description: testDesc, buyer: createdUser })
        .then((createdOrder) => {
          Order.populate(createdOrder, { path: "buyer" })
          .then((orderPopulated) => {
            User.updateOne(
              { _id: createdUser._id },
              {$push: { orders: createdOrder}}
            )
            .then((resultOrder) => {
              console.log(resultOrder);
            })
            return res.status(201).send(orderPopulated);
          })
          // return res.status(201).send(createdOrder);
        })
      })
      return;
    }
    Order.create({ description: testDesc, buyer: foundUser })
    .then((createdOrder) => {
      if(!createdOrder) {
        return;
      }
      // createdOrder.populate()
      return res.status(201).send(createdOrder);
    })
  })
};

module.exports = {
  saveOrder,
}