import MigrateState from "./migrate-state";
import ColumNotFoundError from "src/shared/error/column-not-found-error";
import { LoomState, FilterCondition } from "../types/loom-state";
import {
	LoomState12,
	FilterType as FilterType12,
	CellType as CellType12,
} from "../types/loom-state-12";
import {
	createMultiTagFilter,
	createTagFilter,
	createCheckboxFilter,
	createFileFilter,
	createTextFilter,
} from "../loom-state-factory";

/**
 * Migrates to 8.5.0
 */
export default class MigrateState12 implements MigrateState {
	public migrate(prevState: LoomState12): LoomState {
		const {
			filterRules,
			columns,
			headerCells,
			headerRows,
			bodyCells,
			bodyRows,
			footerCells,
			footerRows,
			settings,
		} = prevState.model;

		const nextColumns = columns.map((column) => {
			return {
				...column,
				numberPrefix: "",
				numberSuffix: "",
				numberSeperator: "",
			};
		});

		const nextFilters = filterRules.map((rule) => {
			const column = columns.find(
				(column) => column.id === rule.columnId
			);
			if (!column) throw new ColumNotFoundError(rule.columnId);
			const { type } = column;

			if (type === CellType12.MULTI_TAG) {
				let condition = filterTypeToFilterCondition(rule.type);
				if (
					condition !== FilterCondition.CONTAINS &&
					condition !== FilterCondition.DOES_NOT_CONTAIN &&
					condition !== FilterCondition.IS_EMPTY &&
					condition !== FilterCondition.IS_NOT_EMPTY
				) {
					condition = FilterCondition.CONTAINS;
				}
				const filter = createMultiTagFilter(rule.columnId, {
					condition,
					tagIds: rule.tagIds,
					isEnabled: rule.isEnabled,
				});
				return filter;
			} else if (type === CellType12.TAG) {
				let condition = filterTypeToFilterCondition(rule.type);
				if (
					condition !== FilterCondition.IS &&
					condition !== FilterCondition.IS_NOT &&
					condition !== FilterCondition.IS_EMPTY &&
					condition !== FilterCondition.IS_NOT_EMPTY
				) {
					condition = FilterCondition.IS;
				}
				const filter = createTagFilter(rule.columnId, {
					condition,
					tagId: rule.tagIds[0],
					isEnabled: rule.isEnabled,
				});
				return filter;
			} else if (type === CellType12.CHECKBOX) {
				let condition = filterTypeToFilterCondition(rule.type);
				if (
					condition !== FilterCondition.IS &&
					condition !== FilterCondition.IS_NOT
				) {
					condition = FilterCondition.IS;
				}
				const filter = createCheckboxFilter(rule.columnId, {
					condition,
					text: rule.text,
					isEnabled: rule.isEnabled,
				});
				return filter;
			} else if (type === CellType12.FILE) {
				const condition = filterTypeToFilterCondition(rule.type);
				const filter = createFileFilter(rule.columnId, {
					condition,
					text: rule.text,
					isEnabled: rule.isEnabled,
				});
				return filter;
			} else {
				const condition = filterTypeToFilterCondition(rule.type);
				const filter = createTextFilter(rule.columnId, {
					condition,
					text: rule.text,
					isEnabled: rule.isEnabled,
				});
				return filter;
			}
		});

		return {
			...prevState,
			model: {
				columns: nextColumns,
				footerCells,
				footerRows,
				headerCells,
				headerRows,
				bodyCells,
				bodyRows,
				filters: nextFilters,
				settings,
			},
		};
	}
}

const filterTypeToFilterCondition = (type: FilterType12) => {
	switch (type) {
		case FilterType12.IS:
			return FilterCondition.IS;
		case FilterType12.IS_NOT:
			return FilterCondition.IS_NOT;
		case FilterType12.CONTAINS:
			return FilterCondition.CONTAINS;
		case FilterType12.DOES_NOT_CONTAIN:
			return FilterCondition.DOES_NOT_CONTAIN;
		case FilterType12.STARTS_WITH:
			return FilterCondition.STARTS_WITH;
		case FilterType12.ENDS_WITH:
			return FilterCondition.ENDS_WITH;
		case FilterType12.IS_EMPTY:
			return FilterCondition.IS_EMPTY;
		case FilterType12.IS_NOT_EMPTY:
			return FilterCondition.IS_NOT_EMPTY;
		default:
			throw new Error("Invalid filter type");
	}
};
