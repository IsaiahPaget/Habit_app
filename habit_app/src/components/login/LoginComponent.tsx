import { auth, firebaseSignIn, firebaseSignOut } from "../../firebase/Auth";
import { useAuthState } from "react-firebase-hooks/auth";

function LoginComponent() {
	const [user] = useAuthState(auth);

	return user ? (
		<div onClick={() => firebaseSignOut()}>Log Out</div>
	) : (
		<div onClick={() => firebaseSignIn()}>Login</div>
	);
}

export default LoginComponent;
