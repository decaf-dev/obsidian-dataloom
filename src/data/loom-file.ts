import { App, Notice, normalizePath } from "obsidian";
import { createFile, createFolder } from "./file-operations";
import { createLoomState } from "../shared/loom-state/loom-state-factory";
import { serializeLoomState } from "./serialize";
import { FILE_EXTENSION, DEFAULT_LOOM_NAME } from "./constants";

export const createLoomFile = async (
	app: App,
	folderPath: string,
	manifestPluginVersion: string,
	defaultFrozenColumnCount: number
) => {
	try {
		await createFolderIfNotExists(app, folderPath);
		const filePath = getFilePath(folderPath);

		const loomState = createLoomState(
			manifestPluginVersion,
			defaultFrozenColumnCount
		);
		const serializedState = serializeLoomState(loomState);

		console.log("Creating loom file at: ", filePath);
		return await createFile(app, filePath, serializedState);
	} catch (err) {
		new Notice("Could not create loom file");
		throw err;
	}
};

const getFileName = (): string => {
	const fileName = DEFAULT_LOOM_NAME;
	return `${fileName}.${FILE_EXTENSION}`;
};

const getFilePath = (folderPath: string) => {
	const fileName = getFileName();
	return normalizePath(folderPath + "/" + fileName);
};

const createFolderIfNotExists = async (app: App, folderPath: string) => {
	if (app.vault.getAbstractFileByPath(folderPath) == null)
		await createFolder(app, folderPath);
};
