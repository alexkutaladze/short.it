const mongoose = require("mongoose");
const { randomString } = require("./funtions");
const { shortURL, user } = require("./schemas");
const { hash } = require("bcryptjs");
const verify = require("jsonwebtoken/verify");
const uri = `mongodb+srv://mongoAlex:${process.env.DB_PASSWORD}@urls.umahx.mongodb.net/shortit?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;

exports.DBConnection = class DBConnection {
	constructor() {}

	initializeConnection() {
		db.on("error", () =>
			console.error("An error occurred while attempting to connect to the database")
		);
		db.on("open", () => console.log("Database connection established."));
	}

	async createNewShortURL(destination, userId) {
		userId = userId || "anonymous";
		let author;

		if (userId !== "anonymous") {
			let payload;
			try {
				payload = verify(userId, process.env.ACCESS_TOKEN_SECRET);
			} catch (error) {
				console.log(error);
				reject("Invalid token");
			}
			await user.findOne({ userName: payload.username }, (err, doc) => {
				author = doc;
			});
		}

		const query = shortURL.find({ destination: destination });

		return new Promise((resolve, reject) => {
			if (query.length > 0) {
				return resolve(query[0]);
			}

			const newEntry = new shortURL({
				destination: destination,
				shortened: randomString(6),
				createdAt: new Date(),
				updatedAt: new Date(),
				visitCount: 0,
				creatorId: author.userName,
			});

			newEntry.save(async err => {
				if (err) reject("Error occurred while creating a new entry");
				await user.updateOne(
					{ userName: author.userName },
					{
						$addToSet: {
							createdURLs: newEntry.shortened,
						},
					},
					(err, res) => {
						if (err) reject(err);
						console.log(res);
					}
				);
				resolve(newEntry);
			});
		});
	}

	createNewExpiringURL(destination, expiry, user) {
		user = user || "anonymous";
		const newEntry = new shortURL({
			destination: destination,
			shortened: randomString(6),
			createdAt: new Date(),
			updatedAt: new Date(),
			visitCount: 0,
			creatorId: user,
			expiryDate: new Date(expiry),
		});

		return new Promise((resolve, reject) => {
			newEntry.save(err => {
				if (err) {
					console.log(err);
					reject("Error occurred while creating a new entry");
				}
				resolve("New entry added!");
			});
		});
	}

	async registerUser(name, username, email, password) {
		const regex =
			/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

		const hashedPassword = await hash(password, 12);

		return new Promise((resolve, reject) => {
			if (!regex.test(email)) reject("Invalid email");
			const newUser = new user({
				userName: username,
				fullName: name,
				createdAt: new Date(),
				updatedAt: new Date(),
				email: email,
				password: hashedPassword,
				createdURLs: new Array(),
				visitedURLs: new Array(),
			});
			newUser.save(err => {
				if (err) {
					reject(err);
				}
				resolve({ status: "OK", createdUser: newUser });
			});
		});
	}

	async getLinkStats(links) {
		return new Promise(async (resolve, reject) => {
			let linksWithStats = new Array();
			for await (link of links) {
				await shortURL.findOne({ shortened: link }, (err, doc) => {
					if (err) reject(err);
					linksWithStats.push(doc);
				});
			}
			resolve(linksWithStats);
		});
	}
};
