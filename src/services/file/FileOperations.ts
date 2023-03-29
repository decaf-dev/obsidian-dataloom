import { getFilePathExtension } from "./utils";

export default class FileOperations {
	static async createObsidianFile(
		filePath: string,
		data: string
	): Promise<boolean | Error> {
		try {
			await app.vault.create(filePath, data);
			return true;
		} catch (err) {
			throw err;
		}
	}
	static async createFile(filePath: string, data: string, numExisting = 0) {
		try {
			const filePathExtension = getFilePathExtension(filePath);
			if (filePathExtension == null)
				throw new Error("File must include an extension");

			const { pathWithoutExtension, extension } = filePathExtension;

			const number = numExisting > 0 ? " " + (numExisting - 1) : "";
			const updatedFilePath = pathWithoutExtension + number + extension;
			await this.createObsidianFile(updatedFilePath, data);
		} catch (err: unknown) {
			const error = err as Error;

			if (error.message.includes("File already exists")) {
				this.createFile(filePath, data, numExisting + 1);
			} else {
				throw err;
			}
		}
	}
}
