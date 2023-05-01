import { splitFileExtension } from "./utils";

export const createFolder = async (folderPath: string): Promise<boolean> => {
	try {
		await app.vault.createFolder(folderPath);
		return true;
	} catch (err) {
		return false;
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

		const numIterations = numExisting > 0 ? " " + (numExisting - 1) : "";
		const filePathWithIteration =
			filePathExtension[0] + numIterations + filePathExtension[1];
		await app.vault.create(filePath, data);
		return filePathWithIteration;
	} catch (err: unknown) {
		const error = err as Error;

		if (error.message.includes("File already exists")) {
			return createFile(filePath, data, numExisting + 1);
		} else {
			throw err;
		}
	}
};
