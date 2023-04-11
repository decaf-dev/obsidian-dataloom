import type { Vault, TFile } from "obsidian";

import { Notice, normalizePath } from "obsidian";
import { mockTableState } from "../mock";
import FileOperations from "./File";
import Json from "./Json";

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
	 * 													  directory; if null, root vault directory is used
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
}

export const TABLE_EXTENSION = "table";
const DEFAULT_TABLE_FILENAME = "Untitled";

/**
 * @returns {Promise<string>} available path for table creation
 */
export async function getAvailableTablePath({
	createAtObsidianAttachmentFolder,
	customFolderForNewTables
}: GetAvailableTablePathParams) {
	if (createAtObsidianAttachmentFolder) {
		return await (app.vault as VaultExt).getAvailablePathForAttachments(
			DEFAULT_TABLE_FILENAME,
			TABLE_EXTENSION,
			app.workspace.getActiveFile()
		);
	}

	// --- Use custom folder ---
	// Create the folder if not exist.
	const isFolderExist = await (app.vault as VaultExt).exists(customFolderForNewTables);
	if (!isFolderExist) {
		app.vault.createFolder(customFolderForNewTables);
	}

	return normalizePath((app.vault as VaultExt).getAvailablePath(
		`${customFolderForNewTables}/${DEFAULT_TABLE_FILENAME}`,
		TABLE_EXTENSION
	));
}

export default class TableFile {
	/**
	 * Create notion like table file at the given location.
	 * 
	 * @param {string} availPath the file path guaranteed to have no collision
	 * @returns {TFile} table file created
	 */
	static async createNotionLikeTableFile(availPath: string) {
		try {
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
