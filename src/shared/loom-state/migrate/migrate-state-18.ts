import MigrateState from "./migrate-state";
import { LoomState17 } from "../types/loom-state-17";
import { LoomState } from "../types";
import ColumnNotFoundError from "src/shared/error/column-not-found-error";
import {
	CellType,
	CheckboxCell,
	CreationTimeCell,
	DateCell,
	EmbedCell,
	FileCell,
	Filter,
	LastEditedTimeCell,
	MultiTagCell,
	NumberCell,
	SourceCell,
	SourceFileCell,
	TagCell,
	TextCell,
} from "../types/loom-state";
import { isUrlLink } from "src/shared/link/check-link";
import { extractObsidianLinkComponents } from "src/shared/link/obsidian-link";

/**
 * Migrates to 8.13.0
 */
export default class MigrateState18 implements MigrateState {
	public migrate(prevState: LoomState17): LoomState {
		const { rows, columns, filters } = prevState.model;
		const nextRows = rows.map((row) => {
			const { cells } = row;
			const nextCells = cells.map((cell) => {
				const { content, id, columnId, isExternalLink, tagIds } = cell;
				const column = columns.find((column) => column.id === columnId);
				if (!column) {
					throw new ColumnNotFoundError({ id: columnId });
				}

				const { type } = column;

				if (type === CellType.TEXT) {
					const newCell: TextCell = {
						id,
						columnId,
						content,
					};
					return newCell;
				} else if (type === CellType.NUMBER) {
					const newCell: NumberCell = {
						id,
						columnId,
						value: Number(content),
					};
					return newCell;
				} else if (type === CellType.DATE) {
					const newCell: DateCell = {
						id,
						columnId,
						dateTime: content,
					};
					return newCell;
				} else if (type === CellType.CHECKBOX) {
					const value = isCheckboxChecked(content) ? true : false;

					const newCell: CheckboxCell = {
						id,
						columnId,
						value,
					};
					return newCell;
				} else if (type === CellType.EMBED) {
					const isUrl = isUrlLink(content);

					let pathOrUrl: string = "";
					let saveAlias: string | null = null;
					if (isUrl) {
						pathOrUrl = content;
					} else {
						const { path, alias } =
							extractObsidianLinkComponents(content);
						if (path !== null) {
							pathOrUrl = path;
							saveAlias = alias;
						}
					}
					const newCell: EmbedCell = {
						id,
						columnId,
						pathOrUrl,
						alias: saveAlias,
						isExternal: isExternalLink,
					};
					return newCell;
				} else if (type === CellType.FILE) {
					const { path, alias } =
						extractObsidianLinkComponents(content);
					const newCell: FileCell = {
						id,
						columnId,
						path: path ?? "",
						alias,
					};
					return newCell;
				} else if (type === CellType.TAG) {
					const newCell: TagCell = {
						id,
						columnId,
						tagId: tagIds.length > 0 ? tagIds[0] : null,
					};
					return newCell;
				} else if (type === CellType.MULTI_TAG) {
					const newCell: MultiTagCell = {
						id,
						columnId,
						tagIds,
					};
					return newCell;
				} else if (type === CellType.CREATION_TIME) {
					const newCell: CreationTimeCell = {
						id,
						columnId,
					};
					return newCell;
				} else if (type === CellType.LAST_EDITED_TIME) {
					const newCell: LastEditedTimeCell = {
						id,
						columnId,
					};
					return newCell;
				} else if (type === CellType.SOURCE) {
					const newCell: SourceCell = {
						id,
						columnId,
					};
					return newCell;
				} else if (type === CellType.SOURCE_FILE) {
					const { path } = extractObsidianLinkComponents(content);
					const newCell: SourceFileCell = {
						id,
						columnId,
						path: path ?? "",
					};
					return newCell;
				} else {
					throw new Error("Unhandled cell type");
				}
			});

			return {
				...row,
				cells: nextCells,
			};
		});

		const nextFilters: Filter[] = filters.map((filter) => {
			const { type } = filter;
			if (type === CellType.CHECKBOX) {
				const { text } = filter;
				return {
					...filter,
					value: isCheckboxChecked(text) ? true : false,
				};
			}
			return filter;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: nextRows,
				filters: nextFilters,
			},
		};
	}
}

/**
 * Matches a checked markdown checkbox
 * @example
 * [x]
 */
const CHECKBOX_CHECKED_REGEX = new RegExp(/^\[[x]\]$/);

const isCheckboxChecked = (value: string): boolean => {
	return value.match(CHECKBOX_CHECKED_REGEX) !== null;
};
