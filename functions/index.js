const functions = require("firebase-functions");
const {
	initializeApp,
	applicationDefault,
	cert,
} = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCGWRmaMEz4Gm3Xh5-KzuwKEgQnE468PNY",
	authDomain: "pricefinderpaget.firebaseapp.com",
	projectId: "pricefinderpaget",
	storageBucket: "pricefinderpaget.appspot.com",
	messagingSenderId: "484081121223",
	appId: "1:484081121223:web:6a27484e45085304168be2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const puppeteer = require("puppeteer");

async function scrape(query) {
	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		await page.goto(
			`https://www.facebook.com/marketplace/vancouver/search/?query=${query}`,
			{
				waitUntil: "networkidle2",
			}
		);

		await page.waitForTimeout(5000);

		const listings = await page.evaluate(async () => {
			return document.querySelector('[role="main"]').innerText;
		});

		await browser.close();

		return listings;
	} catch (err) {
		console.log(err);
	}
}

exports.helloWorld = functions.https.onRequest(async (request, response) => {
	try {
		const query = request.query.search;

		const rawListings = await scrape(query);

		const listings = rawListings.replace("/\n/g", " ");

		const completion = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: `${listings}, return the title and price of the 5 cheapest ${query}'s that is not an accessorie to a ${query} and is not an unrealistic price`,
			max_tokens: 128,
			temperature: 0.7,
		});

		const docRef = db.collection("listings").doc(`${Math.random()}`);

		await docRef.set({
			listing: completion.data.choices[0].text
		});

		response.set("Access-Control-Allow-Origin", "*");
		response.set("Access-Control-Allow-Methods", "GET, POST");
		response.set("Access-Control-Allow-Headers", "Content-Type");

		response.status(200);
		response.send(completion.data.choices[0].text);
	} catch (err) {
		console.log(err);
	}
});
