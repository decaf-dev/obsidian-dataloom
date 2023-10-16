import { LoomMenuPosition } from "../menu/types";

export enum LoomMenuLevel {
	ONE = 1,
	TWO = 2,
	THREE = 3,
}

export interface LoomMenu {
	id: string;
	parentComponentId: string;
	level: LoomMenuLevel;
	position: LoomMenuPosition;
	shouldRequestOnClose: boolean;
	shouldFocusTriggerOnClose: boolean;
	name?: string;
}

export type LoomMenuCloseRequestType = "save-and-close" | "close-on-save";

export interface LoomMenuCloseRequest {
	menuId: string;
	type: LoomMenuCloseRequestType;
}
