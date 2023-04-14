import type { Vault, TFile } from "obsidian";

/**
 * Cover the undocumented Obsidian APIs used in this file.
 */
export type VaultExt = Vault & {
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
	getAvailablePathForAttachments: (
		base: string,
		extension: string,
		currentFile: TFile | null
	) => Promise<string>;

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
};

/**
 * A subset of the setting options, used to determine path when creating new
 * tables.
 */
export type GetAvailableTablePathParams = {
	createAtObsidianAttachmentFolder: boolean;
	customFolderForNewTables: string;
	nameWithActiveFileNameAndTimestamp: boolean;
};
