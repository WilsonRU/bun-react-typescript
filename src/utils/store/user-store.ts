import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
	id: number;
	name: string;
	email: string;
	token: string;
	hasToken: () => boolean;
	getUser: () => { id: number; name: string; email: string } | null;
	updateName: (newName: string) => void;
	setInitialData: (initialData: { id: number; name: string; email: string; token: string }) => void;
	clear: () => void;
}

export const userStore = create<UserState>()(
	persist(
		(set, get) => ({
			id: 0,
			name: "",
			email: "",
			token: "",
			hasToken: () => Boolean(get().token),
			getUser: () => {
				const { id, name, email } = get();

				if (!id || !email) {
					return null;
				}

				return { id, name, email };
			},
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
