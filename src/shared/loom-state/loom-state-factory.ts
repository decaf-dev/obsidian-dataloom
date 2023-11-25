import { randomColor } from "src/shared/color";
import {
	AspectRatio,
	Cell,
	Row,
	GeneralCalculation,
	CellType,
	Column,
	CurrencyType,
	DateFormat,
	PaddingSize,
	SortDir,
	LoomState,
	Tag,
	TextFilter,
	MultiTagFilter,
	TagFilter,
	CheckboxFilter,
	FileFilter,
	TextFilterCondition,
	BaseFilter,
	DateFilterCondition,
	DateFilter,
	CreationTimeFilter,
	LastEditedTimeFilter,
	EmbedFilter,
	NumberFilter,
	NumberFilterCondition,
	TextCondition,
	FileCondition,
	CheckboxCondition,
	TagCondition,
	MultiTagCondition,
	EmbedCondition,
	NumberCondition,
	DateCondition,
	CreationTimeCondition,
	LastEditedTimeCondition,
	DateFilterOption,
	NumberFormat,
	Source,
	SourceType,
	Filter,
	SourceFileFilter,
	ObsidianFolderSource,
	ExternalRowOrder,
	DateFormatSeparator,
	TextCell,
	NumberCell,
	DateCell,
	CreationTimeCell,
	EmbedCell,
	LastEditedTimeCell,
	SourceCell,
	SourceFileCell,
	CheckboxCell,
	FileCell,
	TagCell,
	MultiTagCell,
} from "./types/loom-state";

import { Color } from "src/shared/loom-state/types/loom-state";
import { generateUuid } from "../uuid";
import { getCurrentDateTime } from "../date/utils";

export const createFolderSource = (
	path: string,
	includeSubfolders: boolean
): ObsidianFolderSource => {
	return {
		id: generateUuid(),
		type: SourceType.FOLDER,
		path,
		includeSubfolders,
	};
};

export const createTagSource = (name: string): Source => {
	return {
		id: generateUuid(),
		type: SourceType.TAG,
		name,
	};
};

export const createExternalRowOrder = (
	sourceId: string,
	index: number,
	uniqueId: string
): ExternalRowOrder => {
	return {
		sourceId,
		index,
		uniqueId,
	};
};

export const createColumn = (options?: {
	type?: CellType;
	content?: string;
	frontmatterKey?: string | null;
	tags?: Tag[];
	includeTime?: boolean;
}): Column => {
	const {
		type = CellType.TEXT,
		content = "New Column",
		includeTime = false,
		frontmatterKey = null,
		tags = [],
	} = options || {};
	return {
		id: generateUuid(),
		sortDir: SortDir.NONE,
		isVisible: true,
		width: "140px",
		type,
		numberPrefix: "",
		numberSuffix: "",
		numberSeparator: "",
		content,
		numberFormat: NumberFormat.NUMBER,
		currencyType: CurrencyType.UNITED_STATES,
		dateFormat: DateFormat.MM_DD_YYYY,
		dateFormatSeparator: DateFormatSeparator.HYPHEN,
		hour12: true,
		includeTime,
		shouldWrapOverflow: true,
		tags,
		calculationType: GeneralCalculation.NONE,
		aspectRatio: AspectRatio.UNSET,
		horizontalPadding: PaddingSize.UNSET,
		verticalPadding: PaddingSize.UNSET,
		frontmatterKey,
	};
};

export const createRow = (
	index: number,
	options?: {
		cells?: Cell[];
		sourceId?: string;
		creationDateTime?: string;
		lastEditedDateTime?: string;
	}
): Row => {
	const currentDateTime = getCurrentDateTime();
	const {
		cells = [],
		sourceId = null,
		creationDateTime = currentDateTime,
		lastEditedDateTime = currentDateTime,
	} = options || {};

	return {
		id: generateUuid(),
		index,
		sourceId,
		creationDateTime,
		lastEditedDateTime,
		cells,
	};
};

