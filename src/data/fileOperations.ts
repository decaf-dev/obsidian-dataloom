import { splitFileExtension } from "./utils";

export const createFolder = async (folderPath: string): Promise<void> => {
	try {
		if (app.vault.getAbstractFileByPath(folderPath) == null)
			await app.vault.createFolder(folderPath);
	} catch (err) {
		throw err;
	}
};

export const createFile = async (
	filePath: string,
	data: string,
	numExisting = 0
): Promise<string> => {
	try {
		const filePathExtension = splitFileExtension(filePath);
		if (filePathExtension == null)
			throw new SyntaxError("File must include an extension");

		const numIterations = numExisting > 0 ? " " + numExisting : "";
		const filePathWithIteration =
			filePathExtension[0] + numIterations + filePathExtension[1];

		await app.vault.create(filePathWithIteration, data);
		return filePathWithIteration;
	} catch (err: unknown) {
		const error = err as Error;
		console.log(error.message);

		if (error.message.includes("File already exists")) {
			return createFile(filePath, data, numExisting + 1);
		} else {
			throw err;
		}
	}
};
