import { CallbackFunc, EventListener, EventName } from "./types";

class EventSystem {
	eventListeners: EventListener[];

	constructor() {
		this.eventListeners = [];
	}

	/**
	 * Adds an NLT event listener
	 * @param name the event name
	 * @param callback the callback function
	 * @param priority the priority. The higher the priority, the earlier the callback is called
	 */
	addEventListener(name: EventName, callback: CallbackFunc, priority = 0) {
		this.eventListeners.push({
			name,
			callback,
			priority,
		});
		// Sort in descending order by priority
		this.eventListeners.sort((a, b) => b.priority - a.priority);
	}

	/**
	 * Removes an NLT event listener
	 * @param name the name
	 * @param callback the callback function
	 */
	removeEventListener(name: EventName, callback: CallbackFunc) {
		this.eventListeners = this.eventListeners.filter(
			(l) => l.name !== name || l.callback !== callback
		);
	}

	/**
	 * Dispatches a event to all NLT event listeners
	 * @param name the event name
	 * @param event the DOM event
	 * @param data any data
	 */
	dispatchEvent(name: EventName, event: React.KeyboardEvent, ...data: any[]) {
		const listeners = this.eventListeners.filter((l) => l.name === name);

		// Call the listeners in the order they were added
		listeners.forEach((listener) => {
			listener.callback(event, data);
		});
	}
}

export const nltEventSystem = new EventSystem();
