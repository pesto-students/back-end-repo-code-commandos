const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const astro = new Schema(
	{
		signs: Array,
		description: String,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Astro", astro);
