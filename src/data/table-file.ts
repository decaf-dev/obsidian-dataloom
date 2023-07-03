import { Notice } from "obsidian";
import { createFile, createFolder } from "./file-operations";
import { createTableState } from "./table-state-factory";
import { serializeTableState } from "./serialize-table-state";
import { DEFAULT_TABLE_NAME, PREVIOUS_FILE_EXTENSION } from "./constants";

const getFileName = (): string => {
	const fileName = DEFAULT_TABLE_NAME;

	return `${fileName}.${PREVIOUS_FILE_EXTENSION}`;
};

export const getFilePath = (folderPath: string, fileName: string) => {
	if (folderPath === "") return fileName;
	return folderPath + "/" + fileName;
};

export const createDashboardFile = async (options: { folderPath: string }) => {
	try {
		//Create folder if it doesn't exist
		if (options.folderPath !== "") {
			if (app.vault.getAbstractFileByPath(options.folderPath) == null)
				await createFolder(options.folderPath);
		}

		const fileName = getFileName();
		const tableState = createTableState(1, 1);
		const serialized = serializeTableState(tableState);
		const filePath = getFilePath(options.folderPath, fileName);

		return await createFile(filePath, serialized);
	} catch (err) {
		new Notice("Could not create dashboard");
		throw err;
	}
};
