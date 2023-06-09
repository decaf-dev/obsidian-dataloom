export enum MenuLevel {
	ONE,
	TWO,
	THREE,
}

export interface Position {
	top: number;
	left: number;
	width: number;
	height: number;
}

export interface NltMenu {
	id: string;
	level: MenuLevel;
	shouldRequestOnClose: boolean;
}

export type MenuCloseRequestType = "enter" | "click";

export interface MenuCloseRequest {
	id: string;
	type: MenuCloseRequestType;
	requestTime: number;
}

export interface triggerPosition {
	triggerPosition: Position;
	menuTriggerRef: React.MutableRefObject<any | null>;
}
