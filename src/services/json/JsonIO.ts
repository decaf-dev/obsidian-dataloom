import { Notice } from "obsidian";
import FileOperations from "../file/FileOperations";

export const TABLE_EXTENSION = "table";
export default class JsonIO {
	static async createNotionLikeTableFile() {
		try {
			FileOperations.createFile("Untitled" + "." + TABLE_EXTENSION, "{}");
		} catch (err) {
			new Notice("Could not create Notion-Like-Table file");
			throw err;
		}
	}
}
