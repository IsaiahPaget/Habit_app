// firebase initialization
const functions = require("firebase-functions");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");
initializeApp();
const db = getFirestore();

// openAi initialization
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

//cheerio initialization
const cheerio = require("cheerio");
const axios = require("axios");

async function sendEmail(query, text) {
	let emails = [];

	const usersRef = db.collection("users");
	const snapshots = await usersRef
		.where(`subscriptions`, "array-contains", query)
		.get();

	snapshots.forEach((doc) => {
		const data = doc.data();
		console.log("🚀 ~ file: index.js:30 ~ snapshots.forEach ~ data:", data);
		emails.push(data.email);
	});

	db.collection("mail").add({
		to: emails,
		message: {
			subject: `${query} Listings`,
			html: `<html><h3>Price Compass</h3><p>${text}</p></html>`,
		},
	});
}

async function currentDate() {
	const now = new Date();
	const day = now.getDate().toString().padStart(2, "0"); // e.g. "01", "02", etc.
	const month = (now.getMonth() + 1).toString().padStart(2, "0"); // e.g. "01", "02", etc.
	const year = now.getFullYear().toString(); // e.g. "2023"

	const dateString = `${day}-${month}-${year}`; // e.g. "23-02-2023"

	return dateString;
}

// getting inner html
async function getInnerText(query) {
	try {
		const response = await axios.get(
			`https://www.google.com/search?q=${query}&hl=en-GB&tbm=shop`
		);
		const $ = cheerio.load(response.data);

		const innerText = $(".sh-sr__shop-result-group").text();
		console.log("🚀 ~ file: index.js:29 ~ getInnerText ~ innerText:", innerText);
		return innerText;
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function addSubscription(uid, text) {
	const userRef = db.collection("users").doc(uid);
	await userRef.set(
		{
			subscriptions: admin.firestore.FieldValue.arrayUnion(text),
		},
		{ merge: true }
	);
}

async function removeSubscription(uid, text) {
	const userRef = db.collection("users").doc(uid);
	await userRef.update({
		subscriptions: admin.firestore.FieldValue.arrayRemove(text),
	});
}

// async function scrape(query) {
// 	try {
// 		const browser = await puppeteer.launch();
// 		const page = await browser.newPage();

// 		await page.goto(
// 			`https://www.facebook.com/marketplace/vancouver/search/?query=${query}`,
// 			{
// 				waitUntil: "networkidle2",
// 			}
// 		);

// 		await page.waitForTimeout(2000);

// 		const listings = await page.evaluate(async () => {
// 			return document.querySelector('[role="main"]').innerText;
// 		});

// 		await browser.close();

// 		return listings;
// 	} catch (err) {
// 		console.log(err);
// 	}
// }
exports.removeQuery = functions.https.onCall(async (data, context) => {
	// Message text passed from the client.
	const text = data.text;
	// Authentication / user information is automatically added to the request.
	const uid = context.auth.uid;
	const email = context.auth.token.email;

	if (uid !== null && email !== null) {

		removeSubscription(uid, text);

		return true;
	}
	return false;
});

exports.postQuery = functions.https.onCall(async (data, context) => {
	// Message text passed from the client.
	const text = data.text;
	// Authentication / user information is automatically added to the request.
	const uid = context.auth.uid;
	const email = context.auth.token.email;

	if (uid !== null && email !== null) {
		const queriesRef = db.collection("queries");
		const snapshots = await queriesRef.where(`query`, "==", text).get();

		if (snapshots.empty) {
			await db.collection("queries").add({
				query: text,
			});

			addSubscription(uid, text);

			return true;
		}
	}
	return false;
});

// ----------------------------------------------------------------
exports.getQueries = functions
	.runWith({ memory: "4GB" })
	.pubsub.schedule("20 18 * * 0-6")
	.onRun(async () => {
		try {
			const queryRef = db.collection("queries");

			const snapshot = await queryRef.get();
			if (snapshot.empty) {
				console.log("no documents");
				return;
			}

			const queries = snapshot.docs.map((doc) => doc.data());

			const date = await currentDate();

			await Promise.all(
				queries.map(async (queryObject) => {
					try {
						const query = queryObject.query;

						const rawListings = await getInnerText(query);

						const listings = rawListings.replace(/\n/g, " ");

						const completion = await openai.createCompletion({
							model: "text-davinci-003",
							prompt: `${listings}, return the title and price of the 5 cheapest ${query}'s that is not an accessorie to a ${query} and is not an unrealistic price. seperate each pick with a colon`,
							max_tokens: 128,
							temperature: 0.7,
						});

						const text = completion.data.choices[0].text;

						await db.collection("listings").add({
							listing: text,
							timeStamp: date,
						});

						await sendEmail(query, text);
					} catch (err) {
						console.log(err);
					}
				})
			);
		} catch (err) {
			console.log(err);
		}
	});
