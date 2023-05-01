import { Notice, MarkdownView } from "obsidian";
import { moment } from "obsidian";
import { createFile, createFolder } from "./fileOperations";
import { createTableState } from "./tableState";
import { serializeTableState } from "./tableStateIO";
import { DEFAULT_TABLE_NAME, TABLE_EXTENSION } from "./constants";

const getFilePath = (folderPath: string): string => {
	//TODO implement
	//Custom folder
	//Attachments folder
	//Or current folder
	return "";
};

const getFileName = (useActiveFileNameAndTimestamp: boolean): string => {
	let fileName = DEFAULT_TABLE_NAME;

	const activeNote = app.workspace.getActiveViewOfType(MarkdownView)?.file;
	if (activeNote !== undefined) {
		//If the active note is a new note, use the default name
		if (useActiveFileNameAndTimestamp) {
			fileName = `${activeNote.basename}-${moment()
				.format()
				.replaceAll(":", ".")}`;
		}
	}

	return `${fileName}.${TABLE_EXTENSION}`;
};

export const createNewTableFile = async (options: {
	folderPath: string;
	useActiveFileNameAndTimestamp: boolean;
}) => {
	try {
		const filePath = getFilePath(options.folderPath);
		//Create folder if it doesn't exist
		await createFolder(options.folderPath);

		const fileName = getFileName(options.useActiveFileNameAndTimestamp);
		const tableState = createTableState(1, 1);
		const serialized = serializeTableState(tableState);
		return await createFile(filePath + "/" + fileName, serialized);
	} catch (err) {
		new Notice("Could not create Notion-Like table");
		throw err;
	}
};
