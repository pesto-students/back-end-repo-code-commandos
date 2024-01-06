const Chat = require("../models/chat.model");
const User = require("../models/user.model");

const findUsers = async (id) => {
  let result = {};

  await User.findById(id,{firstName:1,lastName:1})
    .then((response) => (result = response.toJSON()))
    .catch((error) => error);

  return result;
};
exports.createChat = async (req, res) => {
  const { senderId, receiverId } = req.body;

  await Chat.create({
    users: [senderId, receiverId],
  })
    .then((response) =>
      res.status(200).send({ message: response, error: false })
    )
    .catch((error) => res.status(400).send({ message: error, error: true }));
};

exports.getChat = async (req, res) => {
  const { userId } = req.body;
  await Chat.find({
    users: { $in: [userId] },
  })
    .then(async(response) => {
      const chatData = await Promise.all(
        response.map(async (request) => {
        let index = 1;
        if (request.users.indexOf(userId) == 1) index = 0;
        const chatList = await findUsers(request.users[index])
        chatList['chatId'] = request._id
        chatList['userId'] = userId
        return chatList;
      }));
      res.status(200).send({ message: chatData, error: false });
    })
    .catch((error) => res.status(400).send({ message: error, error: true }));
};
