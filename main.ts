import { Plugin, Editor } from "obsidian";

import { NLTTable } from "src/NLTTable";
import { NltSettings, DEFAULT_SETTINGS } from "src/app/services/state";
import { Header } from "src/app/services/state";
import {
	findMarkdownTablesFromFileData,
	parseTableFromMarkdown,
	validTypeDefinitionRow,
	findAppData,
	hashParsedTable,
	mergeAppData,
} from "src/app/services/utils";
export default class NltPlugin extends Plugin {
	settings: NltSettings;

	/**
	 * Called on plugin load.
	 * This can be when the plugin is enabled or Obsidian is first opened.
	 */
	async onload() {
		await this.loadSettings();
		await this.forcePostProcessorReload();

		this.registerMarkdownPostProcessor((element, context) => {
			const table = element.getElementsByTagName("table");
			if (table.length === 1) {
				context.addChild(
					new NLTTable(
						table[0],
						this.app,
						this,
						this.settings,
						context.sourcePath
					)
				);
			}
		});
		this.registerCommands();
		this.registerFileHandlers();
	}

	registerFileHandlers() {
		//Our persisted data uses a key of the file path and then stores an object mapping
		//to a CRC32 key and an AppData object
		//If the file we have data for changes, we want to update our cache
		this.registerEvent(
			this.app.vault.on("rename", (file, oldPath) => {
				if (this.settings.appData[oldPath]) {
					const newPath = file.path;
					const data = { ...this.settings.appData[oldPath] };
					delete this.settings.appData[oldPath];
					this.settings.appData[newPath] = data;
					this.saveSettings();
				}
			})
		);

		//The loadAppData and saveAppData functions handle markdown editing caused from the app.
		//However if a user updates the source markdown of a table and a cached version already existed,
		//since the CRC32 value is different, it will recreate brand new app data. This will cause things
		//like the tag colors to change.
		//We can avoid this by handling editor changes. If a file that was edited contains a table
		//and that table has a reference in the cache, then we should update it with new data.
		this.registerEvent(
			this.app.workspace.on("editor-change", async (editor) => {
				const file = this.app.workspace.getActiveFile();
				const markdownTables = findMarkdownTablesFromFileData(
					editor.getValue()
				);
				if (markdownTables.length !== 0) {
					markdownTables.forEach((markdownTable) => {
						const parsedTable =
							parseTableFromMarkdown(markdownTable);
						//Validate table
						if (!validTypeDefinitionRow(parsedTable)) return;

						const headers = parsedTable[0];

						//Get the saved entry
						if (this.settings.appData[file.path]) {
							const savedData = this.settings.appData[file.path];
							console.log(savedData);
							//Check headers of the save data
							Object.entries(savedData).forEach((entry) => {
								const [key, value] = entry;
								//If the headers match, update the data and the CRC
								if (
									value.headers.every((header: Header) =>
										headers.includes(header.content)
									)
								) {
									const hash = hashParsedTable(parsedTable);

									//If you change something in reading mode, we will persist
									//that data in the settings cache. However, if you go back
									//to editing mode, the editor-change callback will be ran.
									//Since the hashes are the same, no data has updated, so we
									//don't need to do anything
									if (parseInt(key) === hash) return;

									const newAppData = findAppData(parsedTable);
									console.log("MERGING DATA");
									const merged = mergeAppData(
										this.settings.appData[file.path][key],
										newAppData
									);
									this.settings.appData[file.path][hash] =
										merged;
									delete this.settings.appData[file.path][
										key
									];
									this.saveSettings();
								}
							});
						}
					});
				}
			})
		);
	}

	registerCommands() {
		this.addCommand({
			id: "nlt-add-table",
			name: "Add table",
			editorCallback: (editor: Editor) => {
				editor.replaceSelection(this.emptyTable());
			},
		});
	}

	/**
	 * Creates a 1 column NLT markdown table
	 * @returns An NLT markdown table
	 */
	emptyTable(): string {
		const columnName = "Column 1";
		const rows = [];
		rows[0] = `|  ${columnName}  |`;
		rows[1] = `|  ${Array(columnName.length).fill("-").join("")}  |`;
		rows[2] = `|  text ${Array(columnName.length - 3)
			.fill(" ")
			.join("")}  |`;
		return rows.join("\n");
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	/**
	 * Called on plugin unload.
	 * This can be when the plugin is disabled or Obsidian is closed.
	 */
	async onunload() {
		await this.forcePostProcessorReload();
	}

	/**
	 * Forces the post processor to be called again.
	 * This is necessary for clean up purposes on unload and causing NLT tables
	 * to be rendered onload.
	 */
	async forcePostProcessorReload() {
		const leaves = [
			...this.app.workspace.getLeavesOfType("markdown"),
			...this.app.workspace.getLeavesOfType("edit"),
		];
		for (let i = 0; i < leaves.length; i++) {
			const leaf = leaves[i];
			this.app.workspace.duplicateLeaf(leaf);
			leaf.detach();
		}
	}
}
