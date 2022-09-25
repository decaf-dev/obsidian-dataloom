import { createSlice } from "@reduxjs/toolkit";

interface GlobalState {}

const initialState: GlobalState = {};

const globalSlice = createSlice({ name: "global", initialState, reducers: {} });

const {} = globalSlice.actions;
export default globalSlice.reducer;
