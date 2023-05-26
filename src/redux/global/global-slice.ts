import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
	isDarkMode: boolean;
	shouldDebug: boolean;
	searchText: string;
	isSearchBarVisible: boolean;
	resizingColumnId: string | null;
}

const initialState: GlobalState = {
	isDarkMode: false,
	shouldDebug: false,
	searchText: "",
	isSearchBarVisible: false,
	resizingColumnId: null,
};

//This is the global slice of the redux store.
//This state will be shared across all instances of our table view
//TODO update
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
		setResizingColumnId(state, action: PayloadAction<string | null>) {
			state.resizingColumnId = action.payload;
		},
	},
});

export const {
	setDarkMode,
	setDebugMode,
	setSearchText,
	toggleSearchBar,
	setResizingColumnId,
} = globalSlice.actions;
export default globalSlice.reducer;
