import { createSlice } from "@reduxjs/toolkit";

interface GlobalState {
	isDarkMode: boolean;
}

const initialState: GlobalState = {
	isDarkMode: false,
};

const globalSlice = createSlice({
	name: "global",
	initialState,
	reducers: {
		setDarkMode(state, action) {
			state.isDarkMode = action.payload;
		},
	},
});

export const { setDarkMode } = globalSlice.actions;
export default globalSlice.reducer;
