const mongoose = require("mongoose");

const friends = mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    status: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Friends", friends);
