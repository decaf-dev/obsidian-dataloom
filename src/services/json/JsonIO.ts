import { Notice } from "obsidian";
import FileOperations from "../file/FileOperations";

export default class JsonIO {
	private static TABLE_EXTENSION = ".table";

	static async createNotionLikeTableFile() {
		try {
			FileOperations.createFile("Untitled" + this.TABLE_EXTENSION, "");
		} catch (err) {
			new Notice("Could not create Notion-Like-Table file");
			throw err;
		}
	}
}
