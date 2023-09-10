import {
	LoomMenu,
	LoomMenuCloseRequest,
	LoomMenuCloseRequestType,
	LoomMenuLevel,
} from "./types";
import { v4 as uuidv4 } from "uuid";

export const createMenu = (
	level: LoomMenuLevel,
	shouldRequestOnClose: boolean,
	shouldFocusTriggerOnClose: boolean
): LoomMenu => {
	return {
		id: "m" + uuidv4(),
		level,
		shouldRequestOnClose,
		shouldFocusTriggerOnClose,
	};
};

export const createCloseRequest = (
	menuId: string,
	type: LoomMenuCloseRequestType
): LoomMenuCloseRequest => {
	return {
		menuId,
		type,
	};
};
