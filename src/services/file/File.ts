import { getFilePathExtension } from "./utils";

export default class File {
	static async createObsidianFile(
		filePath: string,
		data: string
	): Promise<boolean> {
		try {
			await app.vault.create(filePath, data);
		} catch (err) {
			throw err;
		}
		return true;
	}
	static async createFile(
		filePath: string,
		data: string,
		numExisting = 0
	): Promise<string> {
		try {
			const filePathExtension = getFilePathExtension(filePath);
			if (filePathExtension == null)
				throw new Error("File must include an extension");

			const { pathWithoutExtension, extension } = filePathExtension;

			const fileIteration =
				numExisting > 0 ? " " + (numExisting - 1) : "";
			const updatedFilePath =
				pathWithoutExtension + fileIteration + extension;
			await this.createObsidianFile(updatedFilePath, data);
			return updatedFilePath;
		} catch (err: unknown) {
			const error = err as Error;

			if (error.message.includes("File already exists")) {
				return this.createFile(filePath, data, numExisting + 1);
			} else {
				throw err;
			}
		}
	}
}
