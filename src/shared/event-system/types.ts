export interface EventListener {
	name: EventName;
	callback: CallbackFunc;
	priority: number;
}

export type CallbackFunc = (...data: any[]) => void;
export type EventName = "keydown";
