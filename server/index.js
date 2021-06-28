const express = require("express");
const { DBConnection } = require("./db/mongo");
const { shortURL } = require("./db/schemas");
const bodyParser = require("body-parser");
const { default: fetch } = require("node-fetch");
const app = express();
const port = 4000;

const serverDB = new DBConnection();
serverDB.initializeConnection();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/createNew", async (req, res) => {
	const requestBody = req.body;
	let url = requestBody.url;
	if (!url.includes("https://")) {
		url = `https://${url}`;
	}

	await fetch(url)
		.then(() => {
			serverDB
				.createNewShortURL(requestBody.url)
				.then(() => res.sendStatus(200))
				.catch(() => res.sendStatus(403));
		})
		.catch(e => res.send("Invalid URL"));
});

app.post("/createNewWithExpiry", async (req, res) => {
	const requestBody = req.body;
	let url = requestBody.url;
	if (!url.includes("https://")) {
		url = `https://${url}`;
	}

	await fetch(url)
		.then(() => {
			serverDB
				.createNewExpiringURL(requestBody.url, requestBody.expiry)
				.then(() => res.sendStatus(200))
				.catch(() => res.sendStatus(403));
		})
		.catch(e => res.sendStatus(404));
});

app.get("/visit/:short", async (req, res) => {
	const params = req.params;
	const documents = await shortURL.find({ shortened: params.short });

	if (documents.length > 0) {
		let url = documents[0].destination.includes("https://")
			? documents[0].destination
			: `https://${documents[0].destination}`;
		if (documents[0].expiryDate) {
			if (documents[0].expiryDate > new Date()) {
				res.redirect(url);
			} else {
				res.sendStatus(412);
			}
		} else {
			res.redirect(url);
		}
		shortURL.updateOne(
			{ shortened: params.short },
			{ visitCount: documents[0].visitCount + 1, updatedAt: new Date() },
			(err, response) => err && console.log(err)
		);
	} else {
		console.log(documents);
		res.sendStatus(404);
	}
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
