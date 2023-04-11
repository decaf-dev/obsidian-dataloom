import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
	isDarkMode: boolean;
	shouldDebug: boolean;
	searchText: string;
	isSearchBarVisible: boolean;
	sortTime: number;
	isResizingColumn: boolean;
}

const initialState: GlobalState = {
	isDarkMode: false,
	shouldDebug: false,
	searchText: "",
	isSearchBarVisible: false,
	sortTime: 0,
	isResizingColumn: false,
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
		updateSortTime(state) {
			state.sortTime = Date.now();
		},
		setResizingColumn(state, action: PayloadAction<boolean>) {
			state.isResizingColumn = action.payload;
		},
	},
});

export const {
	setDarkMode,
	setDebugMode,
	setSearchText,
	toggleSearchBar,
	updateSortTime,
	setResizingColumn,
} = globalSlice.actions;
export default globalSlice.reducer;
