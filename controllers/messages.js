const sendMessageToBot = (req, res) => {
  console.log(req.body);
  return res.status(201).send({
    message: "Сообщение отправлено"
  });

}

module.exports = {
  sendMessageToBot,
}