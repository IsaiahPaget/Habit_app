import AddQueriesComponent from "../addqueries/AddHabitComponent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/Auth";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import UsersHabitsComponent from "../usersqueries/UsersHabitsComponent";

function DashBoardComponent() {
	const [user] = useAuthState(auth);
	const navigate = useNavigate();
	useEffect(() => {
		if (!user) {
			navigate("/");
		}
	});

	return (
		<div>
			<AddQueriesComponent />
			<UsersHabitsComponent/>
		</div>
	);
}

export default DashBoardComponent;
