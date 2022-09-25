import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Menu } from "src/services/menu/types";
import type { RootState } from "./store";

interface GlobalState {
	openMenus: Menu[];
	menuOpenTime: number;
}

const initialState: GlobalState = {
	openMenus: [],
	menuOpenTime: 0,
};

export const globalSlice = createSlice({
	name: "global",
	initialState,
	reducers: {
		openMenu: (state, action: PayloadAction<Menu>) => {
			console.log("ATTEMPTING OPEN MENU");
			const canOpen =
				state.openMenus.find((m) => m.level < action.payload.level) ||
				state.openMenus.length === 0;
			console.log("canOpen", canOpen);
			if (!canOpen) return;
			state.openMenus.push(action.payload);
			state.menuOpenTime = Date.now();
		},
		closeTopLevelMenu: (state) => {
			state.openMenus.pop();
		},
		closeAllMenus: (state) => {
			state.openMenus = [];
		},
	},
});

export const { openMenu, closeTopLevelMenu, closeAllMenus } =
	globalSlice.actions;

export const isMenuOpen = (state: RootState, menu: Menu) =>
	state.global.openMenus.find((m) => m.id === menu.id) ? true : false;

export const getTopLevelMenu = (state: RootState): Menu | null => {
	if (state.global.openMenus.length !== 0)
		return state.global.openMenus[state.global.openMenus.length - 1];
	return null;
};

export const timeSinceMenuOpen = (state: RootState): number => {
	return Date.now() - state.global.menuOpenTime;
};

export default globalSlice.reducer;
