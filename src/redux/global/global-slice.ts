import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_SETTINGS, DataLoomSettings } from "src/main";

interface GlobalState {
	settings: DataLoomSettings;
	isDarkMode: boolean;
	manifestPluginVersion: string;
}

const initialState: GlobalState = {
	settings: DEFAULT_SETTINGS,
	isDarkMode: false,
	manifestPluginVersion: "",
};

//This is the global slice of the redux store.
//This state will be shared across all dataloom instances
const globalSlice = createSlice({
	name: "global",
	initialState,
	reducers: {
		setDarkMode(state, action: PayloadAction<boolean>) {
			state.isDarkMode = action.payload;
		},
		setSettings(state, action: PayloadAction<DataLoomSettings>) {
			state.settings = action.payload;
		},
		setManifestPluginVersion(state, action: PayloadAction<string>) {
			state.manifestPluginVersion = action.payload;
		},
	},
});

export const { setDarkMode, setSettings, setManifestPluginVersion } =
	globalSlice.actions;
export default globalSlice.reducer;
