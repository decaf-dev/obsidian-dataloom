import { App, Notice, TFile } from "obsidian";
import EventManager from "src/shared/event/event-manager";
import { LOOM_EXTENSION, WIKI_LINK_REGEX } from "./constants";
import { deserializeState, serializeState } from "./serialize-state";
import {
	CellType,
	EmbedCell,
	FileCell,
	LoomState,
	TextCell,
} from "src/shared/loom-state/types/loom-state";
import { mapCellsToColumn } from "src/shared/loom-state/utils/column-utils";
import ColumnNotFoundError from "src/shared/error/column-not-found-error";
import {
	isMarkdownFile,
	stripFileExtension,
} from "src/shared/link-and-path/file-path-utils";
import { componentsToWikiLink } from "src/shared/link-and-path/markdown-link-utils";

//TODO test

/**
 * Checks every loom file, if the file has a link to the old path, the link is updated to the new path.
 * A message is output for the number of links updated.
 * @param app - The Obsidian App instance
 * @param file - The file that was renamed
 * @param oldPath - The old path of the file
 * @param currentAppVersion - The current version of the app
 */
export const handleFileRename = async (
	app: App,
	file: TFile,
	oldPath: string,
	currentAppVersion: string
) => {
	const loomFiles = getAllVaultLoomFiles(app);

	let totalLinksUpdated = 0;
	let numFilesUpdated = 0;

	for (const loomFile of loomFiles) {
		const { updatedState, didUpdate, numLinksUpdated } =
			await updateLoomFileState(
				app,
				loomFile,
				oldPath,
				file.path,
				currentAppVersion
			);
		if (didUpdate) {
			totalLinksUpdated += numLinksUpdated;
			numFilesUpdated++;
			await file.vault.modify(loomFile, serializeState(updatedState));

			EventManager.getInstance().emit(
				"app-refresh",
				loomFile.path,
				-1, //update all looms that match this path
				updatedState
			);
		}
	}
	if (totalLinksUpdated > 0) {
		new Notice(
			`Updated ${totalLinksUpdated} link${
				totalLinksUpdated > 1 ? "s" : ""
			} in ${numFilesUpdated} loom file${numFilesUpdated > 1 ? "s" : ""}.`
		);
	}
};

const updateLoomFileState = async (
	app: App,
	loomFile: TFile,
	oldPath: string,
	newPath: string,
	currentAppVersion: string
): Promise<{
	updatedState: LoomState;
	didUpdate: boolean;
	numLinksUpdated: number;
}> => {
	let numLinksUpdated = 0;

	const data = await app.vault.read(loomFile);
	const state = deserializeState(data, currentAppVersion);

	if (isMarkdownFile(oldPath)) {
		oldPath = stripFileExtension(oldPath);
	}

	if (isMarkdownFile(newPath)) {
		newPath = stripFileExtension(newPath);
	}

	const { columns, rows } = state.model;
	const cellsToColumn = mapCellsToColumn(columns, rows);

	const nextRows = rows.map((row) => {
		const { cells } = row;
		const nextCells = cells.map((cell) => {
			const { columnId } = cell;
			const column = cellsToColumn.get(columnId);
			if (!column) throw new ColumnNotFoundError({ id: columnId });

			const { type } = column;

			switch (type) {
				case CellType.TEXT: {
					const { nextCell, didUpdate } = updateTextCell(
						cell as TextCell,
						oldPath,
						newPath
					);
					console.log({ nextCell, didUpdate });
					if (didUpdate) numLinksUpdated++;
					return nextCell;
				}
				case CellType.FILE: {
					const { nextCell, didUpdate } = updateFileCell(
						cell as FileCell,
						oldPath,
						newPath
					);
					if (didUpdate) numLinksUpdated++;
					return nextCell;
				}
				case CellType.EMBED: {
					const { nextCell, didUpdate } = updateEmbedCell(
						cell as EmbedCell,
						oldPath,
						newPath
					);
					if (didUpdate) numLinksUpdated++;
					return nextCell;
				}
				default:
					return cell;
			}
		});
		return {
			...row,
			cells: nextCells,
		};
	});

	const nextState = {
		...state,
		model: {
			...state.model,
			rows: nextRows,
		},
	};

	return {
		updatedState: nextState,
		didUpdate: JSON.stringify(state) !== JSON.stringify(nextState),
		numLinksUpdated,
	};
};

//Text
//content: [[/path/to/file|alias]]
const updateTextCell = (cell: TextCell, oldPath: string, newPath: string) => {
	const { content } = cell;

	const { replacedString, replacementCount } = replaceWikiLinks(
		content,
		(path, alias) => {
			if (path === oldPath) {
				return componentsToWikiLink(newPath, alias);
			}
			return componentsToWikiLink(path, alias);
		}
	);
	if (replacementCount > 0) {
		const nextCell = {
			...cell,
			content: replacedString,
		};
		return { nextCell, didUpdate: true };
	}

	return { nextCell: cell, didUpdate: false };
};

//Embed
//pathOrUrl: /path/to/file
//alias: alias
const updateEmbedCell = (cell: EmbedCell, oldPath: string, newPath: string) => {
	const { pathOrUrl } = cell;
	if (pathOrUrl === oldPath) {
		const nextCell = {
			...cell,
			pathOrUrl: newPath,
		};
		return { nextCell, didUpdate: true };
	}
	return { nextCell: cell, didUpdate: false };
};

//File
//path: /path/to/file
//alias: alias
const updateFileCell = (cell: FileCell, oldPath: string, newPath: string) => {
	const { path } = cell;
	if (path === oldPath) {
		const nextCell = {
			...cell,
			path: newPath,
		};
		return { nextCell, didUpdate: true };
	}

	return { nextCell: cell, didUpdate: false };
};

const replaceWikiLinks = (
	str: string,
	replaceFunction: (path: string, alias: string | null) => string
) => {
	let replacementCount = 0;

	const replacedString = str.replace(
		WIKI_LINK_REGEX,
		(_match, path, _, alias) => {
			replacementCount++;
			return replaceFunction(path, alias || null);
		}
	);

	return { replacedString, replacementCount };
};

const getAllVaultLoomFiles = (app: App) => {
	return app.vault
		.getFiles()
		.filter((file) => file.extension === LOOM_EXTENSION);
};
