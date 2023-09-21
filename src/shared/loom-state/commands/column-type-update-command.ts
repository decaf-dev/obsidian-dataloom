import { createTag } from "src/shared/loom-state/loom-state-factory";
import { unixTimeToDateString } from "../../date/date-conversion";
import { CHECKBOX_MARKDOWN_UNCHECKED } from "../../constants";
import ColumNotFoundError from "src/shared/error/column-not-found-error";
import LoomStateCommand from "./loom-state-command";
import {
	BodyCell,
	GeneralCalculation,
	CalculationType,
	CellType,
	Column,
	Filter,
	LoomState,
	Tag,
} from "../types/loom-state";
import { isCheckbox, isNumberCalcuation } from "../../match";

export class ColumnTypeUpdateCommand extends LoomStateCommand {
	private columnId: string;
	private type: CellType;

	private previousType: CellType;
	private deletedFilters: { arrIndex: number; filter: Filter }[] = [];

	private previousCalculationType?: CalculationType;
	private newCalculationType?: CalculationType;

	/**
	 * The body cells whose tag ids have been updated as a result of the command execution
	 * current - the state of the body cells after the command is executed
	 * previous - the state of the body cells before the command is executed
	 */
	private updatedBodyCellTagIds: {
		current: {
			cellId: string;
			tagIds: string[];
		}[];
		previous: {
			cellId: string;
			tagIds: string[];
		}[];
	} = {
		current: [],
		previous: [],
	};

	/**
	 * The body cells whose markdown has been updated as a result of command execution
	 * current - the state of the body cells after the command is executed
	 * previous - the state of the body cells before the command is executed
	 */
	private updatedBodyCellMarkdown: {
		current: {
			cellId: string;
			markdown: string;
		}[];
		previous: {
			cellId: string;
			markdown: string;
		}[];
	} = {
		current: [],
		previous: [],
	};

	private addedTags: Tag[] = [];

	constructor(id: string, type: CellType) {
		super();
		this.columnId = id;
		this.type = type;
	}

	private fromNumber(columns: Column[]) {
		return columns.map((column) => {
			if (column.id === this.columnId) {
				if (isNumberCalcuation(column.calculationType)) {
					this.previousCalculationType = column.calculationType;
					this.newCalculationType = GeneralCalculation.NONE;
					return {
						...column,
						calculationType: GeneralCalculation.NONE,
					};
				}
			}
			return column;
		});
	}

	private fromTagOrMultiTag(bodyCells: BodyCell[]) {
		return bodyCells.map((cell) => {
			if (cell.columnId === this.columnId) {
				if (cell.tagIds.length > 0) {
					this.updatedBodyCellTagIds.previous.push({
						cellId: cell.id,
						tagIds: [...cell.tagIds],
					});
					this.updatedBodyCellTagIds.current.push({
						cellId: cell.id,
						tagIds: [],
					});
					return {
						...cell,
						tagIds: [],
					};
				}
			}
			return cell;
		});
	}

	private fromDateToText(column: Column, bodyCells: BodyCell[]) {
		return bodyCells.map((cell) => {
			const { dateTime } = cell;

			if (cell.columnId === column.id) {
				if (dateTime !== null) {
					const dateString = unixTimeToDateString(
						dateTime,
						column.dateFormat
					);
					this.updatedBodyCellMarkdown.previous.push({
						cellId: cell.id,
						markdown: cell.markdown,
					});
					this.updatedBodyCellMarkdown.current.push({
						cellId: cell.id,
						markdown: dateString,
					});
					return {
						...cell,
						markdown: dateString,
					};
				}
			}
			return cell;
		});
	}