export const createTextCell = (
	columnId: string,
	options?: {
		content?: string;
	}
): TextCell => {
	const { content = "" } = options ?? {};
	return {
		id: generateUuid(),
		columnId,
		content,
	};
};

export const createNumberCell = (
	columnId: string,
	options?: {
		value?: number | null;
	}
): NumberCell => {
	const { value = null } = options ?? {};
	return {
		id: generateUuid(),
		columnId,
		value,
	};
};

export const createDateCell = (
	columnId: string,
	options?: {
		dateTime?: string | null;
	}
): DateCell => {
	const { dateTime = null } = options ?? {};
	return {
		id: generateUuid(),
		columnId,
		dateTime,
	};
};

export const createLastEditedTimeCell = (
	columnId: string
): LastEditedTimeCell => {
	return {
		id: generateUuid(),
		columnId,
	};
};

export const createCreationTimeCell = (columnId: string): CreationTimeCell => {
	return {
		id: generateUuid(),
		columnId,
	};
};

export const createSourceCell = (columnId: string): SourceCell => {
	return {
		id: generateUuid(),
		columnId,
	};
};

export const createSourceFileCell = (
	columnId: string,
	options?: {
		path?: string;
	}
): SourceFileCell => {
	const { path = "" } = options || {};
	return {
		id: generateUuid(),
		columnId,
		path,
	};
};

export const createEmbedCell = (
	columnId: string,
	options?: {
		isExternal?: boolean;
		pathOrUrl?: string;
		alias?: string | null;
	}
): EmbedCell => {
	const { isExternal = false, pathOrUrl = "", alias = null } = options || {};
	return {
		id: generateUuid(),
		columnId,
		isExternal,
		pathOrUrl,
		alias,
	};
};

export const createFileCell = (
	columnId: string,
	options?: {
		path?: string;
		alias?: string;
	}
): FileCell => {
	const { path = "", alias = null } = options || {};
	return {
		id: generateUuid(),
		columnId,
		path,
		alias,
	};
};

export const createCheckboxCell = (
	columnId: string,
	options?: {
		value?: boolean;
	}
): CheckboxCell => {
	const { value = false } = options || {};
	return {
		id: generateUuid(),
		columnId,
		value,
	};
};

export const createTagCell = (
	columnId: string,
	options?: {
		tagId?: string | null;
	}
): TagCell => {
	const { tagId = null } = options || {};
	return {
		id: generateUuid(),
		columnId,
		tagId,
	};
};

export const createMultiTagCell = (
	columnId: string,
	options?: {
		tagIds?: string[];
	}
): MultiTagCell => {
	const { tagIds = [] } = options || {};
	return {
		id: generateUuid(),
		columnId,
		tagIds,
	};
};

export const createSourceFileFilter = (
	columnId: string,
	options?: {
		condition?: TextCondition;
		isEnabled?: boolean;
		text?: string;
	}
): SourceFileFilter => {
	const {
		condition = TextFilterCondition.IS,
		isEnabled = true,
		text = "",
	} = options || {};
	const baseFilter = createBaseFilter(columnId, {
		isEnabled,
	});
	return {
		...baseFilter,
		type: CellType.SOURCE_FILE,
		condition,
		text,
	};
};

export const createTextFilter = (
	columnId: string,
	options?: {
		condition?: TextCondition;
		isEnabled?: boolean;
		text?: string;
	}
): TextFilter => {
	const {
		condition = TextFilterCondition.IS,
		isEnabled = true,
		text = "",
	} = options || {};
	const baseFilter = createBaseFilter(columnId, {
		isEnabled,
	});
	return {
		...baseFilter,
		type: CellType.TEXT,
		condition,
		text,
	};
};

