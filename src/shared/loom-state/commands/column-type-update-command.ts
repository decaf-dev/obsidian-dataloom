import { createCellForType } from "src/shared/loom-state/loom-state-factory";
import ColumnNotFoundError from "src/shared/error/column-not-found-error";
import LoomStateCommand from "./loom-state-command";
import { CellType, Column, Filter, LoomState, Row } from "../types/loom-state";
import { cloneDeep } from "lodash";

export default class ColumnTypeUpdateCommand extends LoomStateCommand {
	private targetColumnId: string;
	private nextType: CellType;

	constructor(columnId: string, type: CellType) {
		super(false);
		this.targetColumnId = columnId;
		this.nextType = type;
	}

	execute(prevState: LoomState): LoomState {
		const { columns, rows, filters } = prevState.model;
		const column = columns.find(
			(column) => column.id === this.targetColumnId
		);
		if (!column) throw new ColumnNotFoundError({ id: this.targetColumnId });

		const { type } = column;
		if (type === this.nextType) return prevState;

		let nextColumns: Column[] = cloneDeep(columns);
		let nextRows: Row[] = cloneDeep(rows);

		nextRows = rows.map((row) => {
			const { cells } = row;
			const nextCells = cells.map((cell) => {
				const { columnId } = cell;
				const newCell = createCellForType(columnId, this.nextType);
				return newCell;
			});
			return {
				...row,
				cells: nextCells,
			};
		});

		// if (
		// 	(this.previousType === CellType.MULTI_TAG &&
		// 		this.nextType !== CellType.TAG) ||
		// 	(this.previousType === CellType.TAG &&
		// 		this.nextType !== CellType.MULTI_TAG)
		// ) {
		// 	nextRows = this.fromTagOrMultiTag(nextRows);
		// } else if (
		// 	this.previousType !== CellType.MULTI_TAG &&
		// 	this.nextType === CellType.TAG
		// ) {
		// 	nextRows = this.toTag(nextColumns, nextRows);
		// } else if (
		// 	this.previousType !== CellType.TAG &&
		// 	this.nextType === CellType.MULTI_TAG
		// ) {
		// 	nextRows = this.toMultiTag(column, nextRows);
		// } else if (
		// 	this.previousType === CellType.MULTI_TAG &&
		// 	this.nextType === CellType.TAG
		// ) {
		// 	nextRows = this.fromMultiTagToTag(nextRows);
		// } else if (this.nextType === CellType.CHECKBOX) {
		// 	nextRows = this.toCheckbox(column, nextRows);
		// } else if (
		// 	this.previousType === CellType.DATE &&
		// 	this.nextType === CellType.TEXT
		// ) {
		// 	nextRows = this.fromDateToText(column, nextRows);
		// }

		// if (this.previousType === CellType.NUMBER) {
		// 	nextColumns = this.fromNumber(nextColumns);
		// }

		nextColumns = nextColumns.map((column) => {
			if (column.id === this.targetColumnId) {
				return {
					...column,
					type: this.nextType,
					frontmatterKey: null,
				};
			}
			return column;
		});

		const nextFilters: Filter[] = filters.filter(
			(filter) => filter.columnId !== this.targetColumnId
		);

		const nextState = {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				rows: nextRows,
				filters: nextFilters,
			},
		};
		this.onExecute(prevState, nextState);
		return nextState;
	}

	// private fromNumber(prevColumns: Column[]): Column[] {
	// 	return prevColumns.map((column) => {
	// 		const { id, calculationType } = column;
	// 		if (id === this.targetColumnId) {
	// 			if (isNumberCalcuation(calculationType)) {
	// 				this.previousCalculationType = calculationType;
	// 				this.nextCalculationType = GeneralCalculation.NONE;
	// 				return {
	// 					...column,
	// 					calculationType: GeneralCalculation.NONE,
	// 				};
	// 			}
	// 		}
	// 		return column;
	// 	});
	// }

	// private fromTagOrMultiTag(rows: Row[]): Row[] {
	// 	return rows.map((row) => {
	// 		const { cells } = row;
	// 		const nextCells: Cell[] = cells.map((cell) => {
	// 			if (cell.columnId === this.targetColumnId) {
	// 				if (cell.tagIds.length > 0) {
	// 					const updatedCell: Cell = {
	// 						...cell,
	// 						tagIds: [],
	// 					};
	// 					this.updatedCells.previous.push(cloneDeep(cell));
	// 					this.updatedCells.next.push(updatedCell);
	// 					return updatedCell;
	// 				}
	// 			}
	// 			return cell;
	// 		});
	// 		return {
	// 			...row,
	// 			cells: nextCells,
	// 		};
	// 	});
	// }

	// private fromDateToText(column: Column, rows: Row[]): Row[] {
	// 	return rows.map((row) => {
	// 		const { cells } = row;

	// 		const nextCells: Cell[] = cells.map((cell) => {
	// 			const { dateFormat, dateFormatSeparator, id } = column;

	// 			const { columnId } = cell;
	// 			if (columnId === id) {
	// 				const { dateTime } = cell as DateCell;
	// 				if (dateTime !== null) {
	// 					const dateString = dateTimeToDateString(
	// 						dateTime,
	// 						dateFormat,
	// 						dateFormatSeparator
	// 					);
	// 					const newCell = {
	// 						...cell,
	// 						content: dateString,
	// 					};
	// 					this.updatedCells.previous.push(cloneDeep(cell));
	// 					this.updatedCells.next.push(newCell);
	// 					return newCell;
	// 				}
	// 			}
	// 			return cell;
	// 		});
	// 		return {
	// 			...row,
	// 			cells: nextCells,
	// 		};
	// 	});
	// }

	// private toTag(columns: Column[], prevRows: Row[]): Row[] {
	// 	return prevRows.map((row) => {
	// 		const { cells } = row;
	// 		const nextCells: Cell[] = cells.map((cell) => {
	// 			const { columnId, content } = cell;
	// 			if (columnId === this.targetColumnId) {
	// 				if (content !== "") {
	// 					const tagIds: string[] = [];

	// 					content.split(",").forEach((tagContent) => {
	// 						const column = columns.find(
	// 							(column) => column.id === this.targetColumnId
	// 						);
	// 						if (!column)
	// 							throw new ColumnNotFoundError({
	// 								id: this.targetColumnId,
	// 							});

	// 						const existingTag = column.tags.find(
	// 							(tag) => tag.content === tagContent
	// 						);

	// 						if (tagIds.length === 0) {
	// 							if (existingTag) {
	// 								tagIds.push(existingTag.id);
	// 							} else {
	// 								const tag = createTag(tagContent);
	// 								this.addedTags.push(cloneDeep(tag));
	// 								column.tags.push(tag);
	// 								tagIds.push(tag.id);
	// 							}
	// 						} else {
	// 							//Create a tag but don't attach it to the cell
	// 							if (!existingTag) {
	// 								const tag = createTag(tagContent);
	// 								this.addedTags.push(cloneDeep(tag));
	// 								column.tags.push(tag);
	// 							}
	// 						}
	// 					});

	// 					const newCell = {
	// 						...cell,
	// 						tagIds,
	// 					};

	// 					this.updatedCells.previous.push(cloneDeep(cell));
	// 					this.updatedCells.next.push(newCell);
	// 					return newCell;
	// 				}
	// 			}
	// 			return cell;
	// 		});
	// 		return {
	// 			...row,
	// 			cells: nextCells,
	// 		};
	// 	});
	// }

	// private toMultiTag(column: Column, prevRows: Row[]): Row[] {
	// 	return prevRows.map((row) => {
	// 		const { cells } = row;
	// 		const nextCells: Cell[] = cells.map((cell) => {
	// 			const { columnId, content } = cell;
	// 			if (columnId === this.targetColumnId) {
	// 				if (content !== "") {
	// 					const tagIds: string[] = [];
	// 					content.split(",").forEach((tagContent) => {
	// 						const column = columns.find(
	// 							(column) => column.id === this.id
	// 						);
	// 						if (!column)
	// 							throw new ColumnNotFoundError({ id: this.id });

	// 						const existingTag = column.tags.find(
	// 							(tag) => tag.content === tagContent
	// 						);

	// 						if (existingTag) {
	// 							tagIds.push(existingTag.id);
	// 						} else {
	// 							const tag = createTag(tagContent);
	// 							this.addedTags.push(cloneDeep(tag));
	// 							column.tags.push(tag);
	// 							tagIds.push(tag.id);
	// 						}
	// 					});

	// 					const newCell = {
	// 						...cell,
	// 						tagIds,
	// 					};

	// 					this.updatedCells.previous.push(cloneDeep(cell));
	// 					this.updatedCells.next.push(newCell);
	// 					return newCell;
	// 				}
	// 			}
	// 			return cell;
	// 		});
	// 		return {
	// 			...row,
	// 			cells: nextCells,
	// 		};
	// 	});
	// }

	// private fromMultiTagToTag(rows: Row[]): Row[] {
	// 	return rows.map((row) => {
	// 		const { cells } = row;
	// 		const nextCells: Cell[] = cells.map((cell) => {
	// 			const { columnId, tagIds } = cell as MultiTagCell;
	// 			if (columnId === this.targetColumnId) {
	// 				//Make sure that the cell only has 1 tag id reference
	// 				if (tagIds.length > 0) {
	// 					const newCell: TagCell = {
	// 						...cell,
	// 						tagId: tagIds[0],
	// 					};
	// 					this.updatedCells.previous.push(cloneDeep(cell));
	// 					this.updatedCells.next.push(newCell);
	// 					return newCell;
	// 				}
	// 			}
	// 			return cell;
	// 		});
	// 		return {
	// 			...row,
	// 			cells: nextCells,
	// 		};
	// 	});
	// }

	// private toCheckbox(column: Column, rows: Row[]): Row[] {
	// 	return rows.map((row) => {
	// 		const { cells } = row;
	// 		const nextCells: Cell[] = cells.map((cell) => {
	// 			const { columnId } = cell;
	// 			if (columnId === this.targetColumnId) {
	// 				const { type } = column;

	// 				let newCell: CheckboxCell;
	// 				if (type === CellType.TEXT) {
	// 					const { content } = cell as TextCell;
	// 					newCell = {
	// 						...cell,
	// 						value: content === "true" ? true : false,
	// 					};
	// 				} else {
	// 					newCell = {
	// 						...cell,
	// 						value: false,
	// 					};
	// 				}
	// 				this.updatedCells.previous.push(cloneDeep(cell));
	// 				this.updatedCells.next.push(newCell);
	// 				return newCell;
	// 			}
	// 			return cell;
	// 		});
	// 		return {
	// 			...row,
	// 			cells: nextCells,
	// 		};
	// 	});
	// }
}
