import { createSlice } from "@reduxjs/toolkit";

interface GlobalState {
	isDarkMode: boolean;
	shouldDebug: boolean;
}

const initialState: GlobalState = {
	isDarkMode: false,
	shouldDebug: false,
};

const globalSlice = createSlice({
	name: "global",
	initialState,
	reducers: {
		setDarkMode(state, action) {
			state.isDarkMode = action.payload;
		},
		setDebugMode(state, action) {
			state.shouldDebug = action.payload;
		},
	},
});

export const { setDarkMode, setDebugMode } = globalSlice.actions;
export default globalSlice.reducer;
