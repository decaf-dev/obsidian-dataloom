import { Notice } from "obsidian";
import { mockTableState } from "../mock";
import FileOperations from "./File";
import Json from "./Json";

export const TABLE_EXTENSION = "table";
export default class TableFile {
	static async createNotionLikeTableFile() {
		try {
			const filePath = "Untitled" + "." + TABLE_EXTENSION;

			const tableState = mockTableState(1, 1);
			const serialized = Json.serializeTableState(tableState);
			const updatedFilePath = await FileOperations.createFile(
				filePath,
				serialized
			);
			return updatedFilePath;
		} catch (err) {
			new Notice("Could not create Notion-Like-Table file");
			throw err;
		}
	}
}
