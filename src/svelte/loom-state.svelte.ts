import { createNewLoomState } from "./state-factory";
import type { ParsedTableData } from "./table-parser";
import type { NewLoomState } from "./types";

export function createLoomState(data: ParsedTableData) {
	const initialState = createNewLoomState(data, "1.0.0");
	console.log(initialState);
	let loomState: NewLoomState = $state(initialState);

	return {
		get loomState() {
			return loomState;
		},
		set loomState(value: NewLoomState) {
			loomState = value;
		},
	};
}
