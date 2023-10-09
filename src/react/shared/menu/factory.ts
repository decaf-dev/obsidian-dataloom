import { generateUuid } from "src/shared/uuid";
import {
	LoomMenu,
	LoomMenuCloseRequest,
	LoomMenuCloseRequestType,
	LoomMenuLevel,
} from "./types";

export const createMenu = (
	level: LoomMenuLevel,
	shouldRequestOnClose: boolean,
	shouldFocusTriggerOnClose: boolean
): LoomMenu => {
	return {
		id: "m" + generateUuid(),
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
