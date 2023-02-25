import "./App.css";
import React, { useState, useEffect } from "react";
import NavBar from "./NavBar/NavBarComponent";
import SearchBar from "./Search/SearchBarComponent";
import ListingContainer from "./ListingsContainer/ListingsContainerComponent";
import {
	collection,
	query,
	orderBy,
	limit,
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
		postQuery({ text: query }).then(() => {
			// Read result of the Cloud Function.
			window.location.reload();
		});
	}
}

export function handleRemoveQuery(e) {
	const removeQuery = httpsCallable(functions, "removeQuery");
	const query = e.toLowerCase();
	if (query !== null && query !== "") {
		removeQuery({ text: query }).then(() => {
			// Read result of the Cloud Function.
			window.location.reload();
		});
	}
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

					const userRef = result.user;
					// The signed-in user info.
					// IdP data available using getAdditionalUserInfo(result)
					getDoc(doc(firestore, "users", userRef.uid)).then(async (doc) => {
						if (!doc.exists()) {
							await setDoc(doc(firestore, "users", userRef.uid), {
								name: userRef.displayName,
								email: userRef.email,
								uid: userRef.uid,
							});
						}
					});
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
			setUser(null);
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
		if (user !== null) {
			const docRef = doc(firestore, "users", user.uid);
			getDoc(docRef)
				.then((doc) => {
					if (doc.exists()) {
						if (!doc.data().subscriptions) {
							setListings([]);
						} else {
							setListings(doc.data().subscriptions);
						}
					}
				})
				.catch((err) => console.log(err));
		} else {
			const collectionRef = collection(firestore, "queries");
			const queryRef = query(collectionRef, limit(5));

			getDocs(queryRef)
				.then((querySnapshot) => {
					const fetchedListings = [];
					let i = 0;
					querySnapshot.forEach((doc) => {
						fetchedListings.push(doc.data().query);
						i++;
					});
					setListings(fetchedListings);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [user]);

	return (
		<main className='App'>
			<NavBar
				handleLogin={handleLogin}
				handleLogOut={handleLogOut}
				isLoggedIn={isLoggedIn}
				user={user}
			/>
			{isLoggedIn ? <SearchBar handlePostQuery={handlePostQuery} /> : null}
			{!isLoggedIn ? <Disclaimer /> : null}
			<ListingContainer listings={listings} isLoggedIn={isLoggedIn} />
		</main>
	);
}

export default App;
