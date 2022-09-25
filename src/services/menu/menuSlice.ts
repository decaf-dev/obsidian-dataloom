import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Menu } from "src/services/menu/types";
import type { RootState } from "../redux/store";

interface MenuState {
	openMenus: Menu[];
	menuOpenTime: number;
	positionUpdateTime: number;
}

const initialState: MenuState = {
	openMenus: [],
	menuOpenTime: 0,
	positionUpdateTime: 0,
};

export const menuSlice = createSlice({
	name: "menu",
	initialState,
	reducers: {
		openMenu: (state, action: PayloadAction<Menu>) => {
			const canOpen =
				state.openMenus.find((m) => m.level < action.payload.level) ||
				state.openMenus.length === 0;
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
		updateMenuPosition: (state) => {
			state.positionUpdateTime = Date.now();
		},
	},
});

export const {
	openMenu,
	closeTopLevelMenu,
	closeAllMenus,
	updateMenuPosition,
} = menuSlice.actions;

export const isMenuOpen = (state: RootState, menu: Menu) =>
	state.menu.openMenus.find((m) => m.id === menu.id) ? true : false;

export const getTopLevelMenu = (state: RootState): Menu | null => {
	if (state.menu.openMenus.length !== 0)
		return state.menu.openMenus[state.menu.openMenus.length - 1];
	return null;
};

export const timeSinceMenuOpen = (state: RootState): number => {
	return Date.now() - state.menu.menuOpenTime;
};

export default menuSlice.reducer;
