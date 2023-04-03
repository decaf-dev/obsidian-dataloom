import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
	isDarkMode: boolean;
	shouldDebug: boolean;
	searchText: string;
	isSearchBarVisible: boolean;
}

const initialState: GlobalState = {
	isDarkMode: false,
	shouldDebug: false,
	searchText: "",
	isSearchBarVisible: false,
};

const globalSlice = createSlice({
	name: "global",
	initialState,
	reducers: {
		setDarkMode(state, action: PayloadAction<boolean>) {
			state.isDarkMode = action.payload;
		},
		setDebugMode(state, action: PayloadAction<boolean>) {
			state.shouldDebug = action.payload;
		},
		setSearchText(state, action: PayloadAction<string>) {
			state.searchText = action.payload;
		},
		toggleSearchBar(state) {
			state.isSearchBarVisible = !state.isSearchBarVisible;
		},
	},
});

export const { setDarkMode, setDebugMode, setSearchText, toggleSearchBar } =
	globalSlice.actions;
export default globalSlice.reducer;
