const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const message = new Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    text: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", message);
