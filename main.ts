import { Plugin, Editor, MarkdownView } from "obsidian";

import { NLTTable } from "src/NLTTable";
import { NltSettings, DEFAULT_SETTINGS } from "src/app/services/state";
import { createEmptyTable, randomTableId } from "src/app/services/utils";
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
			console.log(context);
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
		//to a table id and an AppData object.
		//If the file path changes, we want to update our cache so that the data is still accessible.
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
	}

	registerCommands() {
		this.addCommand({
			id: "nlt-add-table",
			name: "Add table",
			editorCallback: (editor: Editor) => {
				editor.replaceSelection(createEmptyTable(randomTableId()));
			},
		});
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

	/*
	 * Forces the post processor to be called again.
	 * This is necessary for clean up purposes on unload and causing NLT tables
	 * to be rendered onload.
	 */
	async forcePostProcessorReload() {
		this.app.workspace.iterateAllLeaves((leaf) => {
			const view = leaf.view;
			if (view.getViewType() === "markdown") {
				if (view instanceof MarkdownView)
					view.previewMode.rerender(true);
			}
		});
	}
}
