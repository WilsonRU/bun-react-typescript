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
	get hasToken(): boolean;
	get getUser(): object;
}

export const userStore = create<UserState>()(
	persist(
		(set, get) => ({
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
			get hasToken() {
				return get().token.trim().length > 0;
			},
			get getUser() {
				const { id, email, name } = get();
				return { id, email, name };
			},
		}),
		{
			name: "user-storage",
		},
	),
);
