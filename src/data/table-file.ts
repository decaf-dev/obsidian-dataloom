import { Notice, MarkdownView } from "obsidian";
import { moment } from "obsidian";
import { createFile, createFolder } from "./file-operations";
import { createTableState } from "./table-state-factory";
import { serializeTableState } from "./serialize-table-state";
import { DEFAULT_TABLE_NAME, TABLE_EXTENSION } from "./constants";

const getActiveFileNameAndTimestamp = () => {
	const activeView = app.workspace.getActiveViewOfType(MarkdownView);
	if (!activeView) return null;

	const file = activeView.file;
	if (!file) return null;

	return `${file.basename}-${moment().format().replaceAll(":", ".")}`;
};

const getFileName = (useActiveFileNameAndTimestamp: boolean): string => {
	let fileName = DEFAULT_TABLE_NAME;

	if (useActiveFileNameAndTimestamp) {
		const name = getActiveFileNameAndTimestamp();
		if (name) fileName = name;
	}

	return `${fileName}.${TABLE_EXTENSION}`;
};

export const getFilePath = (folderPath: string, fileName: string) => {
	if (folderPath === "") return fileName;
	return folderPath + "/" + fileName;
};

export const createTableFile = async (options: {
	folderPath: string;
	useActiveFileNameAndTimestamp: boolean;
}) => {
	try {
		//Create folder if it doesn't exist
		if (options.folderPath !== "") {
			if (app.vault.getAbstractFileByPath(options.folderPath) == null)
				await createFolder(options.folderPath);
		}

		const fileName = getFileName(options.useActiveFileNameAndTimestamp);
		const tableState = createTableState(1, 1);
		const serialized = serializeTableState(tableState);
		const filePath = getFilePath(options.folderPath, fileName);

		return await createFile(filePath, serialized);
	} catch (err) {
		new Notice("Could not create Notion-Like table");
		throw err;
	}
};
