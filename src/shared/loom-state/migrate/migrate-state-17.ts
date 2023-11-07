import MigrateState from "./migrate-state";
import {
	Column,
	DateFormatSeparator,
	DateFormat,
	LoomState,
	TimeFormat,
	Row,
	Filter,
	CellType,
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
		const { columns, rows, filters } = prevState.model;
		const nextColumns: Column[] = columns.map((column) => {
			const { dateFormat } = column;
			return {
				...column,
				dateFormat: getDateFormatDisplay(dateFormat),
				dateFormatSeparator: DateFormatSeparator.HYPHEN,
				timeFormat: TimeFormat.TWELVE_HOUR,
				includeTime: false,
			};
		});
		const nextRows: Row[] = rows.map((row) => {
			const { cells, creationTime, lastEditedTime } = row;
			const nextCells = cells.map((cell) => {
				const { dateTime } = cell;
				let nextDateTime = null;
				if (dateTime !== null) {
					nextDateTime = new Date(dateTime).toISOString();
				}
				return {
					...cell,
					dateTime: nextDateTime,
				};
			});
			const nextCreationDateTime = new Date(creationTime).toISOString();
			const nextLastEditedDateTime = new Date(
				lastEditedTime
			).toISOString();
			return {
				...row,
				lastEditedDateTime: nextLastEditedDateTime,
				creationDateTime: nextCreationDateTime,
				cells: nextCells,
			};
		});

		const nextFilters: Filter[] = filters.map((filter) => {
			const { type } = filter;
			if (
				type === CellType.DATE ||
				type === CellType.LAST_EDITED_TIME ||
				type === CellType.CREATION_TIME
			) {
				let nextDateTime = null;
				if (filter.dateTime !== null) {
					nextDateTime = new Date(filter.dateTime).toISOString();
				}
				return {
					...filter,
					dateTime: nextDateTime,
				};
			}
			return filter;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				rows: nextRows,
				filters: nextFilters,
			},
		};
	}
}

const getDateFormatDisplay = (format: DateFormat16): DateFormat => {
	switch (format) {
		case DateFormat16.MM_DD_YYYY:
		case DateFormat16.DD_MM_YYYY:
		case DateFormat16.YYYY_MM_DD:
			return format.replaceAll("/", "") as DateFormat;
		default:
			return format;
	}
};
