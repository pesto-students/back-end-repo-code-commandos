const Message = require("../models/message.model");

exports.createMessage = async (req, res) => {
  const { chatid, senderid, texts } = req.body;
  console.log(chatid,senderid,texts)

  await Message.create({
    chatId: chatid,
    senderId: senderid,
    text: texts,
  })
    .then((response) => {
      res.status(200).send({ message: response, error: false });
    })
    .catch((error) => {
      res.status(400).send({ message: error, error: true });
    });
};

exports.getMessage = async (req, res) => {
  const { chatId } = req.body;

  await Message.find({
    chatId: chatId,
  })
    .then((response) => {
      res.status(200).send({ message: response, error: false });
    })
    .catch((error) => {
      res.status(400).send({ message: error, error: true });
    });
};
