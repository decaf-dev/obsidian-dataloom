import { DataLoomEvent } from "./types";

export default class EventListener {
	private static instance: EventListener;
	private events: Record<DataLoomEvent, Function[]>;

	private constructor() {
		this.events = {} as Record<DataLoomEvent, Function[]>;
	}

	// Ensures only one instance is created
	public static getInstance(): EventListener {
		if (!EventListener.instance) {
			EventListener.instance = new EventListener();
		}
		return EventListener.instance;
	}

	// Method to add an event listener
	public on(eventName: DataLoomEvent, callback: Function): void {
		if (!this.events[eventName]) {
			this.events[eventName] = [];
		}
		this.events[eventName].push(callback);
	}

	// Method to remove an event listener
	public off(eventName: DataLoomEvent, callbackToRemove: Function): void {
		if (!this.events[eventName]) {
			return;
		}
		this.events[eventName] = this.events[eventName].filter(
			(callback) => callback !== callbackToRemove
		);
	}

	// Method to trigger all callbacks associated with an event
	public emit(eventName: DataLoomEvent, ...data: any[]): void {
		console.log("Emiting event", eventName);
		if (!this.events[eventName]) {
			return;
		}
		this.events[eventName].forEach((callback) => {
			callback(data);
		});
	}
}
