import { Notice } from "obsidian";

export class Notification {
	constructor(message: string) {
		new Notice(message);
	}
}
