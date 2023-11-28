import { App } from "obsidian";
import {
	createCheckboxCell,
	createDateCell,
	createEmbedCell,
	createFileCell,
	createMultiTagCell,
	createNumberCell,
	createTag,
	createTagCell,
	createTextCell,
} from "../loom-state/loom-state-factory";
import { Cell, CellType, Column, Tag } from "../loom-state/types/loom-state";
import { getAssignedPropertyType } from "./obsidian-utils";
import { ObsidianPropertyType } from "./types";
import { isExternalLink, isUrlLink } from "../link-and-path/link-predicates";
import { extractWikiLinkComponents } from "../link-and-path/markdown-link-utils";

export const deserializeFrontmatterForCell = (
	app: App,
	column: Column,
	path: string
): {
	includeTime?: boolean;
	nextTags?: Tag[];
	newCell: Cell;
} | null => {
	const { frontmatterKey } = column;
	if (!frontmatterKey) return null;

	const fileMetadata = app.metadataCache.getCache(path);
	if (!fileMetadata) return null;

	const frontmatter = fileMetadata.frontmatter;
	if (!frontmatter) return null;

	const frontmatterValue: string | number | boolean | string[] | undefined =
		frontmatter[frontmatterKey];
	if (!frontmatterValue) return null;

	const assignedType =
		getAssignedPropertyType(app, frontmatterKey) ??
		ObsidianPropertyType.TEXT;

	const { id, tags, type } = column;

	switch (type) {
		case CellType.TEXT: {
			if (typeof frontmatterValue !== "string")
				throw new Error(
					"Failed to load content for CellType.TEXT. Frontmatter value is not a string"
				);
			const newCell = createTextCell(id, {
				content: frontmatterValue,
			});
			return {
				newCell,
			};
		}
		case CellType.EMBED: {
			if (typeof frontmatterValue !== "string")
				throw new Error(
					"Failed to load content for CellType.EMBED. Frontmatter value is not a string"
				);

			const isExternal = isExternalLink(frontmatterValue);
			let pathOrUrl = "";
			let pathAlias: string | null = null;

			if (isUrlLink(frontmatterValue)) {
				pathOrUrl = frontmatterValue;
			} else {
				const { path, alias } =
					extractWikiLinkComponents(frontmatterValue);
				if (path !== null) {
					pathOrUrl = path;
					pathAlias = alias;
				}
			}
			const newCell = createEmbedCell(id, {
				isExternal,
				pathOrUrl,
				alias: pathAlias,
			});
			return {
				newCell,
			};
		}
		case CellType.FILE: {
			if (typeof frontmatterValue !== "string")
				throw new Error(
					"Failed to load content for CellType.FILE. Frontmatter value is not a string"
				);

			const { path, alias } = extractWikiLinkComponents(frontmatterValue);
			const newCell = createFileCell(id, {
				path: path ?? "",
				alias: alias ?? "",
			});
			return {
				newCell,
			};
		}
		case CellType.NUMBER: {
			if (typeof frontmatterValue !== "number")
				throw new Error(
					"Failed to load content for CellType.NUMBER. Frontmatter value is not a number"
				);

			const newCell = createNumberCell(id, {
				value: frontmatterValue,
			});
			return {
				newCell,
			};
		}
		case CellType.CHECKBOX: {
			if (typeof frontmatterValue !== "boolean")
				throw new Error(
					"Failed to load content for CellType.CHECKBOX. Frontmatter value is not a boolean"
				);

			const newCell = createCheckboxCell(id, {
				value: frontmatterValue,
			});
			return {
				newCell,
			};
		}
		case CellType.DATE: {
			if (typeof frontmatterValue !== "string")
				throw new Error(
					"Failed to load content for CellType.DATE. Frontmatter value is not a string"
				);

			//The formatterValue will return either YYYY-MM-DD or YYYY-MM-DDTHH:MM
			//the date object will take this in as local time as output an ISO string
			const dateString = frontmatterValue;
			const newCell = createDateCell(id, {
				dateTime: new Date(dateString).toISOString(),
			});
			const includeTime = assignedType === ObsidianPropertyType.DATETIME;

			return {
				newCell,
				includeTime,
			};
		}
		case CellType.TAG: {
			if (typeof frontmatterValue !== "string")
				throw new Error(
					"Failed to load content for CellType.TAG. Frontmatter value is not a string"
				);

			let newTag: Tag | null = null;
			let cellTagId: string | null = null;
			if (frontmatterValue !== "") {
				const existingTag = tags.find(
					(tag) => tag.content === frontmatterValue
				);
				if (existingTag) {
					cellTagId = existingTag.id;
				} else {
					const tag = createTag(frontmatterValue);
					cellTagId = tag.id;
					newTag = tag;
				}
			}
			const newCell = createTagCell(id, {
				tagId: cellTagId,
			});
			const nextTags = [...column.tags, ...(newTag ? [newTag] : [])];
			return {
				newCell,
				nextTags,
			};
		}
		case CellType.MULTI_TAG: {
			if (typeof frontmatterValue !== "object")
				throw new Error(
					"Failed to load content for CellType.MULTI_TAG. Frontmatter value is not an object"
				);

			const newTags: Tag[] = [];
			const cellTagIds: string[] = [];

			frontmatterValue.forEach((tagContent) => {
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

			const newCell = createMultiTagCell(id, {
				tagIds: cellTagIds,
			});
			const nextTags = [...column.tags, ...newTags];
			return {
				newCell,
				nextTags,
			};
		}
		default:
			return null;
	}
};
