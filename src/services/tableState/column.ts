import { SortDir } from "../sort/types";
import StateFactory from "./StateFactory";
import { CellType, Column, TableState } from "./types";
import { sortCells } from "./utils";

export const addColumn = (prevState: TableState): TableState => {
	const { cells, columns, rows } = prevState.model;
	const columnsCopy = [...columns];
	const newColumn = StateFactory.createColumn();
	columnsCopy.push(newColumn);

	let cellsCopy = [...cells];

	rows.forEach((row, i) => {
		cellsCopy.push(StateFactory.createCell(newColumn.id, row.id, i === 0));
	});

	cellsCopy = sortCells(columnsCopy, rows, cellsCopy);

	return {
		...prevState,
		model: {
			...prevState.model,
			columns: columnsCopy,
			cells: cellsCopy,
		},
	};
};

export const sortOnColumn = (
	prevState: TableState,
	columnId: string,
	sortDir: SortDir
): TableState => {
	const { columns } = prevState.model;
	const columnsCopy = [...columns];
	columnsCopy.map((column) => {
		if (column.id === columnId) {
			return {
				...column,
				sortDir,
			};
		} else {
			return {
				...column,
				sortDir: SortDir.NONE,
			};
		}
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
	value: unknown
): TableState => {
	return {
		...prevState,
		model: {
			...prevState.model,
			columns: prevState.model.columns.map((column) => {
				if (column.id == columnId) {
					return {
						...column,
						[key as keyof Column]: value,
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
	const { cells, columns } = prevState.model;
	return {
		...prevState,
		model: {
			...prevState.model,
			columns: columns.filter((column) => column.id !== columnId),
			cells: cells.filter((cell) => cell.columnId !== columnId),
		},
	};
};

export const moveColumn = (
	prevState: TableState,
	columnId: string,
	moveRight: boolean
): TableState => {
	const { rows, cells, columns } = prevState.model;
	const columnsCopy = [...columns];
	const index = columnsCopy.findIndex((column) => column.id === columnId);
	const moveIndex = moveRight ? index + 1 : index - 1;

	//Swap values
	const old = columnsCopy[moveIndex];
	columnsCopy[moveIndex] = columnsCopy[index];
	columnsCopy[index] = old;

	const updatedCells = sortCells(columnsCopy, rows, cells);

	return {
		...prevState,
		model: {
			...prevState.model,
			columns: columnsCopy,
			cells: updatedCells,
		},
	};
};

export const changeColumnType = (
	prevState: TableState,
	columnId: string,
	newType: CellType
) => {
	const { columns } = prevState.model;
	const column = columns.find((column) => column.id === columnId);
	const { type: previousType } = column;

	//If same type return
	if (previousType === newType) return prevState;

	let tagsCopy = [...column.tags];

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
		const cells = prevState.model.cells.filter(
			(cell) =>
				cell.columnId === columnId &&
				cell.markdown !== "" &&
				!cell.isHeader
		);
		cells.forEach((cell) => {
			cell.markdown.split(",").map((markdown, i) => {
				//We found a previous tag that matches this markdown
				const found = tagsCopy.find((t) => t.markdown === markdown);

				//If the tag that we want to add already exists
				if (found) {
					const index = tagsCopy.indexOf(found);
					//If we already have a reference to that tag
					if (found.cells.find((id) => cell.id)) {
						//And we allow only 1 selected tag, then remove the reference
						if (i > 0 && newType === CellType.TAG) {
							tagsCopy[index].cells = tagsCopy[
								index
							].cells.filter((c) => c === cell.id);
						}
						//Else add a reference
					} else {
						tagsCopy[index].cells.push(cell.id);
					}
					return;
				}

				tagsCopy.push(StateFactory.createTag(cell, markdown));
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
						tags: tagsCopy,
						type: newType,
					};
				}
				return column;
			}),
		},
	};
};
