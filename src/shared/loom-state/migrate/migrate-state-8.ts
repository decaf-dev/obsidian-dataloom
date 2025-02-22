import { type LoomState8 } from "../types/loom-state-8";
import {
	AspectRatio as AspectRatio9,
	PaddingSize as PaddingSize9,
	type Column as Column9,
	type LoomState9,
} from "../types/loom-state-9";
import MigrateState from "./migrate-state";

/**
 * Migrates to 6.17.0
 */
export default class MigrateState8 implements MigrateState {
	public migrate(prevState: LoomState8): LoomState9 {
		const { columns } = prevState.model;

		const nextColumns: Column9[] = columns.map((column) => {
			return {
				...column,
				isLocked: false,
				aspectRatio: AspectRatio9.SIXTEEN_BY_NINE,
				horizontalPadding: PaddingSize9.UNSET,
				verticalPadding: PaddingSize9.UNSET,
			};
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
			},
		};
	}
}
