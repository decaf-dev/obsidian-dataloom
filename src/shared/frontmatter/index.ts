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
import { isNumber } from "../match";
import { parseDateTime } from "../date/date-validation";

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
				return {
					newCell: createTextCell(id, {
						hasValidFrontmatter: false,
					}),
				};

			const newCell = createTextCell(id, {
				content: frontmatterValue,
				hasValidFrontmatter: true,
			});
			return {
				newCell,
			};
		}
		case CellType.EMBED: {
			if (typeof frontmatterValue !== "string")
				return {
					newCell: createEmbedCell(id, {
						hasValidFrontmatter: false,
					}),
				};

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
				hasValidFrontmatter: true,
			});
			return {
				newCell,
			};
		}
		case CellType.FILE: {
			if (typeof frontmatterValue !== "string")
				return {
					newCell: createFileCell(id, {
						hasValidFrontmatter: false,
					}),
				};

			const { path, alias } = extractWikiLinkComponents(frontmatterValue);
			const newCell = createFileCell(id, {
				path: path ?? "",
				alias: alias ?? "",
				hasValidFrontmatter: true,
			});
			return {
				newCell,
			};
		}
		case CellType.NUMBER: {
			if (typeof frontmatterValue !== "number")
				return {
					newCell: createNumberCell(id, {
						hasValidFrontmatter: false,
					}),
				};

			const newCell = createNumberCell(id, {
				value: frontmatterValue,
				hasValidFrontmatter: true,
			});
			return {
				newCell,
			};
		}
		case CellType.CHECKBOX: {
			if (typeof frontmatterValue !== "boolean")
				return {
					newCell: createCheckboxCell(id, {
						hasValidFrontmatter: true,
					}),
				};

			const newCell = createCheckboxCell(id, {
				value: frontmatterValue,
				hasValidFrontmatter: true,
			});
			return {
				newCell,
			};
		}
		case CellType.DATE: {
			if (
				typeof frontmatterValue !== "string" ||
				parseDateTime(frontmatterValue) === null
			)
				return {
					newCell: createDateCell(id, {
						hasValidFrontmatter: false,
					}),
				};

			//The formatterValue will return either YYYY-MM-DD or YYYY-MM-DDTHH:MM
			//the date object will take this in as local time as output an ISO string
			let dateString = frontmatterValue;

			//2023-12-12 will be intrepreted in UTC time by `new Date()` if it doesn't have a timestamp
			//so we need to add a time
			const DATE_WITHOUT_TIME_REGEX = /^\d{4}-\d{2}-\d{2}$/;
			if (dateString.match(DATE_WITHOUT_TIME_REGEX)) {
				dateString += "T00:00:00";
			}
			const newCell = createDateCell(id, {
				dateTime: new Date(dateString).toISOString(),
				hasValidFrontmatter: true,
			});
			const includeTime = assignedType === ObsidianPropertyType.DATETIME;

			return {
				newCell,
				includeTime,
			};
		}
		case CellType.TAG: {
			if (typeof frontmatterValue !== "string")
				return {
					newCell: createTagCell(id, {
						hasValidFrontmatter: false,
					}),
				};

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
				hasValidFrontmatter: true,
			});
			const nextTags = [...column.tags, ...(newTag ? [newTag] : [])];
			return {
				newCell,
				nextTags,
			};
		}
		case CellType.MULTI_TAG: {
			if (typeof frontmatterValue !== "object") {
				return {
					newCell: createMultiTagCell(id, {
						hasValidFrontmatter: false,
					}),
				};
			}

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
				hasValidFrontmatter: true,
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
