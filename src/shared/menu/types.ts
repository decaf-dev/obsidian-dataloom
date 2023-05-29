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

export interface CloseMenuRequest {
	id: string;
	requestTime: number;
}

export interface triggerPosition {
	triggerPosition: Position;
	menuTriggerRef: React.MutableRefObject<any | null>;
}
