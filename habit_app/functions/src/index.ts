/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as puppeteer from "puppeteer";

type ScrapeQuery = {
	query: string;
	city: string;
};

// Start writing functions
// https://firebase.google.com/docs/functions/typescript
async function scrape(data: ScrapeQuery) {
	const browser = await puppeteer.launch({
		headless: true,
	});
	const page = await browser.newPage();

	await page.goto("https://facebook.com", {
		waitUntil: "networkidle2",
	});

	await page.type("#email", "pricecompasspst@gmail.com");
	await page.type("#pass", "Asdertxcv2635");
	await page.$eval("[name=login]", (button) =>
		button.removeAttribute("disabled")
	);
	await page.click("[name=login]");
	await page.waitForNavigation();

	await page.goto(`https://facebook.com/marketplace/category/search/?query=${data.query}`);


	const text = await page.evaluate(async () => {
		return document.body.innerHTML;
	});

	return text;
}

export const helloWorld = onRequest(async (request, response) => {
	try {
		const text = await scrape({ city: "Vernon, British Columbia", query: "phone" });
		response.set("Access-Control-Allow-Origin", "*");
		response.send(text);
	} catch (error) {
		console.error(error);
	}
});
