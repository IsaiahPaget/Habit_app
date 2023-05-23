import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
	getAdditionalUserInfo,
} from "firebase/auth";
import { app } from "./Firebase";
import { signInNewUser } from "./firestore";

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export async function firebaseSignIn() {
	signInWithPopup(auth, provider)
		.then(async (result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result)!;
			const token = credential.accessToken;
			const user = result.user;
			const isFirstLogin = getAdditionalUserInfo(result)!.isNewUser;
			// The signed-in user info.
			// IdP data available using getAdditionalUserInfo(result)
			if (isFirstLogin) {
				await signInNewUser(user);
			}
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
			// ...
			console.error(errorCode, errorMessage, email, credential);
		});
}

export async function firebaseSignOut() {
	signOut(auth)
		.then(() => {
			console.log("signed out");
		})
		.catch((error) => {
			// An error happened.
			console.error(error);
		});
}
