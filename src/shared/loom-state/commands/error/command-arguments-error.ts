export default class CommandArgumentsError extends Error {
	constructor(type: "delete" | "update") {
		let message = "";
		if (type === "delete") {
			message = "Either 'id' or 'last' must be defined";
		}
		super(message);
		this.name = "CommandArgumentsError";
	}
}
