import MigrateState from "./migrate-state";
import { LoomState5 } from "../types/loom-state-5";
import {
	LoomState6,
	FunctionType as FunctionType6,
} from "../types/loom-state-6";

/**
 * Migrates to 6.9.1
 */
export default class MigrateState5 implements MigrateState {
	public migrate(prevState: LoomState5): LoomState6 {
		const { footerCells } = prevState.model;

		const nextFooterCells = footerCells.map((cell) => {
			return {
				...cell,
				functionType: cell.functionType.replace(
					/_/g,
					"-"
				) as FunctionType6,
			};
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				footerCells: nextFooterCells,
			},
		};
	}
}
