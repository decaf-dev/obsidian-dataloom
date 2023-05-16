import { createTag } from "src/data/table-state-factory";
import { unixTimeToDateString } from "../date/date-conversion";
import { CHECKBOX_MARKDOWN_UNCHECKED } from "../table-state/constants";
import { isCellTypeFilterable } from "../table-state/filter-by-rules";
import { ColumnIdError } from "../table-state/table-error";
import TableStateCommand from "../table-state/table-state-command";
import {
	BodyCell,
	CellType,
	FilterRule,
	TableState,
	Tag,
} from "../table-state/types";
import { FilterType } from "../table-state/types";

export class ColumnTypeUpdateCommand extends TableStateCommand {
	columnId: string;
	newType: CellType;

	previousType: CellType;
	deletedFilterRules: { arrIndex: number; rule: FilterRule }[] = [];
	changedBodyCells: BodyCell[] = [];
	changedTags: Tag[] = [];
	addedTags: Tag[] = [];

	constructor(id: string, type: CellType) {
		super();
		this.columnId = id;
		this.newType = type;
	}

	execute(prevState: TableState): TableState {
		super.onExecute();

		const { columns, tags, bodyCells, filterRules } = prevState.model;
		const column = columns.find((column) => column.id === this.columnId);
		if (!column) throw new ColumnIdError(this.columnId);

		this.previousType = column.type;
		if (this.previousType === this.newType) return prevState;

		const columnCells = bodyCells.filter(
			(cell) => cell.columnId === this.columnId
		);

		let updatedTags = structuredClone(tags);
		let updatedBodyCells = [...bodyCells];

		if (
			(this.previousType === CellType.MULTI_TAG &&
				this.newType !== CellType.TAG) ||
			(this.previousType === CellType.TAG &&
				this.newType !== CellType.MULTI_TAG)
		) {
			//Remove tag references to cells but don't delete the tags
			updatedTags = updatedTags.map((tag) => {
				if (tag.cellIds.length !== 0) {
					this.changedTags.push(structuredClone(tag));
					return {
						...tag,
						cellIds: [],
					};
				}
				return tag;
			});
		} else if (
			this.previousType !== CellType.MULTI_TAG &&
			this.newType === CellType.TAG
		) {
			columnCells.forEach((cell) => {
				if (cell.markdown === "") return;
				cell.markdown.split(",").map((markdown, i) => {
					const found = tags.find(
						(tag) =>
							tag.markdown === markdown &&
							tag.columnId === this.columnId
					);
					if (found) {
						//We found a previous tag that matches this markdown
						const index = tags.indexOf(found);
						updatedTags[index] = {
							...found,
							cellIds: [...updatedTags[index].cellIds, cell.id],
						};
						this.changedTags.push(structuredClone(found));
					} else {
						//Create a tag and attach it to the cell if it's the first tag
						if (i === 0) {
							const tag = createTag(this.columnId, markdown, {
								cellId: cell.id,
							});
							this.addedTags.push(structuredClone(tag));
							updatedTags.push(tag);
							//Otherwise just create the tag
						} else {
							const tag = createTag(this.columnId, markdown);
							this.addedTags.push(structuredClone(tag));
							updatedTags.push(tag);
						}
					}
				});
			});
		} else if (
			this.previousType !== CellType.TAG &&
			this.newType === CellType.MULTI_TAG
		) {
			columnCells.forEach((cell) => {
				if (cell.markdown === "") return;
				cell.markdown.split(",").map((markdown) => {
					//We found a previous tag that matches this markdown
					const found = tags.find(
						(tag) =>
							tag.markdown === markdown &&
							tag.columnId === this.columnId
					);
					if (found) {
						//We found a previous tag that matches this markdown
						const index = tags.indexOf(found);
						updatedTags[index] = {
							...found,
							cellIds: [...found.cellIds, cell.id],
						};
						this.changedTags.push(structuredClone(found));
					} else {
						const tag = createTag(this.columnId, markdown, {
							cellId: cell.id,
						});
						this.addedTags.push(structuredClone(tag));
						updatedTags.push(tag);
					}
				});
			});
		} else if (
			this.previousType === CellType.MULTI_TAG &&
			this.newType === CellType.TAG
		) {
			const cellIds: Set<string> = new Set();
			updatedTags = tags.map((tag) => {
				//We want to make sure that every cell id is only referenced once
				const filteredIds = tag.cellIds.filter(
					(id) => !cellIds.has(id)
				);
				for (const id of tag.cellIds) cellIds.add(id);

				if (filteredIds.length < tag.cellIds.length) {
					this.changedTags.push(structuredClone(tag));
					return {
						...tag,
						cellIds: filteredIds,
					};
				}
				return tag;
			});
		} else if (this.newType === CellType.CHECKBOX) {
			columnCells.forEach((cell) => {
				if (cell.markdown === "") {
					const index = updatedBodyCells.indexOf(cell);
					updatedBodyCells[index].markdown =
						CHECKBOX_MARKDOWN_UNCHECKED;
					this.changedBodyCells.push(structuredClone(cell));
				}
			});
		} else if (
			this.previousType == CellType.DATE &&
			this.newType === CellType.TEXT
		) {
			columnCells.forEach((cell) => {
				const { dateTime } = cell;
				if (dateTime !== null) {
					const index = updatedBodyCells.indexOf(cell);
					updatedBodyCells[index].markdown = unixTimeToDateString(
						dateTime,
						column.dateFormat
					);
					this.changedBodyCells.push(structuredClone(cell));
				}
			});
		}

		const shouldFilterRule = (rule: FilterRule) =>
			rule.columnId !== this.columnId;

		const filterRulesToDelete = filterRules.filter(
			(rule) => !shouldFilterRule(rule)
		);
		this.deletedFilterRules = filterRulesToDelete.map((rule) => ({
			arrIndex: filterRules.indexOf(rule),
			rule: structuredClone(rule),
		}));

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: columns.map((column) => {
					if (column.id === this.columnId) {
						return {
							...column,
							type: this.newType,
						};
					}
					return column;
				}),
				bodyCells: updatedBodyCells,
				tags: updatedTags,
				filterRules: filterRules.filter(shouldFilterRule),
			},
		};
	}

	redo(prevState: TableState): TableState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: TableState): TableState {
		super.onUndo();

		const { columns, tags, bodyCells, filterRules } = prevState.model;

		const updatedBodyCells = bodyCells.map((cell) => {
			const previousCell = this.changedBodyCells.find(
				(c) => c.id === cell.id
			);
			if (previousCell) return previousCell;
			return cell;
		});

		const updatedTags = tags
			.filter(
				(tag) =>
					this.addedTags.find((t) => t.id === tag.id) === undefined
			)
			.map((tag) => {
				const previousTag = this.changedTags.find(
					(t) => t.id === tag.id
				);
				if (previousTag) return structuredClone(previousTag);
				return tag;
			});

		const updatedFilterRules = [...filterRules];
		this.deletedFilterRules.forEach((rule) => {
			updatedFilterRules.splice(rule.arrIndex, 0, rule.rule);
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: columns.map((column) => {
					if (column.id === this.columnId) {
						return {
							...column,
							type: this.previousType,
						};
					}
					return column;
				}),
				bodyCells: updatedBodyCells,
				tags: updatedTags,
				filterRules: updatedFilterRules,
			},
		};
	}
}
