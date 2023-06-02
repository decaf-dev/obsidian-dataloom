import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
	isDarkMode: boolean;
	shouldDebug: boolean;
}

const initialState: GlobalState = {
	isDarkMode: false,
	shouldDebug: false,
};

//This is the global slice of the redux store.
//This state will be shared across all instances of our table view
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
	},
});

export const { setDarkMode, setDebugMode } = globalSlice.actions;
export default globalSlice.reducer;
