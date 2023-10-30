import { App, Notice, normalizePath } from "obsidian";
import { createFile, createFolder } from "./file-operations";
import { createLoomState } from "../shared/loom-state/loom-state-factory";
import { serializeState } from "./serialize-state";
import { LOOM_EXTENSION, DEFAULT_LOOM_NAME } from "./constants";

export const createLoomFile = async (
	app: App,
	folderPath: string,
	pluginVersion: string,
	defaultFrozenColumnCount: number
) => {
	try {
		await createFolder(app, folderPath);

		const filePath = getFilePath(folderPath);
		const formattedPath = removeLeadingPeriod(filePath);
		const loomState = createLoomState(
			pluginVersion,
			defaultFrozenColumnCount
		);
		const serializedState = serializeState(loomState);

		const file = await createFile(app, formattedPath, serializedState);
		return file;
	} catch (err) {
		new Notice("Could not create loom file");
		throw err;
	}
};
const getFilePath = (folderPath: string) => {
	const fileName = getFileName();
	return normalizePath(folderPath + "/" + fileName);
};

const getFileName = (): string => {
	return `${DEFAULT_LOOM_NAME}.${LOOM_EXTENSION}`;
};

const removeLeadingPeriod = (path: string) => {
	if (path.startsWith(".")) {
		return path.substring(1);
	}
	return path;
};
