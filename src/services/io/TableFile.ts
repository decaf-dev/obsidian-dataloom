import { Notice, MarkdownView } from "obsidian";
import { mockTableState } from "../mock";
import FileOperations from "./File";
import Json from "./Json";
import { moment } from "obsidian";
import { GetAvailableTablePathParams, VaultExt } from "./types";
import { DEFAULT_TABLE_FILENAME, TABLE_EXTENSION } from "./constants";

async function getAvailableTablePath({
	createAtObsidianAttachmentFolder,
	customFolderForNewTables,
	nameWithActiveFileNameAndTimestamp,
}: GetAvailableTablePathParams) {
	// We only regard active markdown files as active files.
	const activeNote = app.workspace.getActiveViewOfType(MarkdownView)?.file;

	let tableFileName = DEFAULT_TABLE_FILENAME;
	if (activeNote !== undefined) {
		if (nameWithActiveFileNameAndTimestamp) {
			tableFileName = `${activeNote.basename}-${moment()
				.format()
				.replaceAll(":", ".")}`;
		}
	}

	if (createAtObsidianAttachmentFolder) {
		return (app.vault as VaultExt).getAvailablePathForAttachments(
			tableFileName,
			TABLE_EXTENSION,
			activeNote ?? null
		);
	}

	const doesFolderExist = await (app.vault as VaultExt).exists(
		customFolderForNewTables
	);

	if (!doesFolderExist)
		await app.vault.createFolder(customFolderForNewTables);

	const folderPath =
		customFolderForNewTables === "" ? "" : customFolderForNewTables + "/";

	return (app.vault as VaultExt).getAvailablePath(
		`${folderPath}${tableFileName}`,
		TABLE_EXTENSION
	);
}

export default class TableFile {
	static async createNotionLikeTableFile(
		params: GetAvailableTablePathParams
	) {
		try {
			const filePath = await getAvailableTablePath(params);
			const tableState = mockTableState(1, 1);
			const serialized = Json.serializeTableState(tableState);
			return await FileOperations.createFile(filePath, serialized);
		} catch (err) {
			new Notice("Could not create Notion-Like table");
			throw err;
		}
	}
}
