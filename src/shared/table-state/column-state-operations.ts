import { ColumnIdError } from "./table-error";
import { CellType, Column, TableState, SortDir } from "./types";
import {
	createBodyCell,
	createColumn,
	createFooterCell,
	createHeaderCell,
	createTag,
} from "src/data/table-state-factory";
import { CHECKBOX_MARKDOWN_UNCHECKED } from "./constants";
import { isCellTypeFilterable } from "./filter-by-rules";

export const columnAdd = (prevState: TableState): TableState => {
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

export const columnSort = (
	prevState: TableState,
	columnId: string,
	sortDir: SortDir
): TableState => {
	const { model } = prevState;
	const { columns } = model;

	return {
		...prevState,
		model: {
			...model,
			columns: columns.map((column) => {
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
			}),
		},
	};
};

export const columnUpdate = (
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

export const columnDelete = (
	prevState: TableState,
	options: { id?: string; last?: boolean }
): TableState => {
	const { id, last } = options;
	if (!id && !last) throw new Error("deleteColumn: no id or last provided");

	if (last) {
		const { columns } = prevState.model;
		const lastColumn = columns[columns.length - 1];
		return columnDelete(prevState, { id: lastColumn.id });
	}

	const { bodyCells, headerCells, footerCells, columns, tags, filterRules } =
		prevState.model;
	return {
		...prevState,
		model: {
			...prevState.model,
			columns: columns.filter((column) => column.id !== id),
			headerCells: headerCells.filter((cell) => cell.columnId !== id),
			bodyCells: bodyCells.filter((cell) => cell.columnId !== id),
			footerCells: footerCells.filter((cell) => cell.columnId !== id),
			tags: tags.filter((tag) => tag.columnId !== id),
			filterRules: filterRules.filter((rule) => rule.columnId !== id),
		},
	};
};

export const columnChangeType = (
	prevState: TableState,
	columnId: string,
	newType: CellType
): TableState => {
	const { columns, tags, bodyCells, filterRules } = prevState.model;
	const column = columns.find((column) => column.id === columnId);
	if (!column) throw new ColumnIdError(columnId);
	const { type: previousType } = column;

	//If same type return
	if (previousType === newType) return prevState;

	console.log(newType);

	let tagsCopy = structuredClone(tags);
	let bodyCellsCopy = structuredClone(bodyCells);

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
	} else if (newType === CellType.TAG || newType === CellType.MULTI_TAG) {
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
	} else if (newType === CellType.CHECKBOX) {
		const cells = bodyCellsCopy.filter(
			(cell) => cell.columnId === columnId
		);
		cells.forEach((cell) => {
			if (cell.markdown === "") {
				const index = bodyCellsCopy.indexOf(cell);
				bodyCellsCopy[index].markdown = CHECKBOX_MARKDOWN_UNCHECKED;
			}
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
			bodyCells: bodyCellsCopy,
			tags: tagsCopy,
			filterRules: filterRules.filter((rule) => {
				if (rule.columnId === columnId) {
					if (isCellTypeFilterable(newType)) return true;
					return false;
				}
				return true;
			}),
		},
	};
};
