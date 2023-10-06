import { App } from "obsidian";
import { createCell, createTag } from "./loom-state-factory";
import { Cell, CellType, Column, Tag } from "./types/loom-state";

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
				content: String(frontmatter),
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
		let cellTagIds: string[] = [];

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
