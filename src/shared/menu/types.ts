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

export interface Menu {
	id: string;
	level: MenuLevel;
	shouldRequestOnClose: boolean;
}

export type CloseMenuRequestType = "enter" | "click";

export interface CloseMenuRequest {
	type: CloseMenuRequestType;
	requestTime: number;
}

export interface triggerPosition {
	triggerPosition: Position;
	menuTriggerRef: React.MutableRefObject<any | null>;
}
