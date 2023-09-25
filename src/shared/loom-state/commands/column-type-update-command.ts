import { createTag } from "src/shared/loom-state/loom-state-factory";
import { unixTimeToDateString } from "../../date/date-conversion";
import { CHECKBOX_MARKDOWN_UNCHECKED } from "../../constants";
import ColumNotFoundError from "src/shared/error/column-not-found-error";
import LoomStateCommand from "./loom-state-command";
import {
	GeneralCalculation,
	CellType,
	Column,
	Filter,
	LoomState,
	Tag,
	Row,
	Cell,
	CalculationType,
} from "../types/loom-state";
import { isCheckbox, isNumberCalcuation } from "../../match";

export class ColumnTypeUpdateCommand extends LoomStateCommand {
	private id: string;
	private nextType: CellType;

	private previousType: CellType;
	private deletedFilters: { arrIndex: number; filter: Filter }[] = [];

	private previousCalculationType: CalculationType;
	private nextCalculationType?: CalculationType;

	private updatedCells: {
		previous: Cell[];
		next: Cell[];
	} = {
		previous: [],
		next: [],
	};

	private addedTags: Tag[] = [];

	constructor(id: string, type: CellType) {
		super();
		this.id = id;
		this.nextType = type;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { columns, rows, filters } = prevState.model;
		const column = columns.find((column) => column.id === this.id);
		if (!column) throw new ColumNotFoundError(this.id);

		const { type } = column;
		if (type === this.nextType) return prevState;
		this.previousType = column.type;

		let nextColumns: Column[] = structuredClone(columns);
		let nextRows: Row[] = structuredClone(rows);

		if (
			(this.previousType === CellType.MULTI_TAG &&
				this.nextType !== CellType.TAG) ||
			(this.previousType === CellType.TAG &&
				this.nextType !== CellType.MULTI_TAG)
		) {
			nextRows = this.fromTagOrMultiTag(nextRows);
		} else if (
			this.previousType !== CellType.MULTI_TAG &&
			this.nextType === CellType.TAG
		) {
			nextRows = this.toTag(nextColumns, nextRows);
		} else if (
			this.previousType !== CellType.TAG &&
			this.nextType === CellType.MULTI_TAG
		) {
			nextRows = this.toMultiTag(nextColumns, nextRows);
		} else if (
			this.previousType === CellType.MULTI_TAG &&
			this.nextType === CellType.TAG
		) {
			nextRows = this.fromMultiTagToTag(nextRows);
		} else if (this.nextType === CellType.CHECKBOX) {
			nextRows = this.toCheckbox(nextRows);
		} else if (
			this.previousType === CellType.DATE &&
			this.nextType === CellType.TEXT
		) {
			nextRows = this.fromDateToText(column, nextRows);
		}

		if (this.previousType === CellType.NUMBER) {
			nextColumns = this.fromNumber(nextColumns);
		}

		nextColumns = nextColumns.map((column) => {
			if (column.id === this.id) {
				return {
					...column,
					type: this.nextType,
				};
			}
			return column;
		});

		const nextFilters: Filter[] = filters.filter((filter) => {
			if (filter.columnId === this.id) {
				this.deletedFilters.push({
					arrIndex: filters.indexOf(filter),
					filter: structuredClone(filter),
				});
				return false;
			}
			return true;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				rows: nextRows,
				filters: nextFilters,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { columns, rows, filters } = prevState.model;

		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells = cells.map((cell) => {
				const nextCell = this.updatedCells.previous.find(
					(c) => c.id === cell.id
				);
				if (nextCell) return nextCell;
				return cell;
			});
			return {
				...row,
				cells: nextCells,
			};
		});

		const nextFilters: Filter[] = structuredClone(filters);
		this.deletedFilters.forEach((f) => {
			const { arrIndex, filter } = f;
			nextFilters.splice(arrIndex, 0, filter);
		});

		const nextColumns: Column[] = columns.map((column) => {
			if (column.id === this.id) {
				return {
					...column,
					calculationType: this.previousCalculationType
						? this.previousCalculationType
						: column.calculationType,
					type: this.previousType,
					tags: column.tags.filter(
						(t) =>
							this.addedTags.find(
								(added) => added.id === t.id
							) === undefined
					),
				};
			}
			return column;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				rows: nextRows,
				filters: nextFilters,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		const { columns, rows, filters } = prevState.model;

		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells = cells.map((cell) => {
				const nextCell = this.updatedCells.next.find(
					(c) => c.id === cell.id
				);
				if (nextCell) return nextCell;
				return cell;
			});
			return {
				...row,
				cells: nextCells,
			};
		});

		const nextColumns: Column[] = columns.map((column) => {
			if (column.id === this.id) {
				return {
					...column,
					type: this.nextType,
					calculationType: this.nextCalculationType
						? this.nextCalculationType
						: column.calculationType,
					tags: [...column.tags, ...this.addedTags],
				};
			}
			return column;
		});

		const nextFilters: Filter[] = filters.filter(
			(filter) =>
				!this.deletedFilters.find((f) => f.filter.id === filter.id)
		);

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: nextColumns,
				rows: nextRows,
				filters: nextFilters,
			},
		};
	}

	private fromNumber(prevColumns: Column[]): Column[] {
		return prevColumns.map((column) => {
			const { id, calculationType } = column;
			if (id === this.id) {
				if (isNumberCalcuation(calculationType)) {
					this.previousCalculationType = calculationType;
					this.nextCalculationType = GeneralCalculation.NONE;
					return {
						...column,
						calculationType: GeneralCalculation.NONE,
					};
				}
			}
			return column;
		});
	}

	private fromTagOrMultiTag(prevRows: Row[]): Row[] {
		return prevRows.map((row) => {
			const { cells } = row;
			const nextCells: Cell[] = cells.map((cell) => {
				if (cell.columnId === this.id) {
					if (cell.tagIds.length > 0) {
						const updatedCell: Cell = {
							...cell,
							tagIds: [],
						};
						this.updatedCells.previous.push(structuredClone(cell));
						this.updatedCells.next.push(updatedCell);
						return updatedCell;
					}
				}
				return cell;
			});
			return {
				...row,
				cells: nextCells,
			};
		});
	}

	private fromDateToText(column: Column, prevRows: Row[]): Row[] {
		return prevRows.map((row) => {
			const { cells } = row;

			const nextCells: Cell[] = cells.map((cell) => {
				const { dateTime } = cell;

				if (cell.columnId === column.id) {
					if (dateTime !== null) {
						const dateString = unixTimeToDateString(
							dateTime,
							column.dateFormat
						);
						const newCell = {
							...cell,
							content: dateString,
						};
						this.updatedCells.previous.push(structuredClone(cell));
						this.updatedCells.next.push(newCell);
						return newCell;
					}
				}
				return cell;
			});
			return {
				...row,
				cells: nextCells,
			};
		});
	}

	private toTag(columns: Column[], prevRows: Row[]): Row[] {
		return prevRows.map((row) => {
			const { cells } = row;
			const nextCells: Cell[] = cells.map((cell) => {
				const { columnId, content } = cell;
				if (columnId === this.id) {
					if (content !== "") {
						const tagIds: string[] = [];

						content.split(",").forEach((tagContent) => {
							const column = columns.find(
								(column) => column.id === this.id
							);
							if (!column) throw new ColumNotFoundError(this.id);

							const existingTag = column.tags.find(
								(tag) => tag.content === tagContent
							);

							if (tagIds.length === 0) {
								if (existingTag) {
									tagIds.push(existingTag.id);
								} else {
									const tag = createTag(tagContent);
									this.addedTags.push(structuredClone(tag));
									column.tags.push(tag);
									tagIds.push(tag.id);
								}
							} else {
								//Create a tag but don't attach it to the cell
								if (!existingTag) {
									const tag = createTag(tagContent);
									this.addedTags.push(structuredClone(tag));
									column.tags.push(tag);
								}
							}
						});

						const newCell = {
							...cell,
							tagIds,
						};

						this.updatedCells.previous.push(structuredClone(cell));
						this.updatedCells.next.push(newCell);
						return newCell;
					}
				}
				return cell;
			});
			return {
				...row,
				cells: nextCells,
			};
		});
	}

	private toMultiTag(columns: Column[], prevRows: Row[]): Row[] {
		return prevRows.map((row) => {
			const { cells } = row;
			const nextCells: Cell[] = cells.map((cell) => {
				const { columnId, content } = cell;
				if (columnId === this.id) {
					if (content !== "") {
						const tagIds: string[] = [];
						content.split(",").forEach((tagContent) => {
							const column = columns.find(
								(column) => column.id === this.id
							);
							if (!column) throw new ColumNotFoundError(this.id);

							const existingTag = column.tags.find(
								(tag) => tag.content === tagContent
							);

							if (existingTag) {
								tagIds.push(existingTag.id);
							} else {
								const tag = createTag(tagContent);
								this.addedTags.push(structuredClone(tag));
								column.tags.push(tag);
								tagIds.push(tag.id);
							}
						});

						const newCell = {
							...cell,
							tagIds,
						};

						this.updatedCells.previous.push(structuredClone(cell));
						this.updatedCells.next.push(newCell);
						return newCell;
					}
				}
				return cell;
			});
			return {
				...row,
				cells: nextCells,
			};
		});
	}

	private fromMultiTagToTag(prevRows: Row[]): Row[] {
		return prevRows.map((row) => {
			const { cells } = row;
			const nextCells: Cell[] = cells.map((cell) => {
				const { columnId, tagIds } = cell;
				if (columnId === this.id) {
					//Make sure that the cell only has 1 tag id reference
					if (tagIds.length > 0) {
						const newCell = {
							...cell,
							tagIds: [tagIds[0]],
						};
						this.updatedCells.previous.push(structuredClone(cell));
						this.updatedCells.next.push(newCell);
						return newCell;
					}
				}
				return cell;
			});
			return {
				...row,
				cells: nextCells,
			};
		});
	}

	private toCheckbox(prevRows: Row[]): Row[] {
		return prevRows.map((row) => {
			const { cells } = row;
			const nextCells: Cell[] = cells.map((cell) => {
				const { columnId, content } = cell;
				if (columnId === this.id) {
					if (!isCheckbox(content)) {
						const newCell = {
							...cell,
							content: CHECKBOX_MARKDOWN_UNCHECKED,
						};
						this.updatedCells.previous.push(structuredClone(cell));
						this.updatedCells.next.push(newCell);
						return newCell;
					}
				}
				return cell;
			});
			return {
				...row,
				cells: nextCells,
			};
		});
	}
}
