import MigrateState from "./migrate-state";
import {
	Column,
	DateFormatSeparator,
	DateFormat,
	LoomState,
} from "../types/loom-state";
import {
	LoomState16,
	DateFormat as DateFormat16,
} from "../types/loom-state-16";

/**
 * Migrates to 8.12.0
 */
export default class MigrateState17 implements MigrateState {
	public migrate(prevState: LoomState16): LoomState {
		const { columns } = prevState.model;
		const nextColumns: Column[] = columns.map((column) => {
			const { dateFormat } = column;
			return {
				...column,
				dateFormat: getDateFormatDisplay(dateFormat),
				dateFormatSeparator: DateFormatSeparator.HYPHEN,
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

const getDateFormatDisplay = (format: DateFormat16): DateFormat => {
	switch (format) {
		case DateFormat16.MM_DD_YYYY:
		case DateFormat16.DD_MM_YYYY:
		case DateFormat16.YYYY_MM_DD:
			return format.replaceAll("/", "-") as DateFormat;
		default:
			return format;
	}
};
