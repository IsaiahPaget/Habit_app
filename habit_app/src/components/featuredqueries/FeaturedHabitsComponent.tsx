import { collection, query, limit, orderBy } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase/firestore";

function FeaturedHabitsComponent() {
	const [values, loading, error] = useCollection(
		query(collection(db, "habits"), orderBy("createdAt", "desc"), limit(5))
	);

	if (loading) {
		return <div>loading ...</div>;
	}

	if (error) {
		return <div>error {JSON.stringify(error)}</div>;
	}

	return (
		<div>
			<div>
				{values!.docs.map((doc) => (
					<div key={doc.id}>{doc.id}</div>
				))}
			</div>
		</div>
	);
}

export default FeaturedHabitsComponent;
