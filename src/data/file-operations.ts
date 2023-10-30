import { App, TFile } from "obsidian";
import { splitFileExtension } from "./utils";

export const createFolder = async (app: App, folderPath: string) => {
	try {
		await app.vault.createFolder(folderPath);
	} catch (err) {
		const error = err as Error;
		if (error.message.includes("already exists")) return;
		throw err;
	}
};

export const createFile = async (
	app: App,
	filePath: string,
	data: string,
	numExisting = 0
): Promise<TFile> => {
	try {
		const filePathExtension = splitFileExtension(filePath);
		if (filePathExtension == null)
			throw new SyntaxError("File must include an extension");

		const numIterations = numExisting > 0 ? " " + numExisting : "";
		const filePathWithIteration =
			filePathExtension[0] + numIterations + filePathExtension[1];

		const file = await app.vault.create(filePathWithIteration, data);
		return file;
	} catch (err: unknown) {
		const error = err as Error;
		if (error.message.includes("already exists")) {
			return createFile(app, filePath, data, numExisting + 1);
		}
		throw err;
	}
};
