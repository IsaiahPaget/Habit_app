import { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginComponent from "./components/login/LoginComponent";
import LandingPageComponent from "./components/landingpage/LandingPageComponent";
import DashBoardComponent from "./components/dashboard/DashBoardComponent";
const localURL = "http://127.0.0.1:5001/pricecompass/us-central1/helloWorld";
const webURL = "https://helloworld-ok7kngizva-uc.a.run.app";
const url = localURL;
// Initialize Firebase

function App() {
	const [count, setCount] = useState("");

	useEffect(() => {
		fetch(url)
			.then((response) => response.text())
			.then((response) => setCount(response));
	});


	return (
		<>
			<LoginComponent />
			<Routes>
				<Route path='/' element={<LandingPageComponent />} />
				<Route path='/dashboard' element={<DashBoardComponent />} />
			</Routes>
			<div>count is {count}</div>
		</>
	);
}

export default App;
