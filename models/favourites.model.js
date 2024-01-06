const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const favourite = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    favouriteUserId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Favourite",favourite);