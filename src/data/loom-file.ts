import { App, Notice, normalizePath } from "obsidian";
import { createFile, createFolder } from "./file-operations";
import { createLoomState } from "../shared/loom-state/loom-state-factory";
import { serializeState } from "./serialize-state";
import { LOOM_EXTENSION, DEFAULT_LOOM_NAME } from "./constants";

export const createLoomFile = async (
	app: App,
	pluginVersion: string,
	defaultFrozenColumnCount: number,
	folderOptions: {
		contextMenuFolderPath: string | null;
		createAtAttachmentsFolder: boolean;
		customFolderForNewFiles: string;
	}
) => {
	const {
		contextMenuFolderPath,
		createAtAttachmentsFolder,
		customFolderForNewFiles,
	} = folderOptions;

	try {
		const fileName = getFileName();
		const folderPath = await getFolderForNewLoomFile(app, {
			contextMenuFolderPath,
			createAtAttachmentsFolder,
			customFolderForNewFiles,
		});

		await createFolder(app, folderPath);

		const filePath = normalizePath(folderPath + "/" + fileName);

		//This is needed because a path with a leading period will cause app.vault.create() to return null.
		//This is a bug in Obsidian.
		//TODO report this bug the Obsidian team
		const formattedPath = removeLeadingPeriod(filePath);
		const loomState = createLoomState(1, 1, {
			pluginVersion,
			frozenColumnCount: defaultFrozenColumnCount,
		});
		const serializedState = serializeState(loomState);

		const file = await createFile(app, formattedPath, serializedState);
		return file;
	} catch (err) {
		new Notice("Could not create loom file");
		throw err;
	}
};

const getFolderForNewLoomFile = async (
	app: App,
	options: {
		contextMenuFolderPath: string | null;
		createAtAttachmentsFolder: boolean;
		customFolderForNewFiles: string;
	}
) => {
	const {
		contextMenuFolderPath,
		createAtAttachmentsFolder,
		customFolderForNewFiles,
	} = options;

	let folderPath = "";

	if (contextMenuFolderPath) {
		folderPath = contextMenuFolderPath;
	} else if (createAtAttachmentsFolder) {
		const openFile = app.workspace.getActiveFile();
		folderPath = await (app.vault as any).getAvailablePathForAttachments(
			"",
			"",
			openFile
		);
	} else {
		folderPath = customFolderForNewFiles;
	}
	const normalized = normalizePath(folderPath);
	return normalized;
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
