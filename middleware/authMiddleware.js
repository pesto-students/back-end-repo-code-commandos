const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
	const token = req.headers.authorization;
	console.log(token);
	// token = token.split(" ")[1];
	// const token = req.headers.authorization;
	// const token = req.cookies.token;
	if (!token) {
		return res
			.status(401)
			.json({ message: "Unauthorized - Missing token" });
	}

	jwt.verify(
		token.split(" ")[1],
		process.env.JWT_SECRET_KEY,
		(error, decoded) => {
			if (error) {
				return res.status(401).json({
					message: "Unauthorized - Invalid token",
					error: error,
				});
			}

			req.body["userId"] = decoded.userId;
			next();
		}
	);
};

module.exports = authenticateToken;
