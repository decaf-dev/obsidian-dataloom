import { createTag } from "src/data/table-state-factory";
import { unixTimeToDateString } from "../date/date-conversion";
import { CHECKBOX_MARKDOWN_UNCHECKED } from "../table-state/constants";
import { ColumnIdError } from "../table-state/table-error";
import TableStateCommand from "../table-state/table-state-command";
import {
	BodyCell,
	CellType,
	Column,
	FilterRule,
	TableState,
	Tag,
} from "../table-state/types";
import { isCheckbox } from "../validators";

export class ColumnTypeUpdateCommand extends TableStateCommand {
	private columnId: string;
	private type: CellType;

	private previousType: CellType;
	private deletedFilterRules: { arrIndex: number; rule: FilterRule }[] = [];

	private updatedBodyCells: {
		current: BodyCell[];
		previous: BodyCell[];
	} = {
		current: [],
		previous: [],
	};
	private updatedTags: {
		current: Tag[];
		previous: Tag[];
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

	private fromTagOrMultiTag(tags: Tag[]) {
		return tags.map((tag) => {
			if (tag.columnId == this.columnId) {
				if (tag.cellIds.length !== 0) {
					//Remove any cell id references to the tag
					const updatedTag = { ...tag, cellIds: [] };
					this.updatedTags.previous.push(structuredClone(tag));
					this.updatedTags.current.push(structuredClone(updatedTag));
					return updatedTag;
				}
			}
			return tag;
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
					const updatedCell = { ...cell, markdown: dateString };
					this.updatedBodyCells.previous.push(structuredClone(cell));
					this.updatedBodyCells.current.push(
						structuredClone(updatedCell)
					);
					return updatedCell;
				}
			}
			return cell;
		});
	}

	private toTag(bodyCells: BodyCell[], tags: Tag[]) {
		bodyCells.forEach((cell) => {
			if (cell.columnId !== this.columnId) return;
			if (cell.markdown === "") return;

			cell.markdown.split(",").map((markdown, i) => {
				const existingTag = tags.find(
					(tag) =>
						tag.markdown === markdown &&
						tag.columnId === this.columnId
				);
				if (existingTag) {
					const index = tags.indexOf(existingTag);
					const updatedTag = {
						...existingTag,
						cellIds: [...existingTag.cellIds, cell.id],
					};
					this.updatedTags.previous.push(
						structuredClone(existingTag)
					);
					this.updatedTags.current.push(structuredClone(updatedTag));
					tags[index] = updatedTag;
				} else {
					//Create a tag and attach it to the cell if it's the first tag
					if (i === 0) {
						const tag = createTag(this.columnId, markdown, {
							cellId: cell.id,
						});
						this.addedTags.push(structuredClone(tag));
						tags.push(tag);
						//Otherwise just create the tag
					} else {
						const tag = createTag(this.columnId, markdown);
						this.addedTags.push(structuredClone(tag));
						tags.push(tag);
					}
				}
			});
		});
	}

	private toMultiTag(bodyCells: BodyCell[], tags: Tag[]) {
		bodyCells.forEach((cell) => {
			if (cell.columnId !== this.columnId) return;
			//If the cell is empty, we don't need to do anything
			if (cell.markdown === "") return;

			//Split the markdown into an array of tags
			cell.markdown.split(",").map((markdown) => {
				const existingTag = tags.find(
					(tag) =>
						tag.markdown === markdown &&
						tag.columnId === this.columnId
				);

				if (existingTag) {
					const index = tags.indexOf(existingTag);
					const updatedTag = {
						...existingTag,
						cellIds: [...existingTag.cellIds, cell.id],
					};
					this.updatedTags.previous.push(
						structuredClone(existingTag)
					);
					this.updatedTags.current.push(structuredClone(updatedTag));
					tags[index] = updatedTag;
				} else {
					const newTag = createTag(this.columnId, markdown, {
						cellId: cell.id,
					});
					this.addedTags.push(structuredClone(newTag));
					tags.push(newTag);
				}
			});
		});
	}

	private fromMultiTagToTag(tags: Tag[]) {
		const cellIds: Set<string> = new Set();

		//We want to make sure that every cell id is only referenced once in a tag
		return tags.map((tag) => {
			if (tag.columnId == this.columnId) {
				const filteredIds = tag.cellIds.filter(
					(id) => !cellIds.has(id)
				);
				for (const id of tag.cellIds) cellIds.add(id);

				if (filteredIds.length < tag.cellIds.length) {
					const updatedTag = {
						...tag,
						cellIds: filteredIds,
					};
					this.updatedTags.previous.push(structuredClone(tag));
					this.updatedTags.current.push(structuredClone(updatedTag));
					return updatedTag;
				}
			}
			return tag;
		});
	}

	private toCheckbox(bodyCells: BodyCell[]) {
		return bodyCells.map((cell) => {
			if (cell.columnId == this.columnId) {
				if (!isCheckbox(cell.markdown)) {
					const updatedCell = {
						...cell,
						markdown: CHECKBOX_MARKDOWN_UNCHECKED,
					};
					this.updatedBodyCells.previous.push(structuredClone(cell));
					this.updatedBodyCells.current.push(
						structuredClone(updatedCell)
					);
					return updatedCell;
				}
			}
			return cell;
		});
	}

	execute(prevState: TableState): TableState {
		super.onExecute();

		const { columns, tags, bodyCells, filterRules } = prevState.model;
		const column = columns.find((column) => column.id === this.columnId);
		if (!column) throw new ColumnIdError(this.columnId);

		this.previousType = column.type;
		if (this.previousType === this.type) return prevState;

		let newTags = structuredClone(tags);
		let newBodyCells = structuredClone(bodyCells);

		if (
			(this.previousType === CellType.MULTI_TAG &&
				this.type !== CellType.TAG) ||
			(this.previousType === CellType.TAG &&
				this.type !== CellType.MULTI_TAG)
		) {
			newTags = this.fromTagOrMultiTag(newTags);
		} else if (
			this.previousType !== CellType.MULTI_TAG &&
			this.type === CellType.TAG
		) {
			this.toTag(newBodyCells, newTags);
		} else if (
			this.previousType !== CellType.TAG &&
			this.type === CellType.MULTI_TAG
		) {
			this.toMultiTag(newBodyCells, newTags);
		} else if (
			this.previousType === CellType.MULTI_TAG &&
			this.type === CellType.TAG
		) {
			newTags = this.fromMultiTagToTag(newTags);
		} else if (this.type === CellType.CHECKBOX) {
			newBodyCells = this.toCheckbox(newBodyCells);
		} else if (
			this.previousType == CellType.DATE &&
			this.type === CellType.TEXT
		) {
			newBodyCells = this.fromDateToText(column, newBodyCells);
		}

		const newColumns = columns.map((column) => {
			if (column.id === this.columnId) {
				return {
					...column,
					type: this.type,
				};
			}
			return column;
		});

		const shouldFilterRule = (rule: FilterRule) =>
			rule.columnId !== this.columnId;

		const filterRulesToDelete = filterRules.filter(
			(rule) => !shouldFilterRule(rule)
		);
		this.deletedFilterRules = filterRulesToDelete.map((rule) => ({
			arrIndex: filterRules.indexOf(rule),
			rule: structuredClone(rule),
		}));

		const newFilterRules = filterRules.filter(shouldFilterRule);

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: newColumns,
				bodyCells: newBodyCells,
				tags: newTags,
				filterRules: newFilterRules,
			},
		};
	}

	redo(prevState: TableState): TableState {
		super.onRedo();
		const { columns, tags, bodyCells, filterRules } = prevState.model;

		const newTags = [
			...tags.map(
				(tag) =>
					this.updatedTags.current.find((t) => t.id === tag.id) || tag
			),
			...this.addedTags,
		];

		const newBodyCells = bodyCells.map(
			(cell) =>
				this.updatedBodyCells.current.find((c) => c.id === cell.id) ||
				cell
		);

		const newColumns = columns.map((column) => {
			if (column.id === this.columnId) {
				return {
					...column,
					type: this.type,
				};
			}
			return column;
		});

		const newFilterRules = filterRules.filter(
			(rule) =>
				!this.deletedFilterRules.find((r) => r.rule.id === rule.id)
		);

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: newColumns,
				bodyCells: newBodyCells,
				tags: newTags,
				filterRules: newFilterRules,
			},
		};
	}

	undo(prevState: TableState): TableState {
		super.onUndo();

		const { columns, tags, bodyCells, filterRules } = prevState.model;

		const newBodyCells = bodyCells.map(
			(cell) =>
				this.updatedBodyCells.previous.find((c) => c.id === cell.id) ||
				cell
		);

		const newTags = tags
			.filter(
				(tag) =>
					this.addedTags.find((t) => t.id === tag.id) === undefined
			)
			.map(
				(tag) =>
					this.updatedTags.previous.find((t) => t.id === tag.id) ||
					tag
			);

		const newFilterRules = structuredClone(filterRules);
		this.deletedFilterRules.forEach((r) => {
			const { arrIndex, rule } = r;
			newFilterRules.splice(arrIndex, 0, rule);
		});

		const newColumns = columns.map((column) => {
			if (column.id === this.columnId) {
				return {
					...column,
					type: this.previousType,
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
				tags: newTags,
				filterRules: newFilterRules,
			},
		};
	}
}
