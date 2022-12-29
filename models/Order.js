const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
  description: String,
  buyer: {
    type: mongoose.Schema.Types.ObjectId, ref: "User",
  },
});

module.exports = mongoose.model("Order", OrderSchema);