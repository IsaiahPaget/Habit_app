import { useAuthState } from "react-firebase-hooks/auth";
import FeaturedQueriesComponent from "../featuredqueries/FeaturedHabitsComponent";
import { auth } from "../../firebase/Auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LandingPageComponent() {
	const [user] = useAuthState(auth);
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate("/dashboard");
		}
	});

	return (
		<div>
			<FeaturedQueriesComponent />
		</div>
	);
}

export default LandingPageComponent;
