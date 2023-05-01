import { ColumnIdError } from "./error";
import { CellType, Column, TableState, SortDir } from "../../data/types";
import {
	createBodyCell,
	createColumn,
	createFooterCell,
	createHeaderCell,
	createTag,
} from "src/data/table-state-factory";

export const addColumn = (prevState: TableState): TableState => {
	const {
		headerCells,
		bodyCells,
		footerCells,
		columns,
		headerRows,
		bodyRows,
		footerRows,
	} = prevState.model;

	//Add column
	const columnsCopy = structuredClone(columns);
	const newColumn = createColumn();
	columnsCopy.push(newColumn);

	//Add header cells
	const headerCellsCopy = structuredClone(headerCells);

	headerRows.forEach((row, i) => {
		headerCellsCopy.push(createHeaderCell(newColumn.id, row.id));
	});

	//Add bdoy cells
	const bodyCellsCopy = structuredClone(bodyCells);

	bodyRows.forEach((row, i) => {
		bodyCellsCopy.push(createBodyCell(newColumn.id, row.id));
	});

	//Add footer cells
	const footerCellsCopy = structuredClone(footerCells);

	footerRows.forEach((row, i) => {
		footerCellsCopy.push(createFooterCell(newColumn.id, row.id));
	});

	return {
		...prevState,
		model: {
			...prevState.model,
			columns: columnsCopy,
			headerCells: headerCellsCopy,
			bodyCells: bodyCellsCopy,
			footerCells: footerCellsCopy,
		},
	};
};

export const sortOnColumn = (
	prevState: TableState,
	columnId: string,
	sortDir: SortDir
): TableState => {
	const { columns } = prevState.model;

	let columnsCopy = structuredClone(columns);
	columnsCopy = columnsCopy.map((column) => {
		if (column.id === columnId) {
			return {
				...column,
				sortDir,
			};
		}
		return {
			...column,
			sortDir: SortDir.NONE,
		};
	});

	return {
		...prevState,
		model: {
			...prevState.model,
			columns: columnsCopy,
		},
	};
};

export const updateColumn = (
	prevState: TableState,
	columnId: string,
	key: keyof Column,
	value?: unknown
): TableState => {
	return {
		...prevState,
		model: {
			...prevState.model,
			columns: prevState.model.columns.map((column) => {
				const isBoolean = typeof column[key] === "boolean";

				//If we don't provide a value, we assume that the value is a boolean
				//and we will toggle it
				if (!isBoolean && value === undefined)
					throw new Error("updateColumn value is undefined");

				if (column.id == columnId) {
					return {
						...column,
						[key as keyof Column]: isBoolean ? !column[key] : value,
					};
				}
				return column;
			}),
		},
	};
};

export const deleteColumn = (
	prevState: TableState,
	columnId: string
): TableState => {
	const { bodyCells, headerCells, footerCells, columns, tags } =
		prevState.model;
	return {
		...prevState,
		model: {
			...prevState.model,
			columns: columns.filter((column) => column.id !== columnId),
			headerCells: headerCells.filter(
				(cell) => cell.columnId !== columnId
			),
			bodyCells: bodyCells.filter((cell) => cell.columnId !== columnId),
			footerCells: footerCells.filter(
				(cell) => cell.columnId !== columnId
			),
			tags: tags.filter((tag) => tag.columnId !== columnId),
		},
	};
};

export const changeColumnType = (
	prevState: TableState,
	columnId: string,
	newType: CellType
): TableState => {
	const { columns, tags, bodyCells } = prevState.model;
	const column = columns.find((column) => column.id === columnId);
	if (!column) throw new ColumnIdError(columnId);

	const { type: previousType } = column;

	//If same type return
	if (previousType === newType) return prevState;

	let tagsCopy = structuredClone(tags);

	if (
		(previousType === CellType.MULTI_TAG && newType !== CellType.TAG) ||
		(previousType === CellType.TAG && newType !== CellType.MULTI_TAG)
	) {
		//Remove tag references to cells but don't delete the tags
		tagsCopy = tagsCopy.map((t) => {
			return {
				...t,
				cells: [],
			};
		});
	} else if (newType === CellType.TAG || CellType.MULTI_TAG) {
		const cells = bodyCells.filter(
			(cell) => cell.columnId === columnId && cell.markdown !== ""
		);
		cells.forEach((cell) => {
			cell.markdown.split(",").map((markdown, i) => {
				//We found a previous tag that matches this markdown
				const found = tagsCopy.find((t) => t.markdown === markdown);

				//If the tag that we want to add already exists
				if (found) {
					const index = tagsCopy.indexOf(found);
					//If we already have a reference to that tag
					if (found.cellIds.find((id) => id === cell.id)) {
						//And we allow only 1 selected tag, then remove the reference
						if (i > 0 && newType === CellType.TAG) {
							tagsCopy[index].cellIds = tagsCopy[
								index
							].cellIds.filter((c) => c === cell.id);
						}
						//Else add a reference
					} else {
						tagsCopy[index].cellIds.push(cell.id);
					}
					return;
				}

				tagsCopy.push(createTag(columnId, cell.id, markdown));
			});
		});
	}
	return {
		...prevState,
		model: {
			...prevState.model,
			columns: columns.map((column) => {
				if (column.id === columnId) {
					return {
						...column,
						type: newType,
					};
				}
				return column;
			}),
			tags: tagsCopy,
		},
	};
};
