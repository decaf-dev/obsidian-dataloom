import type { Vault, TFile } from "obsidian";

import { Notice, normalizePath, MarkdownView } from "obsidian";
import { mockTableState } from "../mock";
import FileOperations from "./File";
import Json from "./Json";
import { moment } from "obsidian";

/**
 * Cover the undocumented Obsidian APIs used in this file.
 */
type VaultExt = Vault & {
	/**
	 * Get available path for attachment file based on the attachments folder 
	 * setting. If the path is occupied, return a new path in the form of
	 * ${occupiedPathWithoutExtension} <int>.${extension}. Where <int> is the
	 * integer used to resolve the collision, counting from 1.
	 * 
	 * @param {string} base base name of the attachment file
	 * @param {string} extension extension of the attachment file
	 * @param {TFile} currentFile active file used to determine current working 
	 * directory; if null, root vault directory is used
	 * @returns {string}
	 */
	getAvailablePathForAttachments: (base: string, extension: string, currentFile: TFile | null) => Promise<string>;

	/**
	 * Get available path for creating a new file at the proposed location. If
	 * the location is occupied, return a new path in the form of
	 * ${occupiedPathWithoutExtension} <int>.${extension}. Where <int> is the
	 * integer used to resolve the collision, counting from 1.
	 * 
	 * @param {string} path proposed path without extension
	 * @param {string} extension extension of the file
	 * @returns {string}
	 */
	getAvailablePath: (path: string, extension: string) => string;

	/**
	 * Check if the given path exists.
	 * 
	 * @param {string} path 
	 * @returns {Promise<boolean>}
	 */
	exists: (path: string) => Promise<boolean>;
}

/**
 * A subset of the setting options, used to determine path when creating new
 * tables.
 */
type GetAvailableTablePathParams = {
	createAtObsidianAttachmentFolder: boolean;
	customFolderForNewTables: string;
	nameWithActiveFileNameAndTimestamp: boolean;
}

export const TABLE_EXTENSION = "table";
const DEFAULT_TABLE_FILENAME = "Untitled";

/**
 * @returns {Promise<string>} available path for table creation
 */
async function getAvailableTablePath({
	createAtObsidianAttachmentFolder,
	customFolderForNewTables,
	nameWithActiveFileNameAndTimestamp
}: GetAvailableTablePathParams) {
	// We only regard active markdown files as active files.
	const activeNote = app.workspace.getActiveViewOfType(MarkdownView)?.file;
	const tableFileName = activeNote !== undefined && nameWithActiveFileNameAndTimestamp
													? `${activeNote.basename}-${moment().format().replaceAll(":", ".")}`
													: DEFAULT_TABLE_FILENAME;

	if (createAtObsidianAttachmentFolder) {
		return await (app.vault as VaultExt).getAvailablePathForAttachments(
			tableFileName,
			TABLE_EXTENSION,
			activeNote ?? null
		);
	}

	// --- Use custom folder ---
	// Create the folder if not exist.
	const isFolderExist = await (app.vault as VaultExt).exists(customFolderForNewTables);
	if (!isFolderExist) {
		app.vault.createFolder(customFolderForNewTables);
	}

	return normalizePath((app.vault as VaultExt).getAvailablePath(
		`${customFolderForNewTables}/${tableFileName}`,
		TABLE_EXTENSION
	));
}

export default class TableFile {
	/**
	 * Create notion like table file at the given location.
	 * 
	 * @param {{
	 * 	createAtObsidianAttachmentFolder: boolean,
	 * 	customFolderForNewTables: string,
	 * 	nameWithActiveFileNameAndTimestamp: boolean
	 * }} paramObj the subset of settings needed to get available path
	 * @returns {TFile} table file created
	 */
	static async createNotionLikeTableFile(paramObj: GetAvailableTablePathParams) {
		try {
			const availPath = await getAvailableTablePath(paramObj);
			const tableState = mockTableState(1, 2);
			const serialized = Json.serializeTableState(tableState);
		 	return await FileOperations.createFile(
				availPath,
				serialized
			);
		} catch (err) {
			new Notice("Could not create Notion-Like table");
			throw err;
		}
	}
}
