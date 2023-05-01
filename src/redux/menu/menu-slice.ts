import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CloseMenuRequest, Menu } from "src/redux/menu/types";

interface MenuState {
	openMenus: Menu[];
	menuRequestingClose: CloseMenuRequest | null;
	lastMenuCloseTime: number;
}

const initialState: MenuState = {
	openMenus: [],
	menuRequestingClose: null,
	lastMenuCloseTime: 0,
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

			//If we've closed the menu in the last 200ms, then don't open it
			//This prevents the menu from reopening when clicking the button that had opened it
			if (Date.now() - state.lastMenuCloseTime < 200) return;

			state.openMenus.push(action.payload);
		},
		requestCloseTopLevelMenu: (state, action: PayloadAction<boolean>) => {
			const topMenu = state.openMenus.last();
			if (!topMenu) return;

			const isEnterPressed = action.payload;

			//Only request close if the menu is initialized to do so
			if (topMenu.shouldRequestOnClose) {
				//Make sure that we're pressing enter on the menu
				//Otherwise we will just close it
				if (isEnterPressed) {
					state.menuRequestingClose = {
						id: topMenu.id,
						requestTime: Date.now(),
					};
					return;
				}
			}
			state.lastMenuCloseTime = Date.now();
			state.openMenus.pop();
		},
		closeTopLevelMenu: (state) => {
			const topMenu = state.openMenus.last();
			if (!topMenu) return;

			if (state.menuRequestingClose) {
				if (state.menuRequestingClose.id !== topMenu.id) {
					throw new Error(
						"Menu requesting close is not the top menu."
					);
				}
				state.menuRequestingClose = null;
			}
			state.lastMenuCloseTime = Date.now();
			state.openMenus.pop();
		},
		closeAllMenus: (state) => {
			state.openMenus = [];
			state.lastMenuCloseTime = Date.now();
		},
	},
});

export const {
	openMenu,
	closeTopLevelMenu,
	closeAllMenus,
	requestCloseTopLevelMenu,
} = menuSlice.actions;

export default menuSlice.reducer;
