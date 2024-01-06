const jwt = require("jsonwebtoken");
	
const authenticateToken = (req, res, next) => {
	// console.log(req.body)
	// const token = req.header("Authorization");
	const token = req.cookies.token;
	if (!token) {
		return res
			.status(401)
			.json({ message: "Unauthorized - Missing token" });
	}

	jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
		if (error) {
			return res.status(401).json({
				message: "Unauthorized - Invalid token",
				error: error,
			});
		}

		req.body['userId'] = decoded.userId;
		// console.log("From auth: "+req.body);
		// console.log("From auth: "+req.body.userId);
		// console.log("From auth: "+req.body.favouriteUserId);
		next();
	});
};

module.exports = authenticateToken;
