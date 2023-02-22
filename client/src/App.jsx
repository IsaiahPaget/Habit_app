import "./App.css";
import React, { useState, useEffect } from "react";
import NavBar from "./NavBar/NavBarComponent";
import SearchBar from "./Search/SearchBarComponent";
import ListingContainer from "./ListingsContainer/ListingsContainerComponent";
import {
	collection,
	getDocs,
	getFirestore,
	doc,
	setDoc,
	getDoc,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import Disclaimer from "./Disclaimer/DisclaimerComponent";
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
const provider = new GoogleAuthProvider();
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const functions = getFunctions();
const auth = getAuth();

export function handlePostQuery(e) {
	const postQuery = httpsCallable(functions, "postQuery");
	const query = e.toLowerCase();
	if (query !== null && query !== "") {
		postQuery({ text: query }).then((result) => {
			// Read result of the Cloud Function.
			const data = result.data;
			const success = data.text;
			console.log(success, data);
		});
	}
}

export function handleGetQueriesNow() {
	const postQuery = httpsCallable(functions, "getQueriesNow");
	postQuery().catch((err) => {
		console.log(err);
	});
}

function App() {
	const [isLoggedIn, setLogin] = useState(false);
	const [user, setUser] = useState(null);

	function handleLogin() {
		signInWithPopup(auth, provider)
			.then(async (result) => {
				try {
					// This gives you a Google Access Token. You can use it to access the Google API.
					const credential = GoogleAuthProvider.credentialFromResult(result);
					const token = credential.accessToken;
					// The signed-in user info.
					setUser(result.user);
					// IdP data available using getAdditionalUserInfo(result)

					const docRef = doc(firestore, "users", `${user.displayName}`);
					const docSnap = await getDoc(docRef);

					if (!docSnap.exists()) {
						await setDoc(doc(firestore, "users", `${user.displayName}`), {
							name: `${user.displayName}`,
							email: `${user.email}`,
							uid: `${user.uid}`,
						});
					}

					setLogin(true);
				} catch (err) {
					console.log(err);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function handleLogOut() {
		auth.signOut().then(() => {
			setLogin(false);
		});
	}

	// Check if user is already signed in
	auth.onAuthStateChanged((user) => {
		if (user) {
			setLogin(true);
			setUser(user);
		}
	});

	const [listings, setListings] = useState([]);

	useEffect(() => {
		getDocs(collection(firestore, "queries"))
			.then((querySnapshot) => {
				const fetchedListings = [];
				querySnapshot.forEach((doc) => {
					fetchedListings.push(doc.data());
				});
				setListings(fetchedListings);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	return (
		<main className='App'>
			<NavBar
				handleLogin={handleLogin}
				handleLogOut={handleLogOut}
				isLoggedIn={isLoggedIn}
				user={user}
			/>
			<SearchBar handlePostQuery={handlePostQuery} />
			{!isLoggedIn ? <Disclaimer /> : null}
			<ListingContainer listings={listings} />
		</main>
	);
}

export default App;
