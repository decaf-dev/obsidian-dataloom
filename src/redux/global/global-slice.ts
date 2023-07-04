import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_SETTINGS, DashboardsSettings } from "src/main";

interface GlobalState {
	settings: DashboardsSettings;
	isDarkMode: boolean;
}

const initialState: GlobalState = {
	settings: DEFAULT_SETTINGS,
	isDarkMode: false,
};

//This is the global slice of the redux store.
//This state will be shared across all dashboards instances
const globalSlice = createSlice({
	name: "global",
	initialState,
	reducers: {
		setDarkMode(state, action: PayloadAction<boolean>) {
			state.isDarkMode = action.payload;
		},
		setSettings(state, action: PayloadAction<DashboardsSettings>) {
			state.settings = action.payload;
		},
	},
});

export const { setDarkMode, setSettings } = globalSlice.actions;
export default globalSlice.reducer;
