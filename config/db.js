const mongoose = require("mongoose");

const dbConnect = async () => {
	try {
		await mongoose.connect(process.env.DB_URL, {
			dbName: "match-made",
		});
		console.log("DB Connected...");
	} catch (error) {
		console.log("Error: " + error);
	}
};

module.exports = dbConnect;
