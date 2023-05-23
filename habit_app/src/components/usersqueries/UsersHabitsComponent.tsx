import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase/firestore";
import { auth } from "../../firebase/Auth";
import { useAuthState } from "react-firebase-hooks/auth";
import SubscriptionComponent from "../subscription/SubscriptionComponent";
import { Habit } from "../../firebase/firestore";
import { useEffect, useState } from "react";

function UsersHabitsComponent() {
	const [user] = useAuthState(auth);
	const [subs, setSubs] = useState([])
	const [value, loading, error] = useDocumentData(
		doc(db, `users/${user ? user.uid : 'null'}/details`, 'habits')
	);

	useEffect(() => {
		const values:any = Object.values(value ? value : {})
		setSubs(values)
	},[value])

	if (loading) {
		return <div>loading ...</div>;
	}

	if (error) {
		return <div>error {JSON.stringify(error)}</div>;
	}

	return (
		<div>
			{subs.map((subscription: Habit) => {
				return <SubscriptionComponent key={subscription.habitName} isChecked={subscription.isChecked} subscription={subscription.habitName} />;
			})}
		</div>
	);
}

export default UsersHabitsComponent;
