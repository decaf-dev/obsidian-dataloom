import { App, TFile } from "obsidian";
import { EXTENSION_REGEX } from "./constants";

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

export const splitFileExtension = (
	filePath: string
): [string, string] | null => {
	if (filePath.match(EXTENSION_REGEX)) {
		const periodIndex = filePath.lastIndexOf(".");
		return [
			filePath.substring(0, periodIndex),
			filePath.substring(periodIndex),
		];
	}
	return null;
};