export const createFileFilter = (
	columnId: string,
	options?: {
		condition?: FileCondition;
		isEnabled?: boolean;
		text?: string;
	}
): FileFilter => {
	const {
		condition = TextFilterCondition.IS,
		isEnabled = true,
		text = "",
	} = options || {};
	const baseFilter = createBaseFilter(columnId, {
		isEnabled,
	});
	return {
		...baseFilter,
		type: CellType.FILE,
		condition,
		text,
	};
};

export const createCheckboxFilter = (
	columnId: string,
	options?: {
		condition?: CheckboxCondition;
		isEnabled?: boolean;
		value?: boolean;
	}
): CheckboxFilter => {
	const {
		condition = TextFilterCondition.IS,
		isEnabled = true,
		value = false,
	} = options || {};
	const baseFilter = createBaseFilter(columnId, {
		isEnabled,
	});
	return {
		...baseFilter,
		type: CellType.CHECKBOX,
		condition,
		isEnabled,
		value,
	};
};

export const createTagFilter = (
	columnId: string,
	options?: {
		condition?: TagCondition;
		tagId?: string;
		isEnabled?: boolean;
	}
): TagFilter => {
	const {
		condition = TextFilterCondition.IS,
		isEnabled = true,
		tagId = "",
	} = options || {};
	const baseFilter = createBaseFilter(columnId, {
		isEnabled,
	});
	return {
		...baseFilter,
		type: CellType.TAG,
		condition,
		tagId,
		isEnabled,
	};
};

export const createMultiTagFilter = (
	columnId: string,
	options?: {
		condition?: MultiTagCondition;
		tagIds?: string[];
		isEnabled?: boolean;
	}
): MultiTagFilter => {
	const {
		condition = TextFilterCondition.CONTAINS,
		isEnabled = true,
		tagIds = [],
	} = options || {};
	const baseFilter = createBaseFilter(columnId, {
		isEnabled,
	});
	return {
		...baseFilter,
		type: CellType.MULTI_TAG,
		condition,
		tagIds,
	};
};

export const createEmbedFilter = (
	columnId: string,
	options?: {
		condition?: EmbedCondition;
		isEnabled?: boolean;
		text?: string;
	}
): EmbedFilter => {
	const {
		condition = TextFilterCondition.IS_EMPTY,
		isEnabled = true,
		text = "",
	} = options || {};
	const baseFilter = createBaseFilter(columnId, {
		isEnabled,
	});
	return {
		...baseFilter,
		type: CellType.EMBED,
		condition,
		text,
	};
};

export const createNumberFilter = (
	columnId: string,
	options?: {
		condition?: NumberCondition;
		isEnabled?: boolean;
		text?: string;
	}
): NumberFilter => {
	const {
		condition = NumberFilterCondition.IS_EQUAL,
		isEnabled = true,
		text = "",
	} = options || {};
	const baseFilter = createBaseFilter(columnId, {
		isEnabled,
	});
	return {
		...baseFilter,
		type: CellType.NUMBER,
		condition,
		text,
	};
};

export const createDateFilter = (
	columnId: string,
	options?: {
		condition?: DateCondition;
		isEnabled?: boolean;
		dateTime?: string | null;
		option?: DateFilterOption;
	}
): DateFilter => {
	const {
		condition = DateFilterCondition.IS,
		isEnabled = true,
		dateTime = null,
		option = DateFilterOption.UNSELECTED,
	} = options || {};
	const baseFilter = createBaseFilter(columnId, {
		isEnabled,
	});
	return {
		...baseFilter,
		type: CellType.DATE,
		condition,
		option,
		dateTime,
	};
};

export const createCreationTimeFilter = (
	columnId: string,
	options?: {
		condition?: CreationTimeCondition;
		isEnabled?: boolean;
		option?: DateFilterOption;
		dateTime?: string | null;
	}
): CreationTimeFilter => {
	const {
		condition = DateFilterCondition.IS,
		isEnabled = true,
		option = DateFilterOption.UNSELECTED,
		dateTime = null,
	} = options || {};
	const baseFilter = createBaseFilter(columnId, {
		isEnabled,
	});
	return {
		...baseFilter,
		type: CellType.CREATION_TIME,
		option,
		condition,
		dateTime,
	};
};

