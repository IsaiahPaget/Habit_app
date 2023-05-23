import { auth } from "./Auth";
import { app } from "./Firebase";
import { User } from "firebase/auth";

import {
	getFirestore,
	doc,
	setDoc,
	updateDoc,
	deleteField,
	serverTimestamp,
	collection,
	increment,
	getDoc,
} from "firebase/firestore";
import { docTemplate } from "./docTemplate";
export const db = getFirestore(app);

export type DbDoc = {
	collection: string;
	document: string;
	fields: {};
};

export type Habit = {
	habitName: string;
	isChecked: boolean;
};

export async function setDocument(data: DbDoc) {
	try {
		const docRef = doc(db, data.collection, data.document);
		await setDoc(docRef, data.fields);
	} catch (error) {
		console.error(error);
	}
}

export async function addToDocument(data: DbDoc) {
	try {
		await updateDoc(doc(db, data.collection, data.document), data.fields);
	} catch (error) {
		console.error(error);
	}
}

async function getPlayerLevel(): Promise<number> {
	const statsDocRef = await getDoc(
		doc(db, `users/${auth.currentUser!.uid}/details`, "player_stats")
	);
	if (statsDocRef.exists()) {
		return statsDocRef.data().level;
	}
	return 0;
}

async function getHabits(): Promise<string[]> {
	const habitsDocRef = await getDoc(
		doc(db, `users/${auth.currentUser!.uid}/details`, "habits")
	);
	const habits: any = habitsDocRef.data();
	const habitsValues: string[] = Object.values(habits);
	return habitsValues;
}

export async function addHabit(habit: Habit) {
	if (habit.habitName !== "") {
		const habits = await getHabits();
		const level = await getPlayerLevel();
		if (level !== 0 && habits.length < level) {
			await setDocument(
				new docTemplate("habits", habit.habitName, {
					habit: habit,
					createdAt: serverTimestamp(),
				})
			);
			const obj = {
				[habit.habitName]: { habitName: habit.habitName, isChecked: habit.isChecked },
			};
			if (auth.currentUser) {
				await addToDocument(
					new docTemplate(`users/${auth.currentUser.uid}/details`, "habits", obj)
				);
			}
		}
	}
}

export async function removeHabit(habit: Habit) {
	if (auth.currentUser) {
		await addToDocument(
			new docTemplate(`users/${auth.currentUser.uid}/details`, "habits", {
				[habit.habitName]: deleteField(),
			})
		);
	}
}

async function setIsCheckedTrue(habit: Habit) {
	await addToDocument(
		new docTemplate(`users/${auth.currentUser!.uid}/details`, "habits", {
			[habit.habitName]: {
				habitName: habit.habitName,
				isChecked: true,
			},
		})
	);
}

async function incrementPoints() {
	await addToDocument(
		new docTemplate(`users/${auth.currentUser!.uid}/details`, "player_stats", {
			points: increment(1),
		})
	);
}

async function levelUp() {
	const playerStats = await getDoc(
		doc(db, `users/${auth.currentUser!.uid}/details`, "player_stats")
	);
	if (playerStats.exists()) {
		if (playerStats.data().points === playerStats.data().points_till_next_level) {
			await addToDocument(
				new docTemplate(`users/${auth.currentUser!.uid}/details`, "player_stats", {
					level: increment(1),
				})
			);
			await addToDocument(
				new docTemplate(`users/${auth.currentUser!.uid}/details`, "player_stats", {
					points_till_next_level: increment(60),
				})
			);
		}
	}
}

export async function checkOffHabit(habit: Habit) {
	if (auth.currentUser) {
		await setIsCheckedTrue(habit);
		await incrementPoints();
		await levelUp();
	}
}

export async function signInNewUser(user: User) {
	const newUserRootDoc = doc(db, "users", user.uid);
	await setDoc(newUserRootDoc, {
		name: user.displayName,
		email: user.email,
	});

	const newUserDetailsCollection = collection(newUserRootDoc, "details");

	const playerHabitsDocRef = doc(newUserDetailsCollection, "habits");
	await setDoc(playerHabitsDocRef, {});

	const playerStatsDocRef = doc(newUserDetailsCollection, "player_stats");
	await setDoc(playerStatsDocRef, {
		level: 1,
		points_till_next_level: 60,
		points: 0,
	});
}
