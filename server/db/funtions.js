const { sign } = require("jsonwebtoken");

exports.randomString = function (length) {
	var result = "";
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return result;
};

exports.createAccessToken = function (user) {
	return sign({ username: user.userName }, process.env.ACCESS_TOKEN_SECRET);
};

// exports.createRefreshToken = function (user) {
// 	return sign(
// 		{ userId: user._id, tokenVersion: user.tokenVersion },
// 		process.env.REFRESH_TOKEN_SECRET,
// 		{ expiresIn: "7d" }
// 	);
// };
