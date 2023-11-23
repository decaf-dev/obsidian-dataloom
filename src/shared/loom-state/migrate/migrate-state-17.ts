import MigrateState from "./migrate-state";
import {
	Column as Column17,
	DateFormatSeparator as DateFormatSeparator17,
	DateFormat as DateFormat17,
	Row as Row17,
	Filter as Filter17,
	CellType as CellType17,
	LoomState17,
} from "../types/loom-state-17";
import {
	LoomState16,
	DateFormat as DateFormat16,
} from "../types/loom-state-16";
import { getDateTimeFromUnixTime } from "src/shared/date/utils";

/**
 * Migrates to 8.12.0
 */
export default class MigrateState17 implements MigrateState {
	public migrate(prevState: LoomState16): LoomState17 {
		const { columns, rows, filters } = prevState.model;
		const nextColumns: Column17[] = columns.map((column) => {
			const { dateFormat, frontmatterKey } = column;

			let newFrontmatterKey = null;
			if (frontmatterKey) {
				newFrontmatterKey = frontmatterKey.value;
			}
			return {
				...column,
				dateFormat: getDateFormatDisplay(dateFormat),
				dateFormatSeparator: DateFormatSeparator17.HYPHEN,
				hour12: true,
				includeTime: false,
				frontmatterKey: newFrontmatterKey,
			};
		});
		const nextRows: Row17[] = rows.map((row) => {
			const { cells, creationTime, lastEditedTime } = row;
			const nextCells = cells.map((cell) => {
				const { dateTime } = cell;
				let nextDateTime = null;
				if (dateTime !== null) {
					nextDateTime = getDateTimeFromUnixTime(dateTime);
				}
				return {
					...cell,
					dateTime: nextDateTime,
				};
			});
			const nextCreationDateTime = getDateTimeFromUnixTime(creationTime);
			const nextLastEditedDateTime =
				getDateTimeFromUnixTime(lastEditedTime);
			return {
				...row,
				lastEditedDateTime: nextLastEditedDateTime,
				creationDateTime: nextCreationDateTime,
				cells: nextCells,
			};
		});

		const nextFilters: Filter17[] = filters.map((filter) => {
			const { type } = filter;
			if (
				type === CellType17.DATE ||
				type === CellType17.LAST_EDITED_TIME ||
				type === CellType17.CREATION_TIME
			) {
				let nextDateTime = null;
				if (filter.dateTime !== null) {
					nextDateTime = getDateTimeFromUnixTime(filter.dateTime);
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

const getDateFormatDisplay = (format: DateFormat16): DateFormat17 => {
	switch (format) {
		case DateFormat16.MM_DD_YYYY:
		case DateFormat16.DD_MM_YYYY:
		case DateFormat16.YYYY_MM_DD:
			return format.replaceAll("/", "") as DateFormat17;
		case DateFormat16.FULL:
		case DateFormat16.RELATIVE:
			return DateFormat17.YYYY_MM_DD;
		default:
			return format;
	}
};
