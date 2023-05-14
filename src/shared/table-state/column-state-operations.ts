import { ColumnIdError } from "./table-error";
import { CellType, Column, TableState, SortDir } from "./types";
import { createTag } from "src/data/table-state-factory";
import { CHECKBOX_MARKDOWN_UNCHECKED } from "./constants";
import { isCellTypeFilterable } from "./filter-by-rules";
import { unixTimeToDateString } from "../date/date-conversion";

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
	} else if (newType === CellType.TEXT && previousType == CellType.DATE) {
		const cells = bodyCellsCopy.filter(
			(cell) => cell.columnId === columnId
		);
		cells.forEach((cell) => {
			const { dateTime } = cell;
			if (dateTime !== null) {
				const index = bodyCellsCopy.indexOf(cell);
				bodyCellsCopy[index].markdown = unixTimeToDateString(
					dateTime,
					column.dateFormat
				);
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
