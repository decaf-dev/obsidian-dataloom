import { Notice } from "obsidian";
import { createFile, createFolder } from "./file-operations";
import { createLoomState } from "./loom-state-factory";
import { serializeLoomState } from "./serialize-table-state";
import { CURRENT_FILE_EXTENSION, DEFAULT_TABLE_NAME } from "./constants";

const getFileName = (): string => {
	const fileName = DEFAULT_TABLE_NAME;

	return `${fileName}.${CURRENT_FILE_EXTENSION}`;
};

export const getFilePath = (folderPath: string, fileName: string) => {
	if (folderPath === "") return fileName;
	return folderPath + "/" + fileName;
};

export const createLoomFile = async (options: { folderPath: string }) => {
	try {
		//Create folder if it doesn't exist
		if (options.folderPath !== "") {
			if (app.vault.getAbstractFileByPath(options.folderPath) == null)
				await createFolder(options.folderPath);
		}

		const fileName = getFileName();
		const LoomState = createLoomState(1, 1);
		const serialized = serializeLoomState(LoomState);
		const filePath = getFilePath(options.folderPath, fileName);

		return await createFile(filePath, serialized);
	} catch (err) {
		new Notice("Could not create loom file");
		throw err;
	}
};
