const http = require("http");
const cred = {};
const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");

const server = http.createServer(app);
// const socketID = require("socket.io");
const { Server } = require("socket.io");

const io = new Server(server, {
	cors: {
		origin: "*",
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
app.use(
	cors({
		origin: "https://matchmade.onrender.com",
		// origin: "*",
		credentials: true,
	})
);
app.use(express.json());

dbConnect();

app.get("/*", (req, res) => {
	res.send("Error 404. Page Not Found");
});

app.use("/user", usersRouter);
app.use("/chat", chatsRouter);
app.use("/message", messagesRouter);
app.use("/friends", friendsRouter);

io.use((socket, next) => {
	cred.token = socket.handshake.auth.token;
	console.log(`TOKEN received is : ${cred.token}`);
	next();
});

io.on("connection", (socket) => {
	console.log(`Server is ready to connect...`);
	socket.emit("welcome", `SOCKET ID :  ${socket.id}`);
	socket.join(cred.token);

	socket.on("message", (newMessage) => {
		socket.to(cred.token).emit("s-message", newMessage);
		console.log("Receiver message:" + newMessage);
		createMessage(newMessage);
	});
});

const createMessage = async (message) => {
	const { chatId, senderId, text } = message;
	console.log(chatId, senderId, text);

	await Message.create({
		chatId: chatId,
		senderId: senderId,
		text: text,
	})
		.then((response) => {
			console.log(response);
		})
		.catch((error) => {
			console.log(error);
		});
};
server.listen(process.env.PORT, () =>
	console.log(`Listening on port ${process.env.PORT}...`)
);
