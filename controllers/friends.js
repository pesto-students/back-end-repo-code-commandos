const Friends = require("../models/friends.model");
const User = require("../models/user.model");
const Chat = require("../models/chat.model");

const findUsers = async (id) => {
 
  let result = {};
  // console.log(id);

  console.log(id);
  await User.findById(id)
    .then((response) => (result = response.toJSON()))
    .catch((error) => error);

  console.log(result);
  return result;
};

exports.sentRequests = async (req, res) => {
  const { userId } = req.body;
  console.log(userId);

  await Friends.find({
    senderId: userId,
  })
    .then(async (response) => {
      // let newResponse = response.map(findUsers);
      const usersData = await Promise.all(
        response.map(async (request) => {
          const receiverUserData = await findUsers(request.receiverId);
          // receiverUserData = {...receiverUserData, status:response.status}
          receiverUserData["status"] = request.status;
          return receiverUserData;
        })
      );
      console.log("NN::"+usersData)
      res.status(200).send({ message: usersData, error: false });
    })
    .catch((error) => res.status(500).send({ message: error, error: true }));
};

exports.sendRequest = async (req, res) => {
  const { userId, receiverId } = req.body;

  await Friends.create({
    senderId: userId,
    receiverId: receiverId,
    status: "Pending",
  })
    .then((response) =>
      res.status(200).send({ message: response, error: false })
    )
    .catch((error) => res.status(500).send({ message: error, error: true }));
};

exports.receivedRequests = async (req, res) => {
  const { userId } = req.body;
  await Friends.find({
    receiverId: userId,
    status: "Pending",
  })
    .then(async (response) => {
      const usersData = await Promise.all(
        response.map(async (request) => {
          const receiverUserData = await findUsers(request.senderId);
          // receiverUserData = {...receiverUserData, status:response.status}
          receiverUserData["status"] = request.status;
          receiverUserData["requestId"] = request._id;
          receiverUserData["senderId"] = request.senderId;

          return receiverUserData;
        })
      );
      res.status(200).send({ message: usersData, error: false });
    })
    .catch((error) => res.status(500).send({ message: error, error: true }));
};

exports.updateRequest = async (req, res) => {
  const { userId, senderId, requestId, status } = req.body;
  await Friends.updateOne(
    { _id: requestId },
    {
      status: status,
    }
  )
    .then(async (response) =>{
      if(status == 'Accepted'){
        await Chat.create({
          users:[userId, senderId]
        }).then((result) => {
          return res.status(200).send({ message: result, error: false })
        })
      }
    }
    )
    .catch((error) => res.status(500).send({ message: error, error: true }));
};
