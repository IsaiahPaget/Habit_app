import { checkOffHabit, removeHabit } from "../../firebase/firestore";

type Subscription = {
	subscription: string;
	isChecked: boolean;
};

function SubscriptionComponent({ subscription, isChecked }: Subscription) {
	return (
		<div>
			{isChecked ? null : <button className="border" onClick={() => checkOffHabit({ habitName: subscription, isChecked: isChecked })}>check off</button>}
			{subscription}
			<button
				className='border'
				onClick={() => removeHabit({ habitName: subscription, isChecked: isChecked })}
			>
				remove
			</button>
		</div>
	);
}

export default SubscriptionComponent;
