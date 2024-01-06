const jwt = require("jsonwebtoken");
	
const authenticateToken = (req, res, next) => {
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
		next();
	});
};

module.exports = authenticateToken;
