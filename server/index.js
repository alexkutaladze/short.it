require("dotenv").config();
const express = require("express");
const { DBConnection } = require("./db/mongo");
const { shortURL, user } = require("./db/schemas");
const bodyParser = require("body-parser");
const { default: fetch } = require("node-fetch");
const { compare } = require("bcryptjs");
const { createAccessToken } = require("./db/funtions");
const cookieParser = require("cookie-parser");
const { verify } = require("jsonwebtoken");
const app = express();
const port = 4000;
const cors = require("cors");

const serverDB = new DBConnection();
serverDB.initializeConnection();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

app.post("/createNew", async (req, res) => {
	const requestBody = req.body;
	let url = requestBody.url;

	if (!url.includes("http")) {
		url = `https://${url}`;
	}

	serverDB
		.createNewShortURL(requestBody.url, req.headers["authorization"].split(" ")[1])
		.then(value => {
			res.send(value);
		})
		.catch(() => res.sendStatus(403));
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

app.get("/visit", async (req, res) => {
	const { short, by } = req.query;
	console.log(short, by);

	const documents = await shortURL.find({ shortened: short });

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
			{ shortened: short },
			{ visitCount: documents[0].visitCount + 1, updatedAt: new Date() },
			(err, response) => {
				if (err) console.log(err);
				else {
					const updateVisited = user.updateOne(
						{ userName: by },
						{
							$addToSet: { visitedURLs: documents[0].shortened },
						},
						err => {
							if (err) throw new Error(err);
						}
					);
				}
			}
		);
	} else {
		res.sendStatus(404);
	}
});

app.delete("/deleteURL", async (req, res) => {
	const requestBody = req.body;
	const deletedDoc = await shortURL.deleteOne({ shortened: requestBody.shortened }, err => {
		if (err) res.send("Deletion unsuccessful");
		res.sendStatus(200);
	});
});

app.post("/register", async (req, res) => {
	const requestBody = req.body;
	const checkUsername = await user.findOne({ userName: requestBody.username });
	const checkEmail = await user.findOne({ email: requestBody.email });

	if (!checkUsername && !checkEmail) {
		serverDB
			.registerUser(requestBody.name, requestBody.username, requestBody.email, requestBody.password)
			.then(values => res.send(values))
			.catch(err => res.send(err));
	} else {
		res.send("User already exists with specified email or username");
	}
});

app.post("/login", async (req, res) => {
	const requestBody = req.body;
	const findUser = await user.find({ userName: requestBody.username });

	// user not found
	if (findUser.length === 0) res.send("User not found");

	const pwdValidation = await compare(requestBody.password, findUser[0].password);
	// incorrect password
	if (!pwdValidation) res.send("Incorrect password");

	// successful login
	res.json({ ok: true, accessToken: createAccessToken(findUser[0]), user: findUser[0] });
});

app.get("/logout", (req, res) => {
	res.clearCookie("jid");
	res.send("logged out");
});

app.get("/auth", async (req, res) => {
	const headers = req.headers["authorization"];
	const token = headers.split(" ")[1];

	let payload;
	try {
		payload = verify(token, process.env.ACCESS_TOKEN_SECRET);
	} catch (error) {
		console.log(error);
		res.send({ ok: false, accessToken: "" });
	}

	const findUser = await user.findOne({ userName: payload.username });

	return res.send({ ok: true, user: findUser });
});

app.post("/getLinkAnalytics", async (req, res) => {
	const requestBody = req.body;

	let linkAnalytics = [];
	for (item of requestBody.urls) {
		await shortURL.findOne({ shortened: item }, (err, doc) => {
			if (err) return res.send("Error while fetching URL analytics");
			linkAnalytics.push(doc);
		});
	}

	return res.send(linkAnalytics);
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