	private toTag(columns: Column[], bodyCells: BodyCell[]) {
		const newColumns = structuredClone(columns);
		let newBodyCells = structuredClone(bodyCells);

		newBodyCells = newBodyCells.map((cell) => {
			if (cell.columnId === this.columnId) {
				if (cell.markdown !== "") {
					const tagIds: string[] = [];

					cell.markdown.split(",").forEach((markdown) => {
						const column = newColumns.find(
							(column) => column.id === this.columnId
						);
						if (!column)
							throw new ColumNotFoundError(this.columnId);

						const existingTag = column.tags.find(
							(tag) => tag.markdown === markdown
						);

						if (tagIds.length === 0) {
							if (existingTag) {
								tagIds.push(existingTag.id);
							} else {
								const tag = createTag(markdown);
								this.addedTags.push(structuredClone(tag));
								column.tags.push(tag);
								tagIds.push(tag.id);
							}
						} else {
							//Create a tag but don't attach it to the cell
							if (!existingTag) {
								const tag = createTag(markdown);
								this.addedTags.push(structuredClone(tag));
								column.tags.push(tag);
							}
						}
					});

					this.updatedBodyCellTagIds.previous.push({
						cellId: cell.id,
						tagIds: [],
					});
					this.updatedBodyCellTagIds.current.push({
						cellId: cell.id,
						tagIds,
					});

					return {
						...cell,
						tagIds,
					};
				}
			}
			return cell;
		});
		return {
			columnsResult: newColumns,
			bodyCellsResult: newBodyCells,
		};
	}

	private toMultiTag(columns: Column[], bodyCells: BodyCell[]) {
		const newColumns = structuredClone(columns);
		let newBodyCells = structuredClone(bodyCells);

		newBodyCells = newBodyCells.map((cell) => {
			if (cell.columnId === this.columnId) {
				if (cell.markdown !== "") {
					const tagIds: string[] = [];

					cell.markdown.split(",").forEach((markdown) => {
						const column = newColumns.find(
							(column) => column.id === this.columnId
						);
						if (!column)
							throw new ColumNotFoundError(this.columnId);

						const existingTag = column.tags.find(
							(tag) => tag.markdown === markdown
						);

						if (existingTag) {
							tagIds.push(existingTag.id);
						} else {
							const tag = createTag(markdown);
							this.addedTags.push(structuredClone(tag));
							column.tags.push(tag);
							tagIds.push(tag.id);
						}
					});

					this.updatedBodyCellTagIds.previous.push({
						cellId: cell.id,
						tagIds: [],
					});
					this.updatedBodyCellTagIds.current.push({
						cellId: cell.id,
						tagIds,
					});

					return {
						...cell,
						tagIds,
					};
				}
			}
			return cell;
		});
		return { columnsResult: newColumns, bodyCellsResult: newBodyCells };
	}

	private fromMultiTagToTag(bodyCells: BodyCell[]) {
		return bodyCells.map((cell) => {
			if (cell.columnId === this.columnId) {
				//Make sure that the cell only has 1 tag id reference
				if (cell.tagIds.length > 0) {
					this.updatedBodyCellTagIds.previous.push({
						cellId: cell.id,
						tagIds: [...cell.tagIds],
					});
					this.updatedBodyCellTagIds.current.push({
						cellId: cell.id,
						tagIds: [cell.tagIds[0]],
					});
					return {
						...cell,
						tagIds: [cell.tagIds[0]],
					};
				}
			}
			return cell;
		});
	}

