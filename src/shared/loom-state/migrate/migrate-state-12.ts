import MigrateState from "./migrate-state";
import ColumNotFoundError from "src/shared/error/column-not-found-error";
import {
	CalculationType as CalculationType13,
	CellType as CellType13,
	CurrencyType as CurrencyType13,
	NumberFormat as NumberFormat13,
	TextFilterCondition as TextFilterCondition13,
	TextFilter as TextFilter13,
	MultiTagFilter as MultiTagFilter13,
	BaseFilter as BaseFilter13,
	TagFilter as TagFilter13,
	CheckboxFilter as CheckboxFilter13,
	FileFilter as FileFilter13,
	Filter as FilterType13,
	Column as Column13,
	TextCondition as TextCondition13,
	FileCondition as FileCondition13,
	CheckboxCondition as CheckboxCondition13,
	TagCondition as TagCondition13,
	MultiTagCondition as MultiTagCondition13,
} from "../types/loom-state-13";
import {
	LoomState12,
	FilterType as FilterType12,
	CellType as CellType12,
	CurrencyType as CurrencyType12,
} from "../types/loom-state-12";
import { LoomState13 } from "../types/loom-state-13";

import { v4 as uuidv4 } from "uuid";

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

		const nextColumns: Column13[] = columns.map((column) => {
			const { type, currencyType } = column;

			let newType: CellType13;
			if (type === CellType12.CURRENCY) {
				newType = CellType13.NUMBER;
			} else {
				newType = type as CellType13;
			}

			let newCurrency: CurrencyType13;
			if (currencyType == CurrencyType12.POUND) {
				newCurrency = CurrencyType13.GREAT_BRITAIN;
			} else {
				newCurrency = currencyType as unknown as CurrencyType13;
			}

			return {
				...column,
				type: newType,
				currencyType: newCurrency,
				calculationType: column.calculationType as CalculationType13,
				numberPrefix: "",
				numberSuffix: "",
				numberSeparator: "",
				numberFormat: NumberFormat13.NUMBER,
			};
		});

		const nextFilters: FilterType13[] = filterRules.map((rule) => {
			const column = columns.find(
				(column) => column.id === rule.columnId
			);
			if (!column) throw new ColumNotFoundError(rule.columnId);
			const { type } = column;

			if (type === CellType12.MULTI_TAG) {
				let condition = filterTypeToFilterCondition(rule.type);
				if (
					condition !== TextFilterCondition13.CONTAINS &&
					condition !== TextFilterCondition13.DOES_NOT_CONTAIN &&
					condition !== TextFilterCondition13.IS_EMPTY &&
					condition !== TextFilterCondition13.IS_NOT_EMPTY
				) {
					condition = TextFilterCondition13.CONTAINS;
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
					condition !== TextFilterCondition13.IS &&
					condition !== TextFilterCondition13.IS_NOT &&
					condition !== TextFilterCondition13.IS_EMPTY &&
					condition !== TextFilterCondition13.IS_NOT_EMPTY
				) {
					condition = TextFilterCondition13.IS;
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
					condition !== TextFilterCondition13.IS &&
					condition !== TextFilterCondition13.IS_NOT
				) {
					condition = TextFilterCondition13.IS;
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
			return TextFilterCondition13.IS;
		case FilterType12.IS_NOT:
			return TextFilterCondition13.IS_NOT;
		case FilterType12.CONTAINS:
			return TextFilterCondition13.CONTAINS;
		case FilterType12.DOES_NOT_CONTAIN:
			return TextFilterCondition13.DOES_NOT_CONTAIN;
		case FilterType12.STARTS_WITH:
			return TextFilterCondition13.STARTS_WITH;
		case FilterType12.ENDS_WITH:
			return TextFilterCondition13.ENDS_WITH;
		case FilterType12.IS_EMPTY:
			return TextFilterCondition13.IS_EMPTY;
		case FilterType12.IS_NOT_EMPTY:
			return TextFilterCondition13.IS_NOT_EMPTY;
		default:
			throw new Error("Invalid filter type");
	}
};

const createTextFilter = (
	columnId: string,
	options?: {
		condition?: TextCondition13;
		isEnabled?: boolean;
		text?: string;
	}
): TextFilter13 => {
	const {
		condition = TextFilterCondition13.IS,
		isEnabled = true,
		text = "",
	} = options || {};
	const baseFilter = createBaseFilter(columnId, {
		isEnabled,
	});
	return {
		...baseFilter,
		type: CellType13.TEXT,
		condition,
		text,
	};
};

const createFileFilter = (
	columnId: string,
	options?: {
		condition?: FileCondition13;
		isEnabled?: boolean;
		text?: string;
	}
): FileFilter13 => {
	const {
		condition = TextFilterCondition13.IS,
		isEnabled = true,
		text = "",
	} = options || {};
	const baseFilter = createBaseFilter(columnId, {
		isEnabled,
	});
	return {
		...baseFilter,
		type: CellType13.FILE,
		condition,
		text,
	};
};

const createCheckboxFilter = (
	columnId: string,
	options?: {
		condition?: CheckboxCondition13;
		isEnabled?: boolean;
		text?: string;
	}
): CheckboxFilter13 => {
	const {
		condition = TextFilterCondition13.IS,
		isEnabled = true,
		text = "",
	} = options || {};
	const baseFilter = createBaseFilter(columnId, {
		isEnabled,
	});
	return {
		...baseFilter,
		type: CellType13.CHECKBOX,
		condition,
		text,
		isEnabled,
	};
};

const createTagFilter = (
	columnId: string,
	options?: {
		condition?: TagCondition13;
		tagId?: string;
		isEnabled?: boolean;
	}
): TagFilter13 => {
	const {
		condition = TextFilterCondition13.IS,
		isEnabled = true,
		tagId = "",
	} = options || {};
	const baseFilter = createBaseFilter(columnId, {
		isEnabled,
	});
	return {
		...baseFilter,
		type: CellType13.TAG,
		condition,
		tagId,
		isEnabled,
	};
};

const createMultiTagFilter = (
	columnId: string,
	options?: {
		condition?: MultiTagCondition13;
		tagIds?: string[];
		isEnabled?: boolean;
	}
): MultiTagFilter13 => {
	const {
		condition = TextFilterCondition13.CONTAINS,
		isEnabled = true,
		tagIds = [],
	} = options || {};
	const baseFilter = createBaseFilter(columnId, {
		isEnabled,
	});
	return {
		...baseFilter,
		type: CellType13.MULTI_TAG,
		condition,
		tagIds,
	};
};

const createBaseFilter = (
	columnId: string,
	options?: {
		isEnabled?: boolean;
	}
): BaseFilter13 => {
	const { isEnabled = true } = options || {};
	return {
		id: uuidv4(),
		columnId,
		operator: "or",
		isEnabled,
	};
};
