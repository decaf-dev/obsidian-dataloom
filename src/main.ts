import { Plugin, Editor, MarkdownView, Notice, TFile } from "obsidian";

import { NltTable } from "./NltTable";
import { addRow, addColumn } from "./services/internal/add";
import { saveTableState } from "./services/external/save";
import { createEmptyMarkdownTable } from "./services/random";
import { ViewType, TableState } from "./services/table/types";
import { MarkdownTable } from "./services/external/types";
import {
	findMarkdownTablesFromFileData,
	tableIdFromEl,
} from "./services/external/loadUtils";

export interface NltSettings {
	data: {
		[sourcePath: string]: {
			[tableIndex: string]: TableState;
		};
	};
}

export const DEFAULT_SETTINGS: NltSettings = {
	data: {},
};
interface FocusedTable {
	tableId: string;
	markdownTable: MarkdownTable;
	sourcePath: string;
	viewType: ViewType;
}
export default class NltPlugin extends Plugin {
	settings: NltSettings;
	focused: FocusedTable | null = null;

	async findMarkdownTables(
		path: string
	): Promise<Map<string, MarkdownTable>> {
		const file = this.app.vault.getAbstractFileByPath(path);
		if (file instanceof TFile) {
			const data = await this.app.vault.read(file);
			return findMarkdownTablesFromFileData(data);
		}
	}

	/**
	 * Called on plugin load.
	 * This can be when the plugin is enabled or Obsidian is first opened.
	 */
	async onload() {
		console.log("Plugin enabled.");
		await this.loadSettings();
		await this.forcePostProcessorReload();

		this.registerMarkdownPostProcessor(async (element, context) => {
			const table = element.querySelector("table");
			if (table) {
				const markdownTables = await this.findMarkdownTables(
					context.sourcePath
				);
				const tableId = tableIdFromEl(element);
				const markdownTable = markdownTables.get(tableId);
				if (markdownTable) {
					context.addChild(
						new NltTable(
							element,
							this,
							tableId,
							markdownTable,
							context.sourcePath
						)
					);
				} else {
					console.log("Table id not found");
				}
			}
		});

		// this.addSettingTab(new NltSettingsTab(this.app, this));
		this.registerCommands();
		this.registerEvents();
	}

	registerEvents() {
		//Our persisted data uses a key of the file path and then stores an object mapping
		//to a table id and an TableModel object.
		//If the file path changes, we want to update our cache so that the data is still accessible.
		this.registerEvent(
			this.app.vault.on("rename", (file, oldPath) => {
				if (this.settings.data[oldPath]) {
					const newPath = file.path;
					const data = { ...this.settings.data[oldPath] };
					delete this.settings.data[oldPath];
					this.settings.data[newPath] = data;
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
				editor.replaceSelection(createEmptyMarkdownTable());
			},
		});

		this.addCommand({
			id: "nlt-add-column",
			name: "Add column to focused table",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "\\" }],
			callback: async () => {
				if (this.focused) {
					const { tableId, markdownTable, sourcePath, viewType } =
						this.focused;
					const { tableModel, tableSettings } =
						this.settings.data[sourcePath][tableId];
					const [updatedModel, updatedSettings] = addColumn(
						tableModel,
						tableSettings
					);
					await saveTableState(
						this,
						updatedModel,
						updatedSettings,
						tableId,
						markdownTable,
						sourcePath,
						viewType
					);
				} else {
					new Notice(
						"No table focused. Please click a table to preform this operation."
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
					const { tableId, markdownTable, sourcePath, viewType } =
						this.focused;
					const { tableModel, tableSettings } =
						this.settings.data[sourcePath][tableId];
					const newData = addRow(tableModel);
					await saveTableState(
						this,
						newData,
						tableSettings,
						tableId,
						markdownTable,
						sourcePath,
						viewType
					);
				} else {
					new Notice(
						"No table focused. Please click a table to preform this operation."
					);
				}
			},
		});
	}

	focusTable = ({
		tableId,
		markdownTable,
		sourcePath,
		viewType,
	}: FocusedTable) => {
		this.focused = {
			tableId,
			markdownTable,
			sourcePath,
			viewType,
		};
	};

	blurTable = () => {
		this.focused = null;
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
