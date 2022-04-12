import { Plugin, Editor } from "obsidian";

import { NLTTable } from "src/NLTTable";
import { NltSettings, DEFAULT_SETTINGS } from "src/app/services/state";
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
		this.registerEvent(
			this.app.vault.on("rename", (file, oldPath) => {
				//If filepath exists for our settings, then we want to rename it
				//So that we can keep our app data matched to each file
				if (this.settings.appData[oldPath]) {
					const newPath = file.path;
					const data = { ...this.settings.appData[oldPath] };
					delete this.settings.appData[oldPath];
					this.settings.appData[newPath] = data;
					this.saveSettings();
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
