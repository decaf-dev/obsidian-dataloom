import {
	BodyCell,
	BodyRow,
	CellType,
	Column,
	FilterRule,
	FilterType,
	TableState,
	Tag,
} from "src/data/types";
import { ColumnIdError } from "../table-state/error";

export const filterBodyRows = (prevState: TableState): BodyRow[] => {
	const { columns, bodyCells, bodyRows, filterRules, tags } = prevState.model;
	//Map column id to column instance
	const columnMap = new Map<string, Column>();
	columns.forEach((column) => columnMap.set(column.id, column));

	//Whether or not the cells matches the rules
	const cellMatches = new Map<string, boolean>();

	//Iterate over all cells and set whether they match the ruleset
	bodyCells.forEach((cell) => {
		const column = columnMap.get(cell.columnId);
		if (!column) throw new ColumnIdError(cell.columnId);
		const doesMatch = doesCellMatchRules(
			cell,
			column.type,
			tags,
			filterRules
		);
		cellMatches.set(cell.id, doesMatch);
	});

	//Now filter the rows based on whether all of their cells match the ruleset
	return bodyRows.filter((row: BodyRow) => {
		const filteredCells = bodyCells.filter((cell) => cell.rowId === row.id);
		return filteredCells.every((cell) => cellMatches.get(cell.id) === true);
	});
};

const doesCellMatchRules = (
	cell: BodyCell,
	cellType: CellType,
	cellTags: Tag[],
	rules: FilterRule[]
) => {
	return rules.every((rule) =>
		doesCellMatchRule(cell, cellType, cellTags, rule)
	);
};

const doesCellMatchRule = (
	cell: BodyCell,
	cellType: CellType,
	cellTags: Tag[],
	rule: FilterRule
) => {
	if (rule.columnId !== cell.columnId) return true;
	if (rule.isEnabled) {
		if (cellType === CellType.TEXT) {
			return doesMatchRule(cell.markdown.trim(), rule);
		} else if (
			cellType === CellType.TAG ||
			cellType === CellType.MULTI_TAG
		) {
			return cellTags.some((tag) =>
				doesMatchRule(tag.markdown.trim(), rule)
			);
		} else if (cellType === CellType.CHECKBOX) {
			return doesMatchRule(cell.markdown.trim(), rule);
		} else {
			throw new Error("Cell type not yet supported");
		}
	}
	return true;
};

const doesMatchRule = (markdown: string, rule: FilterRule) => {
	let compareMarkdown = markdown.toLowerCase();
	let compareRuleText = rule.text.toLowerCase().trim();

	//If the rule text is empty, there is nothing to compare
	if (
		rule.type !== FilterType.IS_EMPTY &&
		rule.type != FilterType.IS_NOT_EMPTY
	) {
		if (compareRuleText == "") return true;
	}
	if (compareMarkdown.includes("scott")) {
		console.log(compareMarkdown);
		console.log(compareRuleText);
	}
	switch (rule.type) {
		case FilterType.IS:
			return compareMarkdown === compareRuleText;
		case FilterType.IS_NOT:
			return compareMarkdown !== compareRuleText;
		case FilterType.CONTAINS:
			return compareMarkdown.includes(compareRuleText);
		case FilterType.DOES_NOT_CONTAIN:
			return !compareMarkdown.includes(compareRuleText);
		case FilterType.STARTS_WITH:
			return compareMarkdown.startsWith(compareRuleText);
		case FilterType.ENDS_WITH:
			return compareMarkdown.endsWith(compareRuleText);
		case FilterType.IS_EMPTY:
			return compareMarkdown === "";
		case FilterType.IS_NOT_EMPTY:
			return compareMarkdown !== "";
		default:
			throw new Error("Filter type not yet supported");
	}
};
