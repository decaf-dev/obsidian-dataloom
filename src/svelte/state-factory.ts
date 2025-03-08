import { createTextCell } from "./cell-factory";
import type { ParsedTableData } from "./table-parser";
import type { Cell, Column, NewLoomState, Row } from "./types";
import { CellType, GeneralCalculation, SortDir } from "./types";
import { generateUuid, getCurrentDateTime } from "./utils";

export const createNewLoomState = (
	tableData: ParsedTableData,
	pluginVersion: string
): NewLoomState => {
	const columns = tableData.head.map((columnText) =>
		createColumn({ type: CellType.TEXT, content: columnText })
	);

	const rows = tableData.body.map((row, i) => {
		const cells = row.map((cellText, j) => {
			return createTextCell(columns[j].id, { content: cellText });
		});
		return createRow(i, { cells });
	});

	return createGenericLoomState({
		columns,
		rows,
		pluginVersion,
	});
};

export const createGenericLoomState = (options?: {
	columns?: Column[];
	rows?: Row[];
	pluginVersion?: string;
}): NewLoomState => {
	const { pluginVersion = "1.0.0", columns = [], rows = [] } = options || {};
	return {
		model: {
			columns,
			rows,
		},
		pluginVersion,
	};
};

export const createColumn = (options?: {
	type?: CellType;
	content?: string;
}): Column => {
	const { type = CellType.TEXT, content = "" } = options || {};
	return {
		id: generateUuid(),
		sortDir: SortDir.NONE,
		width: "140px",
		type,
		content,
		calculationType: GeneralCalculation.NONE,
	};
};

export const createRow = (
	index: number,
	options?: {
		cells?: Cell[];
		creationDateTime?: string;
		lastEditedDateTime?: string;
	}
): Row => {
	const currentDateTime = getCurrentDateTime();
	const {
		cells = [],
		creationDateTime = currentDateTime,
		lastEditedDateTime = currentDateTime,
	} = options || {};

	return {
		id: generateUuid(),
		index,
		creationDateTime,
		lastEditedDateTime,
		cells,
	};
};
