import {
	createCellForType,
	createCheckboxCell,
	createDateCell,
	createEmbedCell,
	createFileCell,
	createMultiTagCell,
	createNumberCell,
	createTag,
	createTagCell,
	createTextCell,
} from "src/shared/loom-state/loom-state-factory";
import ColumnNotFoundError from "src/shared/error/column-not-found-error";
import LoomStateCommand from "./loom-state-command";
import {
	CellType,
	CheckboxCell,
	Column,
	DateCell,
	EmbedCell,
	FileCell,
	Filter,
	LoomState,
	MultiTagCell,
	NumberCell,
	Tag,
	TagCell,
	TextCell,
} from "../types/loom-state";
import { dateTimeToDateString } from "src/shared/date/date-time-conversion";
import { isNumber } from "src/shared/match";
import { parseDateTime } from "src/shared/date/date-validation";
import { cloneDeep } from "lodash";
import { filterUniqueStrings } from "src/react/loom-app/text-cell-edit/utils";

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

		const columnsCopy = cloneDeep(columns);
		const column = columnsCopy.find(
			(column) => column.id === this.targetColumnId
		);
		if (!column) throw new ColumnNotFoundError({ id: this.targetColumnId });

		const { type: previousType } = column;
		if (previousType === this.nextType) return prevState;

		const nextRows = rows.map((row) => {
			const { cells } = row;
			const nextCells = cells.map((cell) => {
				const { columnId } = cell;
				if (columnId === this.targetColumnId) {
					if (this.nextType === CellType.TEXT) {
						if (previousType === CellType.CHECKBOX) {
							return this.fromCheckboxToText(
								cell as CheckboxCell
							);
						} else if (previousType === CellType.DATE) {
							return this.fromDateToText(
								column,
								cell as DateCell
							);
						} else if (previousType === CellType.NUMBER) {
							return this.fromNumberToText(cell as NumberCell);
						} else if (previousType === CellType.TAG) {
							return this.fromTagToText(
								column.tags,
								cell as TagCell
							);
						} else if (previousType === CellType.MULTI_TAG) {
							return this.fromMultiTagToText(
								column.tags,
								cell as MultiTagCell
							);
						} else if (previousType === CellType.FILE) {
							return this.fromFileToText(cell as FileCell);
						} else if (previousType === CellType.EMBED) {
							return this.fromEmbedToText(cell as EmbedCell);
						}
					} else if (this.nextType === CellType.CHECKBOX) {
						if (previousType === CellType.TEXT) {
							return this.fromTextToCheckbox(cell as TextCell);
						}
					} else if (this.nextType === CellType.DATE) {
						if (previousType === CellType.TEXT) {
							return this.fromTextToDate(cell as TextCell);
						}
					} else if (this.nextType === CellType.NUMBER) {
						if (previousType === CellType.TEXT) {
							return this.fromTextToNumber(cell as TextCell);
						}
					} else if (this.nextType === CellType.TAG) {
						if (previousType === CellType.TEXT) {
							return this.fromTextToTag(column, cell as TextCell);
						} else if (previousType === CellType.MULTI_TAG) {
							return this.fromMultiTagToTag(cell as MultiTagCell);
						}
					} else if (this.nextType === CellType.MULTI_TAG) {
						if (previousType === CellType.TEXT) {
							return this.fromTextToMultiTag(
								column,
								cell as TextCell
							);
						} else if (previousType === CellType.TAG) {
							return this.fromTagToMultiTag(cell as TagCell);
						}
					} else if (this.nextType === CellType.EMBED) {
						if (previousType === CellType.TEXT) {
							return this.fromTextToEmbed(cell as TextCell);
						}
					} else if (this.nextType === CellType.FILE) {
						if (previousType === CellType.TEXT) {
							return this.fromTextToFile(cell as TextCell);
						}
					}

					const newCell = createCellForType(columnId, this.nextType);
					return newCell;
				}
				return cell;
			});
			return {
				...row,
				cells: nextCells,
			};
		});

		const nextColumns = columnsCopy.map((column) => {
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
		this.finishExecute(prevState, nextState);
		return nextState;
	}

	private fromCheckboxToText(cell: CheckboxCell): TextCell {
		const { columnId, value } = cell;
		const content = value ? "true" : "false";
		const newCell = createTextCell(columnId, {
			content,
		});
		return newCell;
	}

	private fromNumberToText(cell: NumberCell): TextCell {
		const { columnId, value } = cell;
		const content = value?.toString() ?? "";
		const newCell = createTextCell(columnId, {
			content,
		});
		return newCell;
	}

	private fromTagToText(columnTags: Tag[], cell: TagCell): TextCell {
		const { columnId, tagId } = cell;
		const tag = columnTags.find((tag) => tag.id === tagId);
		const newCell = createTextCell(columnId, {
			content: tag?.content ?? "",
		});
		return newCell;
	}

	private fromTagToMultiTag(cell: TagCell): MultiTagCell {
		const { columnId, tagId } = cell;
		const newCell = createMultiTagCell(columnId, {
			tagIds: tagId ? [tagId] : [],
		});
		return newCell;
	}

	private fromMultiTagToText(
		columnTags: Tag[],
		cell: MultiTagCell
	): TextCell {
		const { columnId, tagIds } = cell;
		const content = tagIds
			.map((tagId) => {
				const tag = columnTags.find((tag) => tag.id === tagId);
				return tag?.content ?? "";
			})
			.join(",");
		const newCell = createTextCell(columnId, {
			content,
		});
		return newCell;
	}

	private fromMultiTagToTag(cell: MultiTagCell): TagCell {
		const { columnId, tagIds } = cell;
		let tagId = null;
		if (tagIds.length > 0) {
			tagId = tagIds[0];
		}
		const newCell = createTagCell(columnId, {
			tagId,
		});
		return newCell;
	}

	private fromDateToText(column: Column, cell: DateCell): TextCell {
		const { includeTime, hour12, dateFormat, dateFormatSeparator } = column;
		const { columnId, dateTime } = cell;

		let content = "";
		if (dateTime !== null) {
			content = dateTimeToDateString(
				dateTime,
				dateFormat,
				dateFormatSeparator,
				{
					includeTime,
					hour12,
				}
			);
		}
		const newCell = createTextCell(columnId, {
			content,
		});
		return newCell;
	}

	private fromFileToText(cell: FileCell): TextCell {
		const { columnId, path } = cell;
		const newCell = createTextCell(columnId, {
			content: path,
		});
		return newCell;
	}

	private fromEmbedToText(cell: EmbedCell): TextCell {
		const { columnId, pathOrUrl } = cell;
		const newCell = createTextCell(columnId, {
			content: pathOrUrl,
		});
		return newCell;
	}

	private fromTextToCheckbox(cell: TextCell): CheckboxCell {
		const { columnId, content } = cell;
		const newCell = createCheckboxCell(columnId, {
			value: content === "true",
		});
		return newCell;
	}

	private fromTextToNumber(cell: TextCell): NumberCell {
		const { columnId, content } = cell;
		const newCell = createNumberCell(columnId, {
			value: isNumber(content) ? Number(content) : null,
		});
		return newCell;
	}

	private fromTextToDate(cell: TextCell): DateCell {
		const { columnId, content } = cell;
		const dateTime = parseDateTime(content);
		const newCell = createDateCell(columnId, {
			dateTime,
		});
		return newCell;
	}

	private fromTextToTag(column: Column, cell: TextCell): TagCell {
		const { columnId, content } = cell;
		const { tags: columnTags } = column;
		let tagId =
			columnTags.find((tag) => tag.content === content)?.id ?? null;

		if (content !== "") {
			if (!tagId) {
				const newTag = createTag(content);
				tagId = newTag.id;
				column.tags = [...columnTags, newTag];
			}
		}
		const newCell = createTagCell(columnId, {
			tagId,
		});
		return newCell;
	}

	private fromTextToMultiTag(column: Column, cell: TextCell): MultiTagCell {
		const { columnId, content } = cell;

		const newTags: Tag[] = [];

		if (content !== "") {
			const { tags: columnTags } = column;

			content.split(",").forEach((tagContent) => {
				let tag =
					columnTags.find((tag) => tag.content === tagContent) ??
					null;

				if (!tag) tag = createTag(tagContent);
				newTags.push(tag);
			});
		}

		const allTags = [...column.tags, ...newTags];
		const uniqueTags = allTags.reduce((acc, current) => {
			if (!acc.find((tag) => tag.id === current.id)) {
				acc.push(current);
			}
			return acc;
		}, [] as Tag[]);
		column.tags = uniqueTags;

		const newCell = createMultiTagCell(columnId, {
			tagIds: uniqueTags.map((tag) => tag.id),
		});
		return newCell;
	}

	private fromTextToFile(cell: TextCell): FileCell {
		//TODO validate
		const { columnId, content } = cell;
		const newCell = createFileCell(columnId, {
			path: content,
		});
		return newCell;
	}

	private fromTextToEmbed(cell: TextCell): EmbedCell {
		//TODO validate
		const { columnId, content } = cell;
		const newCell = createEmbedCell(columnId, {
			pathOrUrl: content,
		});
		return newCell;
	}
}
