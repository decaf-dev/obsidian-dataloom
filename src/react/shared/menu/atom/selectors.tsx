import { selector, selectorFamily } from "recoil";
import { menuCloseRequestsAtom, openMenusAtom } from "./atoms";

export const menuSelector = selectorFamily({
	key: "menu",
	get:
		(id: string) =>
		({ get }) => {
			const menus = get(openMenusAtom);
			const found = menus.find((menu) => menu.id === id);
			return found ?? null;
		},
});

export const closeRequestSelector = selectorFamily({
	key: "closeRequest",
	get:
		(menuId: string) =>
		({ get }) => {
			const requests = get(menuCloseRequestsAtom);
			const found = requests.find((request) => request.menuId === menuId);
			return found ?? null;
		},
});

export const topMenuSelector = selector({
	key: "menu",
	get: ({ get }) => {
		const menus = get(openMenusAtom);
		if (menus.length === 0) return null;
		return menus[menus.length - 1];
	},
});

export const isMenuOpenSelector = selectorFamily({
	key: "isMenuOpen",
	get:
		(id: string) =>
		({ get }) => {
			const menus = get(openMenusAtom);
			const found = menus.find((menu) => menu.id === id);
			if (!found) return false;
			return true;
		},
});
