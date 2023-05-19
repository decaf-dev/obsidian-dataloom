import {
	BodyCell,
	BodyRow,
	CellType,
	Column,
	FilterRule,
	FilterType,
	TableState,
	Tag,
} from "src/shared/table-state/types";
import { ColumnIdError } from "./table-error";

//TODO implement all Cell Types
export const isCellTypeFilterable = (cellType: CellType): boolean => {
	switch (cellType) {
		case CellType.TEXT:
		case CellType.TAG:
		case CellType.MULTI_TAG:
		case CellType.CHECKBOX:
			return true;
		default:
			return false;
	}
};

export const filterBodyRowsByRules = (prevState: TableState): BodyRow[] => {
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
	tags: Tag[],
	rules: FilterRule[]
) => {
	return rules.every((rule) => doesCellMatchRule(cell, cellType, tags, rule));
};

const doesCellMatchRule = (
	cell: BodyCell,
	cellType: CellType,
	tags: Tag[],
	rule: FilterRule
) => {
	if (rule.columnId !== cell.columnId) return true;
	if (!isCellTypeFilterable(cellType)) return true;
	if (rule.isEnabled) {
		if (cellType === CellType.TEXT) {
			return doesTextMatch(cell.markdown, rule.text, rule.type);
		} else if (
			cellType === CellType.TAG ||
			cellType === CellType.MULTI_TAG
		) {
			const cellTags = tags
				.filter((tag) => tag.cellIds.includes(cell.id))
				.map((tag) => tag.markdown);

			//The tags that we are filtering by
			const ruleTags = tags.filter((tag) => rule.tagIds.includes(tag.id));

			//If the cell has no tags, return false
			//As long as we're not filtering by not empty, we want to render empty rows
			if (cellTags.length === 0) {
				return doesTextMatch("", "", rule.type);
			}

			//The cell matches if it has at least 1 tag that satifies every rule tag
			//cellTags contains each rule tag
			return ruleTags.every((ruleTag) =>
				doesTagMatch(cellTags, ruleTag.markdown, rule.type)
			);
		} else if (cellType === CellType.CHECKBOX) {
			return doesTextMatch(cell.markdown, rule.text, rule.type);
		}
	}
	return true;
};

const doesTagMatch = (
	markdown: string[],
	ruleText: string,
	filterType: FilterType
) => {
	switch (filterType) {
		case FilterType.IS:
			return markdown[0] === ruleText;
		case FilterType.IS_NOT:
			return markdown[0] !== ruleText;
		case FilterType.CONTAINS:
			return markdown.some((tag) => ruleText.includes(tag));
		case FilterType.DOES_NOT_CONTAIN:
			return markdown.every((tag) => !ruleText.includes(tag));
		case FilterType.IS_EMPTY:
			return markdown.length === 0;
		case FilterType.IS_NOT_EMPTY:
			return markdown.length !== 0;
	}
};

const doesTextMatch = (
	markdown: string,
	ruleText: string,
	filterType: FilterType
) => {
	const compareMarkdown = markdown.toLowerCase().trim();
	const compareRuleText = ruleText.toLowerCase().trim();

	if (
		filterType != FilterType.IS_NOT_EMPTY &&
		filterType != FilterType.IS_EMPTY
	) {
		//If the rule text is empty, there is nothing to compare
		if (compareRuleText == "") return true;
		//If the markdown is emtpy, there is nothing to compare
		if (markdown === "") return true;
	}

	switch (filterType) {
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
