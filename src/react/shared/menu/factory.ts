import {
	LoomMenu,
	LoomMenuCloseRequest,
	LoomMenuCloseRequestType,
	LoomMenuLevel,
} from "./types";
import { v4 as uuidv4 } from "uuid";

export const createMenuId = (): string => {
	return "m" + uuidv4();
};

export const createMenu = (
	id: string,
	level: LoomMenuLevel,
	shouldRequestOnClose: boolean
): LoomMenu => {
	return {
		id,
		level,
		shouldRequestOnClose,
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
