import { ValidationError } from "runtypes";

export default class DeserializationError extends Error {
	pluginVersion: string;
	fileVersion: string;

	constructor(error: unknown, pluginVersion: string, fileVersion: string) {
		let message = "";
		if (error instanceof ValidationError) {
			message = JSON.stringify(error.details, null, 2);
		} else {
			message = (error as Error).message;
		}
		super(message);
		this.name = "DeserializationError";
		this.pluginVersion = pluginVersion;
		this.fileVersion = fileVersion;
	}
}
