const express = require('express');
const router = express();
const { saveOrder } = require('../controllers/messages');

router.post('/saveOrder', saveOrder);

module.exports = {
  router,
}