import { atom } from "recoil";
import { LoomMenu, LoomMenuCloseRequest } from "../types";

export const openMenusAtom = atom<LoomMenu[]>({
	key: "openMenus",
	default: [],
});

export const menuCloseRequestsAtom = atom<LoomMenuCloseRequest[]>({
	key: "menuCloseRequests",
	default: [],
});
