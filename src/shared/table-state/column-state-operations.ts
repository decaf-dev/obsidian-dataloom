import { ColumnIdError } from "./table-error";
import {
	CellType,
	Column,
	TableState,
	SortDir,
	HeaderCell,
	BodyCell,
	FooterCell,
	Tag,
	FilterRule,
} from "./types";
import {
	createBodyCell,
	createColumn,
	createFooterCell,
	createHeaderCell,
	createTag,
} from "src/data/table-state-factory";
import { CHECKBOX_MARKDOWN_UNCHECKED } from "./constants";
import TableStateCommand from "./table-state-command";
import { isCellTypeFilterable } from "./filter-by-rules";
import {
	unixTimeToDateString,
	unixTimeToDateTimeString,
} from "../date/date-conversion";

export class ColumnDeleteCommand implements TableStateCommand {
	columnId: string | undefined;
	last: boolean | undefined;

	deletedColumn: Column | undefined = undefined;
	deletedHeaderCells: HeaderCell[] | undefined = undefined;
	deletedBodyCells: BodyCell[] | undefined = undefined;
	deletedFooterCells: FooterCell[] | undefined = undefined;
	deletedTags: Tag[] | undefined = undefined;
	deletedFilterRules: FilterRule[] | undefined = undefined;

	constructor(options: { id?: string; last?: boolean }) {
		const { id, last } = options;
		if (id === undefined && last === undefined)
			throw new Error("Either id or last must be defined");
		this.columnId = id;
		this.last = last;
	}

	execute(prevState: TableState): TableState {
		const {
			columns,
			headerCells,
			bodyCells,
			footerCells,
			tags,
			filterRules,
		} = prevState.model;
		if (columns.length === 1) return prevState;

		let id = this.columnId;
		if (this.last) {
			id = columns[columns.length - 1].id;
		}

		const columnToDelete = columns.find((column) => column.id === id);
		if (!columnToDelete) throw new ColumnIdError(id!);

		const headerCellsToDelete = headerCells.filter(
			(cell) => cell.columnId === id
		);
		if (headerCellsToDelete.length === 0)
			throw new Error("No header cells to delete");

		const bodyCellsToDelete = bodyCells.filter(
			(cell) => cell.columnId === id
		);

		const footerCellsToDelete = footerCells.filter(
			(cell) => cell.columnId === id
		);
		if (footerCellsToDelete.length === 0)
			throw new Error("No footer cells to delete");

		const tagsToDelete = tags.filter((tag) => tag.columnId === id);
		const filterRulesToDelete = filterRules.filter(
			(rule) => rule.columnId === id
		);

		this.deletedColumn = structuredClone(columnToDelete);
		this.deletedHeaderCells = structuredClone(headerCellsToDelete);
		this.deletedBodyCells = structuredClone(bodyCellsToDelete);
		this.deletedFooterCells = structuredClone(footerCellsToDelete);
		this.deletedTags = structuredClone(tagsToDelete);
		this.deletedFilterRules = structuredClone(filterRulesToDelete);

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
	}

	undo(prevState: TableState): TableState {
		if (
			this.deletedColumn === undefined ||
			this.deletedBodyCells === undefined ||
			this.deletedFilterRules === undefined ||
			this.deletedFooterCells === undefined ||
			this.deletedHeaderCells === undefined ||
			this.deletedTags === undefined
		)
			throw new Error("Execute must be called before undo is available");

		const {
			columns,
			headerCells,
			bodyCells,
			footerCells,
			tags,
			filterRules,
		} = prevState.model;
		return {
			...prevState,
			model: {
				...prevState.model,
				columns: [...columns, this.deletedColumn],
				headerCells: [...headerCells, ...this.deletedHeaderCells],
				bodyCells: [...bodyCells, ...this.deletedBodyCells],
				footerCells: [...footerCells, ...this.deletedFooterCells],
				tags: [...tags, ...this.deletedTags],
				filterRules: [...filterRules, ...this.deletedFilterRules],
			},
		};
	}
}

export class ColumnAddCommand implements TableStateCommand {
	newColumnId: string | undefined = undefined;

	execute(prevState: TableState): TableState {
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
		const newColumn = createColumn();
		this.newColumnId = newColumn.id;

		const newHeaderCells = headerRows.map((row) =>
			createHeaderCell(newColumn.id, row.id)
		);

		const newBodyCells = bodyRows.map((row) =>
			createBodyCell(newColumn.id, row.id)
		);
		const newFooterCells = footerRows.map((row) =>
			createFooterCell(newColumn.id, row.id)
		);

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: [...columns, newColumn],
				headerCells: [...headerCells, ...newHeaderCells],
				bodyCells: [...bodyCells, ...newBodyCells],
				footerCells: [...footerCells, ...newFooterCells],
			},
		};
	}
	undo(prevState: TableState): TableState {
		if (this.newColumnId === undefined)
			throw new Error("Execute must be called before undo is available");

		const { columns, headerCells, bodyCells, footerCells } =
			prevState.model;
		return {
			...prevState,
			model: {
				...prevState.model,
				columns: columns.filter(
					(column) => column.id !== this.newColumnId
				),
				headerCells: headerCells.filter(
					(cell) => cell.columnId !== this.newColumnId
				),
				bodyCells: bodyCells.filter(
					(cell) => cell.columnId !== this.newColumnId
				),
				footerCells: footerCells.filter(
					(cell) => cell.columnId !== this.newColumnId
				),
			},
		};
	}
}

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
