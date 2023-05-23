import React, { useState, useEffect } from "react";
import { Habit, addHabit } from "../../firebase/firestore";

function AddHabitComponent() {
	const [habitName, setHabitName] = useState("");

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setHabitName(e.target.value);
	}

	const handleSubmit = () => {
		addHabit({habitName: habitName, isChecked: false}).then(() => setHabitName(""))
	}

	return (
		<div>
			<input
				className='border-2'
				type='text'
				value={habitName}
				onChange={(e) => handleChange(e)}
			/>
			<button
				onClick={handleSubmit}
				className='border'
			>
				Submit
			</button>
		</div>
	);
}

export default AddHabitComponent;