	private toCheckbox(bodyCells: BodyCell[]) {
		return bodyCells.map((cell) => {
			if (cell.columnId === this.columnId) {
				if (!isCheckbox(cell.markdown)) {
					this.updatedBodyCellMarkdown.previous.push({
						cellId: cell.id,
						markdown: cell.markdown,
					});
					this.updatedBodyCellMarkdown.current.push({
						cellId: cell.id,
						markdown: CHECKBOX_MARKDOWN_UNCHECKED,
					});
					return {
						...cell,
						markdown: CHECKBOX_MARKDOWN_UNCHECKED,
					};
				}
			}
			return cell;
		});
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { columns, bodyCells, filters } = prevState.model;
		const column = columns.find((column) => column.id === this.columnId);
		if (!column) throw new ColumNotFoundError(this.columnId);

		this.previousType = column.type;
		if (this.previousType === this.type) return prevState;

		let newColumns = structuredClone(columns);
		let newBodyCells = structuredClone(bodyCells);

		if (
			(this.previousType === CellType.MULTI_TAG &&
				this.type !== CellType.TAG) ||
			(this.previousType === CellType.TAG &&
				this.type !== CellType.MULTI_TAG)
		) {
			newBodyCells = this.fromTagOrMultiTag(newBodyCells);
		} else if (
			this.previousType !== CellType.MULTI_TAG &&
			this.type === CellType.TAG
		) {
			const { columnsResult, bodyCellsResult } = this.toTag(
				newColumns,
				newBodyCells
			);
			newColumns = columnsResult;
			newBodyCells = bodyCellsResult;
		} else if (
			this.previousType !== CellType.TAG &&
			this.type === CellType.MULTI_TAG
		) {
			const { columnsResult, bodyCellsResult } = this.toMultiTag(
				newColumns,
				newBodyCells
			);
			newColumns = columnsResult;
			newBodyCells = bodyCellsResult;
		} else if (
			this.previousType === CellType.MULTI_TAG &&
			this.type === CellType.TAG
		) {
			newBodyCells = this.fromMultiTagToTag(newBodyCells);
		} else if (this.type === CellType.CHECKBOX) {
			newBodyCells = this.toCheckbox(newBodyCells);
		} else if (
			this.previousType === CellType.DATE &&
			this.type === CellType.TEXT
		) {
			newBodyCells = this.fromDateToText(column, newBodyCells);
		}

		if (this.previousType === CellType.NUMBER) {
			newColumns = this.fromNumber(newColumns);
		}

		newColumns = newColumns.map((column) => {
			if (column.id === this.columnId) {
				return {
					...column,
					type: this.type,
				};
			}
			return column;
		});

		const shouldFilter = (filter: Filter) =>
			filter.columnId !== this.columnId;

		const filtersToDelete = filters.filter(
			(filter) => !shouldFilter(filter)
		);
		this.deletedFilters = filtersToDelete.map((filter) => ({
			arrIndex: filters.indexOf(filter),
			filter: structuredClone(filter),
		}));

		const newFilters = filters.filter(shouldFilter);

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: newColumns,
				bodyCells: newBodyCells,
				filters: newFilters,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		const { columns, bodyCells, filters } = prevState.model;

		const newBodyCells = bodyCells.map((cell) => {
			const updatedCellTagIds = this.updatedBodyCellTagIds.current.find(
				(c) => c.cellId === cell.id
			);
			if (updatedCellTagIds) {
				return {
					...cell,
					tagIds: updatedCellTagIds.tagIds,
				};
			}
			const updatedCellMarkdown =
				this.updatedBodyCellMarkdown.current.find(
					(c) => c.cellId === cell.id
				);
			if (updatedCellMarkdown) {
				return {
					...cell,
					markdown: updatedCellMarkdown.markdown,
				};
			}
			return cell;
		});

		const newColumns = columns.map((column) => {
			if (column.id === this.columnId) {
				return {
					...column,
					type: this.type,
					calculationType: this.newCalculationType
						? this.newCalculationType
						: column.calculationType,
					tags: [...column.tags, ...this.addedTags],
				};
			}
			return column;
		});

		const newFilters = filters.filter(
			(filter) =>
				!this.deletedFilters.find((f) => f.filter.id === filter.id)
		);

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: newColumns,
				bodyCells: newBodyCells,
				filters: newFilters,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { columns, bodyCells, filters } = prevState.model;

		const newBodyCells = bodyCells.map((cell) => {
			const updatedCellTagIds = this.updatedBodyCellTagIds.previous.find(
				(c) => c.cellId === cell.id
			);
			if (updatedCellTagIds) {
				return {
					...cell,
					tagIds: updatedCellTagIds.tagIds,
				};
			}
			const updatedCellMarkdown =
				this.updatedBodyCellMarkdown.previous.find(
					(c) => c.cellId === cell.id
				);
			if (updatedCellMarkdown) {
				return {
					...cell,
					markdown: updatedCellMarkdown.markdown,
				};
			}
			return cell;
		});

		const newFilters = structuredClone(filters);
		this.deletedFilters.forEach((f) => {
			const { arrIndex, filter } = f;
			newFilters.splice(arrIndex, 0, filter);
		});

		const newColumns = columns.map((column) => {
			if (column.id === this.columnId) {
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
				columns: newColumns,
				bodyCells: newBodyCells,
				filters: newFilters,
			},
		};
	}
}
