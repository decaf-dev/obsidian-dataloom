import MigrateState from "./migrate-state";
import ColumNotFoundError from "src/shared/error/column-not-found-error";
import {
	CalculationType,
	CellType,
	CurrencyType,
	NumberFormat,
	TextFilterCondition,
} from "../types/loom-state";
import {
	LoomState12,
	FilterType as FilterType12,
	CellType as CellType12,
	CurrencyType as CurrencyType12,
} from "../types/loom-state-12";
import {
	createMultiTagFilter,
	createTagFilter,
	createCheckboxFilter,
	createFileFilter,
	createTextFilter,
} from "../loom-state-factory";
import { LoomState13 } from "../types/loom-state-13";

/**
 * Migrates to 8.5.0
 */
export default class MigrateState12 implements MigrateState {
	public migrate(prevState: LoomState12): LoomState13 {
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
			const { type, currencyType } = column;

			let newType: CellType;
			if (type === CellType12.CURRENCY) {
				newType = CellType.NUMBER;
			} else {
				newType = type as CellType;
			}

			let newCurrency: CurrencyType;
			if (currencyType == CurrencyType12.POUND) {
				newCurrency = CurrencyType.GREAT_BRITAIN;
			} else {
				newCurrency = currencyType as unknown as CurrencyType;
			}

			return {
				...column,
				type: newType,
				currencyType: newCurrency,
				calculationType: column.calculationType as CalculationType,
				numberPrefix: "",
				numberSuffix: "",
				numberSeparator: "",
				numberFormat: NumberFormat.NUMBER,
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
					condition !== TextFilterCondition.CONTAINS &&
					condition !== TextFilterCondition.DOES_NOT_CONTAIN &&
					condition !== TextFilterCondition.IS_EMPTY &&
					condition !== TextFilterCondition.IS_NOT_EMPTY
				) {
					condition = TextFilterCondition.CONTAINS;
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
					condition !== TextFilterCondition.IS &&
					condition !== TextFilterCondition.IS_NOT &&
					condition !== TextFilterCondition.IS_EMPTY &&
					condition !== TextFilterCondition.IS_NOT_EMPTY
				) {
					condition = TextFilterCondition.IS;
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
					condition !== TextFilterCondition.IS &&
					condition !== TextFilterCondition.IS_NOT
				) {
					condition = TextFilterCondition.IS;
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
			return TextFilterCondition.IS;
		case FilterType12.IS_NOT:
			return TextFilterCondition.IS_NOT;
		case FilterType12.CONTAINS:
			return TextFilterCondition.CONTAINS;
		case FilterType12.DOES_NOT_CONTAIN:
			return TextFilterCondition.DOES_NOT_CONTAIN;
		case FilterType12.STARTS_WITH:
			return TextFilterCondition.STARTS_WITH;
		case FilterType12.ENDS_WITH:
			return TextFilterCondition.ENDS_WITH;
		case FilterType12.IS_EMPTY:
			return TextFilterCondition.IS_EMPTY;
		case FilterType12.IS_NOT_EMPTY:
			return TextFilterCondition.IS_NOT_EMPTY;
		default:
			throw new Error("Invalid filter type");
	}
};
