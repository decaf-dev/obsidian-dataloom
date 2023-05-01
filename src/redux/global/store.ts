import { configureStore } from "@reduxjs/toolkit";
import menuSlice from "../menu/menu-slice";
import globalSlice from "./global-slice";

export const store = configureStore({
	reducer: {
		menu: menuSlice,
		global: globalSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
