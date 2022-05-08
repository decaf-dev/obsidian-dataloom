import { Plugin, Editor, MarkdownView } from "obsidian";

import { NLTTable } from "src/NLTTable";
import { NltSettings, DEFAULT_SETTINGS } from "src/app/services/settings";
import { addRow, addColumn } from "src/app/services/appData/internal/add";
import { saveAppData } from "src/app/services/appData/external/save";
import { createEmptyMarkdownTable } from "src/app/services/appData/mock";
import { randomTableId } from "src/app/services/random";
import { TABBABLE_ELEMENT_TYPE } from "src/app/constants";
export default class NltPlugin extends Plugin {
	settings: NltSettings;
	focused: { tableId: string; sourcePath: string } | null = null;

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
						element,
						this.app,
						this,
						this.settings,
						context.sourcePath
					)
				);
			}
		});
		this.registerCommands();
		this.registerEvents();
	}

	registerEvents() {
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
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "=" }],
			editorCallback: (editor: Editor) => {
				editor.replaceSelection(
					createEmptyMarkdownTable(randomTableId())
				);
			},
		});

		this.addCommand({
			id: "nlt-add-column",
			name: "Add column to focused table",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "\\" }],
			callback: async () => {
				if (this.focused) {
					const { tableId, sourcePath } = this.focused;
					const oldData = this.settings.appData[sourcePath][tableId];
					const newData = addColumn(oldData);
					await saveAppData(
						this,
						this.settings,
						app,
						oldData,
						newData,
						sourcePath,
						tableId
					);
				}
			},
		});

		this.addCommand({
			id: "nlt-add-row",
			name: "Add row to focused table",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "Enter" }],
			callback: async () => {
				if (this.focused) {
					const { tableId, sourcePath } = this.focused;
					const oldData = this.settings.appData[sourcePath][tableId];
					const newData = addRow(oldData);
					const focusedElement = {
						id: newData.cells[
							newData.cells.length - newData.headers.length
						].id,
						type: TABBABLE_ELEMENT_TYPE.CELL,
					};
					this.settings.focusedElement = focusedElement;
					await this.saveSettings();
					await saveAppData(
						this,
						this.settings,
						app,
						oldData,
						newData,
						sourcePath,
						tableId
					);
				}
			},
		});
	}

	focusTable = (tableId: string, sourcePath: string) => {
		this.focused = {
			tableId,
			sourcePath,
		};
	};

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
