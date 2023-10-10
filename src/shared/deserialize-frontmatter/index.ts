import { App } from "obsidian";
import { createCell, createTag } from "../loom-state/loom-state-factory";
import {
	Cell,
	CellType,
	Column,
	Row,
	Tag,
} from "../loom-state/types/loom-state";
import CellNotFoundError from "../error/cell-not-found-error";
import { FrontMatterType } from "src/shared/deserialize-frontmatter/types";

export const deserializeFrontmatterKeys = (
	app: App,
	columns: Column[],
	rows: Row[]
) => {
	const keys = new Map<FrontMatterType, string[]>();

	const sourceFileColumn = columns.find(
		(column) => column.type === CellType.SOURCE_FILE
	);
	if (sourceFileColumn) {
		rows.forEach((row) => {
			const { cells } = row;
			const cell = cells.find(
				(cell) => cell.columnId === sourceFileColumn.id
			);
			if (!cell)
				throw new CellNotFoundError({
					columnId: sourceFileColumn.id,
				});
			const { content } = cell;
			const frontmatter =
				app.metadataCache.getCache(content)?.frontmatter;

			if (frontmatter) {
				for (const key of Object.keys(frontmatter)) {
					const value = frontmatter[key];

					let type: FrontMatterType = "text";
					if (key === "tags") {
						type = "tags";
					} else if (Array.isArray(value)) {
						type = "list";
					} else if (typeof value === "number") {
						type = "number";
					} else if (typeof value === "boolean") {
						type = "boolean";
					} else if (!isNaN(Date.parse(value))) {
						if (value.includes("T")) {
							type = "datetime";
						} else {
							type = "date";
						}
					} else {
						type = "text";
					}

					const existingKeys = keys.get(type) ?? [];
					const newKeys = [...existingKeys, key];
					const newKeysSet = new Set(newKeys);
					keys.set(type, Array.from(newKeysSet));
				}
			}
		});
	}
	return keys;
};

export const deserializeFrontmatterForCell = (
	app: App,
	column: Column,
	path: string
): {
	nextTags: Tag[];
	newCell: Cell;
} | null => {
	const { frontmatterKey } = column;
	if (!frontmatterKey) return null;

	const frontmatter: string | string[] | null =
		app.metadataCache.getCache(path)?.frontmatter?.[frontmatterKey.value];
	if (!frontmatter) return null;

	const { id, tags, type } = column;
	if (
		type === CellType.TEXT ||
		type === CellType.FILE ||
		type === CellType.NUMBER ||
		type === CellType.EMBED ||
		type === CellType.CHECKBOX
	) {
		if (!Array.isArray(frontmatter)) {
			const newCell = createCell(id, {
				type: type,
				content: String(frontmatter), //TODO change once we allow content to be other values than just a string
			});
			return {
				nextTags: tags,
				newCell,
			};
		}
	} else if (type === CellType.DATE) {
		if (typeof frontmatter === "number") {
			const newCell = createCell(id, {
				type: type,
				dateTime: frontmatter,
			});
			return {
				newCell,
				nextTags: tags,
			};
		}
	} else if (type === CellType.TAG || type === CellType.MULTI_TAG) {
		let frontmatterContent: string[] = [];
		if (Array.isArray(frontmatter)) {
			frontmatterContent = frontmatter;
		} else {
			frontmatterContent = [frontmatter as string];
		}
		const newTags: Tag[] = [];
		const cellTagIds: string[] = [];

		frontmatterContent.forEach((tagContent) => {
			if (tagContent !== "") {
				const existingTag = tags.find(
					(tag) => tag.content === tagContent
				);
				if (existingTag) {
					cellTagIds.push(existingTag.id);
				} else {
					const newTag = createTag(tagContent);
					cellTagIds.push(newTag.id);
					newTags.push(newTag);
				}
			}
		});

		const newCell = createCell(id, {
			type,
			tagIds: cellTagIds,
		});
		const nextTags = [...column.tags, ...newTags];
		return {
			newCell,
			nextTags,
		};
	}

	//Invalid frontmatter for the cell type.
	return null;
};
