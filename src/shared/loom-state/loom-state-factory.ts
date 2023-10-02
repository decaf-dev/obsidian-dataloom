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
} from "./types/loom-state";

import { v4 as uuidv4 } from "uuid";
import { CHECKBOX_MARKDOWN_UNCHECKED } from "src/shared/constants";
import { Color } from "src/shared/loom-state/types/loom-state";

export const createSource = (type: SourceType, content: string): Source => {
	return {
		id: uuidv4(),
		type,
		content,
	};
};
export const createColumn = (options?: {
	type?: CellType;
	content?: string;
}): Column => {
	const { type = CellType.TEXT, content = "New Column" } = options || {};
	return {
		id: uuidv4(),
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
		shouldWrapOverflow: true,
		tags: [],
		calculationType: GeneralCalculation.NONE,
		aspectRatio: AspectRatio.UNSET,
		horizontalPadding: PaddingSize.UNSET,
		verticalPadding: PaddingSize.UNSET,
		frontmatterKey: null,
	};
};

export const createRow = (
	index: number,
	options?: {
		cells?: Cell[];
		sourceId?: string;
		creationTime?: number;
		lastEditedTime?: number;
	}
): Row => {
	const currentTime = Date.now();
	const {
		cells = [],
		sourceId = null,
		creationTime = currentTime,
		lastEditedTime = currentTime,
	} = options || {};

	return {
		id: uuidv4(),
		index,
		sourceId,
		creationTime,
		lastEditedTime,
		cells,
	};
};

export const createCell = (
	columnId: string,
	options: {
		cellType?: CellType;
		tagIds?: string[];
		content?: string;
		dateTime?: number | null;
	} = {}
): Cell => {
	const {
		cellType,
		tagIds = [],
		content: originalContent = "",
		dateTime = null,
	} = options ?? {};

	let content = originalContent;
	if (cellType === CellType.CHECKBOX) {
		if (content === "") {
			content = CHECKBOX_MARKDOWN_UNCHECKED;
		}
	}
	return {
		id: uuidv4(),
		isExternalLink: false,
		columnId,
		dateTime,
		content,
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
		text?: string;
	}
): CheckboxFilter => {
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
		type: CellType.CHECKBOX,
		condition,
		text,
		isEnabled,
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
		dateTime?: number | null;
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
		dateTime?: number | null;
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
		dateTime?: number | null;
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
		id: uuidv4(),
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
		id: uuidv4(),
		content,
		color,
	};
};

export const createRowWithCells = (
	index: number,
	columns: Column[],
	options?: {
		sourceId?: string;
		defaultContent?: {
			type: CellType;
			content: string;
		};
	}
): Row => {
	const { sourceId, defaultContent } = options || {};
	const cells: Cell[] = [];
	columns.forEach((column) => {
		const { id, type } = column;

		let content = "";
		if (defaultContent) {
			if (type === defaultContent.type) {
				content = defaultContent.content;
			}
		}
		const cell = createCell(id, {
			cellType: column.type,
			content,
		});
		cells.push(cell);
	});
	return createRow(index, {
		cells,
		sourceId,
	});
};

export const createCustomTestLoomState = (
	columns: Column[],
	rows: Row[],
	options?: {
		sources: Source[];
	}
) => {
	const { sources } = options || {};
	return createGenericLoomState({
		columns,
		rows,
		sources,
	});
};

export const createTestLoomState = (
	numColumns: number,
	numRows: number,
	options?: {
		cellType?: CellType;
	}
): LoomState => {
	return createBasicLoomState(numColumns, numRows, {
		cellType: options?.cellType,
	});
};

export const createLoomState = (
	pluginVersion: string,
	frozenColumnCount: number
): LoomState => {
	return createBasicLoomState(1, 1, {
		pluginVersion,
		frozenColumnCount,
	});
};

const createBasicLoomState = (
	numColumns: number,
	numRows: number,
	options?: {
		cellType?: CellType;
		pluginVersion?: string;
		frozenColumnCount?: number;
	}
): LoomState => {
	const {
		cellType,
		pluginVersion = "1.0.0",
		frozenColumnCount = 1,
	} = options || {};
	//Create columns
	const columns: Column[] = [];
	for (let i = 0; i < numColumns; i++) {
		columns.push(createColumn({ type: cellType }));
	}

	//Create rows
	const rows: Row[] = [];
	for (let i = 0; i < numRows; i++) {
		const cells: Cell[] = [];
		for (let j = 0; j < numColumns; j++) {
			const newCell = createCell(columns[j].id);
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

const createGenericLoomState = (options?: {
	sources?: Source[];
	columns?: Column[];
	rows?: Row[];
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
		},
		pluginVersion,
	};
};