export const createLastEditedTimeFilter = (
	columnId: string,
	options?: {
		condition?: LastEditedTimeCondition;
		isEnabled?: boolean;
		option?: DateFilterOption;
		dateTime?: string | null;
	}
): LastEditedTimeFilter => {
	const {
		condition = DateFilterCondition.IS,
		isEnabled = true,
		option = DateFilterOption.UNSELECTED,
		dateTime = null,
	} = options || {};
	const baseFilter = createBaseFilter(columnId, {
		isEnabled,
	});
	return {
		...baseFilter,
		type: CellType.LAST_EDITED_TIME,
		option,
		condition,
		dateTime,
	};
};

const createBaseFilter = (
	columnId: string,
	options?: {
		isEnabled?: boolean;
	}
): BaseFilter => {
	const { isEnabled = true } = options || {};
	return {
		id: generateUuid(),
		columnId,
		operator: "or",
		isEnabled,
	};
};

export const createTag = (
	content: string,
	options?: { color?: Color }
): Tag => {
	const { color = randomColor() } = options || {};
	return {
		id: generateUuid(),
		content,
		color,
	};
};

export const createCellForType = (columnId: string, type: CellType): Cell => {
	switch (type) {
		case CellType.TEXT:
			return createTextCell(columnId);
		case CellType.NUMBER:
			return createNumberCell(columnId);
		case CellType.DATE:
			return createDateCell(columnId);
		case CellType.CREATION_TIME:
			return createCreationTimeCell(columnId);
		case CellType.LAST_EDITED_TIME:
			return createLastEditedTimeCell(columnId);
		case CellType.EMBED:
			return createEmbedCell(columnId);
		case CellType.FILE:
			return createFileCell(columnId);
		case CellType.CHECKBOX:
			return createCheckboxCell(columnId);
		case CellType.TAG:
			return createTagCell(columnId);
		case CellType.MULTI_TAG:
			return createMultiTagCell(columnId);
		case CellType.SOURCE:
			return createSourceCell(columnId);
		case CellType.SOURCE_FILE:
			return createSourceFileCell(columnId);
		default:
			throw new Error("Unhandled cell type");
	}
};

export const createLoomState = (
	numColumns: number,
	numRows: number,
	options?: {
		type?: CellType;
		pluginVersion?: string;
		frozenColumnCount?: number;
	}
): LoomState => {
	const {
		type,
		pluginVersion = "1.0.0",
		frozenColumnCount = 1,
	} = options || {};
	//Create columns
	const columns: Column[] = [];
	for (let i = 0; i < numColumns; i++) {
		columns.push(createColumn({ type }));
	}

	//Create rows
	const rows: Row[] = [];
	for (let i = 0; i < numRows; i++) {
		const cells: Cell[] = [];
		for (let j = 0; j < numColumns; j++) {
			const newCell = createTextCell(columns[j].id);
			cells.push(newCell);
		}
		const row = createRow(i, {
			cells,
		});
		rows.push(row);
	}

	return createGenericLoomState({
		columns,
		rows,
		pluginVersion,
		frozenColumnCount,
	});
};

export const createGenericLoomState = (options?: {
	columns?: Column[];
	rows?: Row[];
	sources?: Source[];
	filters?: Filter[];
	pluginVersion?: string;
	frozenColumnCount?: number;
}): LoomState => {
	const {
		pluginVersion = "1.0.0",
		frozenColumnCount = 1,
		filters = [],
		sources = [],
		columns = [],
		rows = [],
	} = options || {};
	return {
		model: {
			columns,
			rows,
			filters,
			sources,
			settings: {
				numFrozenColumns: frozenColumnCount,
				showCalculationRow: true,
			},
			externalRowOrder: [],
		},
		pluginVersion,
	};
};
