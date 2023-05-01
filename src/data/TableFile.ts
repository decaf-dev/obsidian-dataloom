import { Notice, MarkdownView } from "obsidian";
import { moment } from "obsidian";
import { createFile, createFolder } from "./fileOperations";
import { createTableState } from "./modifyTableState";
import { serializeTableState } from "./serializeTableState";
import { DEFAULT_TABLE_NAME, TABLE_EXTENSION } from "./constants";

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

export const createTableFile = async (options: {
	folderPath: string;
	useActiveFileNameAndTimestamp: boolean;
}) => {
	try {
		//Create folder if it doesn't exist
		if (options.folderPath !== "") await createFolder(options.folderPath);

		const fileName = getFileName(options.useActiveFileNameAndTimestamp);
		const tableState = createTableState(1, 1);
		const serialized = serializeTableState(tableState);
		return await createFile(
			options.folderPath + "/" + fileName,
			serialized
		);
	} catch (err) {
		new Notice("Could not create Notion-Like table");
		throw err;
	}
};
