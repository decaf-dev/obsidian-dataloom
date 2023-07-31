import { Notice, normalizePath } from "obsidian";
import { createFile, createFolder } from "./file-operations";
import { createLoomState } from "./loom-state-factory";
import { serializeLoomState } from "./serialize-loom-state";
import { FILE_EXTENSION, DEFAULT_LOOM_NAME } from "./constants";

const getFileName = (): string => {
	const fileName = DEFAULT_LOOM_NAME;
	return `${fileName}.${FILE_EXTENSION}`;
};

const getFilePath = (folderPath: string) => {
	const fileName = getFileName();
	return normalizePath(folderPath + "/" + fileName);
};

const createFolderIfNotExists = async (folderPath: string) => {
	if (app.vault.getAbstractFileByPath(folderPath) == null)
		await createFolder(folderPath);
};

export const createLoomFile = async (
	folderPath: string,
	manifestPluginVersion: string
) => {
	try {
		await createFolderIfNotExists(folderPath);
		const filePath = getFilePath(folderPath);

		const loomState = createLoomState(1, 1, {
			pluginVersion: manifestPluginVersion,
		});
		const serializedState = serializeLoomState(loomState);

		console.log("Creating loom file at: ", filePath);
		return await createFile(filePath, serializedState);
	} catch (err) {
		new Notice("Could not create loom file");
		throw err;
	}
};
