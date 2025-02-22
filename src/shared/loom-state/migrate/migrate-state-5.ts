import { type LoomState5 } from "../types/loom-state-5";
import {
	type FooterCell as FooterCell6,
	type FunctionType as FunctionType6,
	type LoomState6,
} from "../types/loom-state-6";
import MigrateState from "./migrate-state";

/**
 * Migrates to 6.9.1
 */
export default class MigrateState5 implements MigrateState {
	public migrate(prevState: LoomState5): LoomState6 {
		const { footerCells } = prevState.model;

		const nextFooterCells: FooterCell6[] = footerCells.map((cell) => {
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
