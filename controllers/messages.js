const Order = require('../models/Order');
const User = require('../models/User');

const testDesc = 'Фактура и текстура в коллаже: 1000 (1 x 1000) Процент на благотворительность: 15% на благотворительность';
const saveOrder = (req, res) => {

  const { name, email, phone } = req.body;
  Order.create({description: testDesc})
  .then((doc) => {
    // console.log(doc);
    if(!doc) {
      return;
    }
    User.find({phone: phone})
    .then((foundUser) => {
      if(!foundUser) {
        return;
      }
      console.log(foundUser);

    });

  })
};

module.exports = {
  saveOrder,
}