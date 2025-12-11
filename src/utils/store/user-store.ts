import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
	id: number;
	name: string;
	email: string;
	token: string;
	updateName: (newName: string) => void;
	setInitialData: (initialData: { id: number; name: string; email: string; token: string }) => void;
	clear: () => void;
}

export const userStore = create<UserState>()(
	persist(
		(set) => ({
			id: 0,
			name: "",
			email: "",
			token: "",
			updateName: (newName) => set({ name: newName }),
			setInitialData: (initialData) => set(initialData),
			clear: () =>
				set({
					id: 0,
					name: "",
					email: "",
					token: "",
				}),
		}),
		{
			name: "user-storage",
		},
	),
);
