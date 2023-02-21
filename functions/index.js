// firebase initialization
const functions = require("firebase-functions");
const {
	initializeApp,
	applicationDefault,
	cert,
} = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
initializeApp();
const db = getFirestore();
const { Configuration, OpenAIApi } = require("openai");

// openAi initialization
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

//cheerio initialization
const cheerio = require("cheerio");
const axios = require("axios");

// getting inner html
async function getInnerText(query) {
	try {
		const response = await axios.get(
			`https://www.google.com/search?q=laptop&hl=en-GB&tbm=shop&sxsrf=AJOqlzUhx8MiUt6XMiOPutUjlhwKujE1kw%3A1677019625283&psb=1&ei=6Un1Y8izEITk0PEPudCE-AU&ved=0ahUKEwiIzK742Kf9AhUEMjQIHTkoAV8Q4dUDCAg&oq=${query}&gs_lcp=Cgtwcm9kdWN0cy1jYxAMMgcIIxCwAxAnMg0IABCxAxCDARCwAxBDMg0IABCxAxCDARCwAxBDMgcIABCwAxBDMg0IABCxAxCDARCwAxBDMg0IABCxAxCDARCwAxBDMg4IABCABBCxAxCDARCwAzIOCAAQgAQQsQMQgwEQsAMyCAgAEIAEELADMg4IABCABBCxAxCDARCwA0oECEEYAVAAWABgwAloAXAAeACAAQCIAQCSAQCYAQDIAQrAAQE&sclient=products-cc`
		);
		const $ = cheerio.load(response.data);

		setTimeout(() => {
			const innerText = $(".sh-sr__shop-result-group").text();
			console.log("🚀 ~ file: index.js:29 ~ getInnerText ~ innerText:", innerText);
			return innerText;
		}, 2000);
	} catch (error) {
		console.error(error);
		return null;
	}
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

exports.postQuery = functions.https.onCall(async (data, context) => {
	// Message text passed from the client.
	const text = data.text;
	// Authentication / user information is automatically added to the request.
	const uid = context.auth.uid;
	const email = context.auth.token.email;

	if (uid !== null && email !== null) {
		await db.collection("queries").add({
			query: text,
		});
		return true;
	} else {
		return false;
	}
});

// ----------------------------------------------------------------
exports.getQueries = functions
	.runWith({ memory: "4GB" })
	.pubsub.schedule("15 15 * * 0-6")
	.onRun(async () => {
		try {
			const queryRef = db.collection("queries");

			const snapshot = await queryRef.get();
			if (snapshot.empty) {
				console.log("no documents");
				return;
			}

			const queries = snapshot.docs.map((doc) => doc.data());

			await Promise.all(
				queries.map(async (queryObject) => {
					try {
						const query = queryObject.query;

						const rawListings = await getInnerText(query);

						const listings = await rawListings.replace(/\n/g, " ");

						const completion = await openai.createCompletion({
							model: "text-davinci-003",
							prompt: `${listings}, return the title and price of the 5 cheapest ${query}'s that is not an accessorie to a ${query} and is not an unrealistic price. seperate each pick with a colon`,
							max_tokens: 128,
							temperature: 0.7,
						});

						await db.collection("listings").add({
							listing: completion.data.choices[0].text,
						});
					} catch (err) {
						console.log(err);
					}
				})
			);
		} catch (err) {
			console.log(err);
		}
	});
