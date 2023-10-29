import { generateUuid } from "src/shared/uuid";
import {
	LoomMenuLevel,
	LoomMenu,
	LoomMenuCloseRequest,
	LoomMenuCloseRequestType,
} from "./types";
import { LoomMenuPosition } from "../menu/types";

export const createMenu = (
	parentComponentId: string,
	level: LoomMenuLevel,
	position: LoomMenuPosition,
	options?: {
		name?: string;
		shouldRequestOnClose?: boolean;
		shouldFocusTriggerOnClose?: boolean;
	}
): LoomMenu => {
	const {
		shouldRequestOnClose = false,
		shouldFocusTriggerOnClose = true,
		name,
	} = options ?? {};
	return {
		id: "m" + generateUuid(),
		parentComponentId,
		...(name && { name }),
		position,
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
