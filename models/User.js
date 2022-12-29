const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  phone: String,
  orders: [
    {type: mongoose.Schema.Types.ObjectId, ref: "Order"}
  ],
});

module.exports = mongoose.model("User", UserSchema);