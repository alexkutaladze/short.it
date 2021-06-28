const mongoose = require("mongoose");
const { randomString } = require("./funtions");
const { shortURL } = require("./schemas");
const uri =
	"mongodb+srv://mongoAlex:mongoNewPassword@urls.umahx.mongodb.net/shortit?retryWrites=true&w=majority";
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

	createNewShortURL(destination, user) {
		user = user || "anonymous";
		const newEntry = new shortURL({
			destination: destination,
			shortened: randomString(6),
			createdAt: new Date(),
			updatedAt: new Date(),
			visitCount: 0,
			creatorId: user,
		});

		return new Promise((resolve, reject) => {
			newEntry.save(err => {
				if (err) reject("Error occurred while creating a new entry");
				resolve("New entry added!");
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
};
