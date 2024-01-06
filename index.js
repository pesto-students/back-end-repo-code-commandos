const http = require("http");

const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const server = http.createServer(app);
const socketID = require("socket.io");

const io = socketID(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const cors = require("cors");
const dbConnect = require("./config/db");

// === Routers ===
const usersRouter = require("./routes/user.route");
const chatsRouter = require("./routes/chat.route");
const messagesRouter = require("./routes/message.route");
const friendsRouter = require("./routes/friends.route");

// === Model ===
const Message = require("./models/message.model");
const Chat = require("./models/chat.model");

require("dotenv").config();

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

dbConnect();

app.get("/*", (req, res) => {
  res.send("Error 404. Page Not Found");
});

app.use("/user", usersRouter);
app.use("/chat", chatsRouter);
app.use("/message", messagesRouter);
app.use("/friends", friendsRouter);

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("get-id", (Id) => {
    console.log("IDs " + Id.chatId);
    // await Message.find({ chatId: Id.chatId })
    //       .then((result) =>
    //         socket.emit("connection-id", { id: chatId, result: result })
    //       )
    //       .catch((error) => console.log(error));
  });

  socket.on("message", (newMessage) => {
    console.log("Receiver message:" + newMessage.texts);
    createMessage(newMessage);
  });
});

const createMessage = async (message) => {
  const { chatId, senderid, texts } = message;
  console.log(chatId, senderid, texts);

  await Message.create({
    chatId: chatId,
    senderId: senderid,
    text: texts,
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};
server.listen(3000, () => console.log("Listening on port 3000..."));
