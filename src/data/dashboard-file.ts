import { Notice } from "obsidian";
import { createFile, createFolder } from "./file-operations";
import { createDashboardState } from "./dashboard-state-factory";
import { serializeDashboardState } from "./serialize-dashboard-state";
import { CURRENT_FILE_EXTENSION, DEFAULT_TABLE_NAME } from "./constants";

const getFileName = (): string => {
	const fileName = DEFAULT_TABLE_NAME;

	return `${fileName}.${CURRENT_FILE_EXTENSION}`;
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
		const dashboardState = createDashboardState(1, 1);
		const serialized = serializeDashboardState(dashboardState);
		const filePath = getFilePath(options.folderPath, fileName);

		return await createFile(filePath, serialized);
	} catch (err) {
		new Notice("Could not create dashboard");
		throw err;
	}
};
