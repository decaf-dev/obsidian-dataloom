import type { TFile } from "obsidian";

export default class File {
	static async createFile(
		filePath: string,
		data: string,
	): Promise<TFile> {
		return app.vault.create(filePath, data);
	}
}
