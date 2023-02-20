import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

function App() {
	const [data, setData] = useState(null);

	useEffect(() => {
		axios
			.put(
				"https://us-central1-pricefinderpaget.cloudfunctions.net/helloWorld?search=bed"
			)
			.then((response) => {
				console.log(response);
				setData(response.data);
			})
			.catch((error) => console.log(error));
	}, []);

	return (
		<div className='App'>{data ? <p>{data.title}</p> : <p>Loading...</p>}</div>
	);
}

export default App;
