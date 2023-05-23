import { Habit } from "./firestore";

export class habitTemplate {
	habit: string;
	isChecked: boolean;

	constructor({ habitName, isChecked }: Habit) {
		this.isChecked = isChecked;
		this.habit = habitName;
	}
}
