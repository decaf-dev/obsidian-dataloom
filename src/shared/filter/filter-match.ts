import {
	getDateFromDateFilterOption,
	getDateAtMidnight,
	getDateJustBeforeMidnight,
} from "src/react/loom-app/app/filter-by-filters/utils";
import {
	DateFilterCondition,
	DateFilterOption,
	FilterCondition,
	NumberFilterCondition,
	TextFilterCondition,
} from "../loom-state/types/loom-state";

export const doesNumberMatchFilter = (
	value: number | null,
	condition: FilterCondition,
	filterText: string,
	shouldMatchIfNull: boolean
) => {
	const filterNumber = Number(filterText);
	switch (condition) {
		case NumberFilterCondition.IS_EQUAL:
			if (value === null) return shouldMatchIfNull;
			return value === filterNumber;
		case NumberFilterCondition.IS_GREATER:
			if (value === null) return shouldMatchIfNull;
			return value > filterNumber;
		case NumberFilterCondition.IS_GREATER_OR_EQUAL:
			if (value === null) return shouldMatchIfNull;
			return value >= filterNumber;
		case NumberFilterCondition.IS_LESS:
			if (value === null) return shouldMatchIfNull;
			return value < filterNumber;
		case NumberFilterCondition.IS_LESS_OR_EQUAL:
			if (value === null) return shouldMatchIfNull;
			return value <= filterNumber;
		case NumberFilterCondition.IS_NOT_EQUAL:
			if (value === null) return shouldMatchIfNull;
			return value !== filterNumber;
		case NumberFilterCondition.IS_EMPTY:
			return value === null;
		case NumberFilterCondition.IS_NOT_EMPTY:
			return value !== null;
		default:
			throw new Error("Filter condition not yet supported");
	}
};

export const doesBooleanMatchFilter = (
	value: boolean,
	condition: FilterCondition,
	filterValue: boolean
) => {
	switch (condition) {
		case TextFilterCondition.IS:
			return value === filterValue;
		case TextFilterCondition.IS_NOT:
			return value === filterValue;
		default:
			throw new Error("Filter condition not yet supported");
	}
};

/**
 * Checks if the cell content matches the filter text based on the condition
 * @param cellContent - The content of the cell to be filtered
 * @param condition - The condition by which to compare the cell content and filter text
 * @param filterText - The text to filter by
 */
export const doesTextMatchFilter = (
	value: string,
	condition: FilterCondition,
	filterText: string
): boolean => {
	value = value.toLowerCase().trim();
	filterText = filterText.toLowerCase().trim();

	switch (condition) {
		case TextFilterCondition.IS:
			if (filterText === "") return true;
			return value === filterText;
		case TextFilterCondition.IS_NOT:
			if (filterText === "") return true;
			return value !== filterText;
		case TextFilterCondition.CONTAINS:
			return value.includes(filterText);
		case TextFilterCondition.DOES_NOT_CONTAIN:
			if (filterText === "") return true;
			return !value.includes(filterText);
		case TextFilterCondition.STARTS_WITH:
			return value.startsWith(filterText);
		case TextFilterCondition.ENDS_WITH:
			return value.endsWith(filterText);
		case TextFilterCondition.IS_EMPTY:
			return value === "";
		case TextFilterCondition.IS_NOT_EMPTY:
			return value !== "";
		default:
			throw new Error("Filter condition not yet supported");
	}
};

export const doesDateMatchFilter = (
	valueDateTime: string | null,
	condition: FilterCondition,
	option: DateFilterOption,
	filterDateTime: string | null
) => {
	let cellDate: Date | null = null;
	if (valueDateTime !== null) {
		cellDate = new Date(valueDateTime);
	}

	let compareDate = getDateFromDateFilterOption(option);
	if (compareDate === null) {
		if (filterDateTime !== null) {
			compareDate = new Date(filterDateTime);
		}
	}

	switch (condition) {
		case DateFilterCondition.IS: {
			if (compareDate === null) return true;
			if (cellDate === null) return false;

			const compareDateMidnight = getDateAtMidnight(compareDate);
			const compareDateJustBeforeMidnight =
				getDateJustBeforeMidnight(compareDate);

			return (
				cellDate.getTime() >= compareDateMidnight.getTime() &&
				cellDate.getTime() <= compareDateJustBeforeMidnight.getTime()
			);
		}
		case DateFilterCondition.IS_AFTER: {
			if (compareDate === null) return true;
			if (cellDate === null) return false;
			const compareDateBeforeMidnight =
				getDateJustBeforeMidnight(compareDate);
			return cellDate.getTime() > compareDateBeforeMidnight.getTime();
		}
		case DateFilterCondition.IS_BEFORE: {
			if (compareDate === null) return true;
			if (cellDate === null) return false;

			const compareDateMidnight = getDateAtMidnight(compareDate);
			return cellDate.getTime() < compareDateMidnight.getTime();
		}
		case DateFilterCondition.IS_EMPTY:
			return cellDate === null;
		case DateFilterCondition.IS_NOT_EMPTY:
			return cellDate !== null;
		default:
			throw new Error("Filter condition not yet supported");
	}
};
