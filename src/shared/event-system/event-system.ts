import { CallbackFunc, EventListener, EventName } from "./types";

class EventSystem {
	eventListeners: EventListener[];

	constructor() {
		this.eventListeners = [];
	}

	addEventListener(name: EventName, callback: CallbackFunc, priority = 0) {
		this.eventListeners.push({
			name,
			callback,
			priority,
		});
		// Sort in descending order by priority
		//The higher priority goes first
		this.eventListeners.sort((a, b) => b.priority - a.priority);
	}

	removeEventListener(name: EventName, callback: CallbackFunc) {
		this.eventListeners = this.eventListeners.filter(
			(l) => l.name !== name || l.callback !== callback
		);
	}

	dispatchEvent(name: EventName, event: Event, ...data: any[]) {
		const listeners = this.eventListeners.filter((l) => l.name === name);

		// Call the listeners in the order they were added
		listeners.forEach((listener) => {
			listener.callback(event, data);
		});
	}
}

export const nltEventSystem = new EventSystem();
