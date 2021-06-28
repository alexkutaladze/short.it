const mongoose = require("mongoose");

const shortURLSchema = new mongoose.Schema({
	destination: String,
	shortened: String,
	createdAt: Date,
	updatedAt: Date,
	visitCount: Number,
	creatorId: String,
	expiryDate: Date,
});

const userSchema = new mongoose.Schema({
	userName: String,
	fullName: String,
	createdAt: Date,
	updatedAt: Date,
});

exports.shortURL = mongoose.model("shortURL", shortURLSchema);
exports.user = mongoose.model("user", userSchema);
