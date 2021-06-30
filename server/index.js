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

const serverDB = new DBConnection();
serverDB.initializeConnection();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

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
				.then(value => res.send(value))
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
	res.cookie("jid", createAccessToken(findUser[0]), {
		httpOnly: true,
	});

	res.send({ OK: true });
});

app.get("/logout", (req, res) => {
	res.clearCookie("jid");
	res.send("logged out");
});

app.get("/auth", async (req, res) => {
	let payload;
	try {
		payload = verify(req.cookies.jid, process.env.ACCESS_TOKEN_SECRET);
	} catch (error) {
		console.log(error);
		res.send({ ok: false, accessToken: "" });
	}

	const findUser = await user.find({ userName: payload.username });

	return res.send({ ok: true, user: findUser });
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
