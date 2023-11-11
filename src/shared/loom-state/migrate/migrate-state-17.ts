import MigrateState from "./migrate-state";
import {
	Column,
	DateFormatSeparator,
	DateFormat,
	LoomState,
	Row,
	Filter,
	CellType,
} from "../types/loom-state";
import {
	LoomState16,
	DateFormat as DateFormat16,
} from "../types/loom-state-16";
import { getDateTimeFromUnixTime } from "src/shared/date/utils";

/**
 * Migrates to 8.12.0
 */
export default class MigrateState17 implements MigrateState {
	public migrate(prevState: LoomState16): LoomState {
		const { columns, rows, filters } = prevState.model;
		const nextColumns: Column[] = columns.map((column) => {
			const { dateFormat, frontmatterKey } = column;

			let newFrontmatterKey = null;
			if (frontmatterKey) {
				newFrontmatterKey = {
					isCustom: frontmatterKey.isCustom,
					key: frontmatterKey.value,
					customType: null,
				};
			}
			return {
				...column,
				dateFormat: getDateFormatDisplay(dateFormat),
				dateFormatSeparator: DateFormatSeparator.HYPHEN,
				hour12: true,
				includeTime: false,
				frontmatterKey: newFrontmatterKey,
			};
		});
		const nextRows: Row[] = rows.map((row) => {
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

		const nextFilters: Filter[] = filters.map((filter) => {
			const { type } = filter;
			if (
				type === CellType.DATE ||
				type === CellType.LAST_EDITED_TIME ||
				type === CellType.CREATION_TIME
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

const getDateFormatDisplay = (format: DateFormat16): DateFormat => {
	switch (format) {
		case DateFormat16.MM_DD_YYYY:
		case DateFormat16.DD_MM_YYYY:
		case DateFormat16.YYYY_MM_DD:
			return format.replaceAll("/", "") as DateFormat;
		case DateFormat16.FULL:
		case DateFormat16.RELATIVE:
			return DateFormat.YYYY_MM_DD;
		default:
			return format;
	}
};
