export enum LoomMenuLevel {
	ONE = 1,
	TWO = 2,
	THREE = 3,
}

export interface LoomMenu {
	id: string;
	level: LoomMenuLevel;
	shouldRequestOnClose: boolean;
	shouldFocusTriggerOnClose: boolean;
}

export type LoomMenuCloseRequestType = "save-and-close" | "close-on-save";

export interface LoomMenuCloseRequest {
	menuId: string;
	type: LoomMenuCloseRequestType;
}

export interface Position {
	top: number;
	left: number;
	width: number;
	height: number;
}

export type LoomMenuOpenDirection =
	| "normal"
	| "bottom-left"
	| "bottom-right"
	| "bottom"
	| "left"
	| "right";
