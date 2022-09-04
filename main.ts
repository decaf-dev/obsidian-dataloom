import {
	Plugin,
	Editor,
	MarkdownView,
	Notice,
	MarkdownSectionInformation,
} from "obsidian";

import { NLTTable } from "src/NltTable";
import { NltSettings, DEFAULT_SETTINGS } from "src/services/settings";
import { addRow, addColumn } from "src/services/appData/internal/add";
import { saveAppData } from "src/services/appData/external/save";
import { createEmptyMarkdownTable } from "src/services/appData/mock";
import { ViewType } from "src/services/appData/state/saveState";
import NltSettingsTab from "./NltSettingsTab";

interface FocusedTable {
	tableIndex: string;
	sectionInfo: MarkdownSectionInformation;
	sourcePath: string;
	viewType: ViewType;
}
export default class NltPlugin extends Plugin {
	settings: NltSettings;
	focused: FocusedTable | null = null;

	/**
	 * Called on plugin load.
	 * This can be when the plugin is enabled or Obsidian is first opened.
	 */
	async onload() {
		await this.loadSettings();
		await this.forcePostProcessorReload();

		this.registerMarkdownPostProcessor((element, context) => {
			const sectionInfo = context.getSectionInfo(element);
			if (sectionInfo) {
				const table = element.getElementsByTagName("table");
				if (table.length === 1) {
					context.addChild(
						new NLTTable(
							element,
							this,
							sectionInfo,
							context.sourcePath
						)
					);
				}
			}
		});

		this.addSettingTab(new NltSettingsTab(this.app, this));
		this.registerCommands();
		this.registerEvents();
	}

	registerEvents() {
		//Our persisted data uses a key of the file path and then stores an object mapping
		//to a table id and an AppData object.
		//If the file path changes, we want to update our cache so that the data is still accessible.
		this.registerEvent(
			this.app.vault.on("rename", (file, oldPath) => {
				if (this.settings.state[oldPath]) {
					const newPath = file.path;
					const data = { ...this.settings.state[oldPath] };
					delete this.settings.state[oldPath];
					this.settings.state[newPath] = data;
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
					const { tableIndex, sectionInfo, sourcePath, viewType } =
						this.focused;
					const oldData =
						this.settings.state[sourcePath][tableIndex].data;
					const newData = addColumn(oldData);
					await saveAppData(
						this,
						newData,
						tableIndex,
						sectionInfo,
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
					const { tableIndex, sectionInfo, sourcePath, viewType } =
						this.focused;
					const oldData =
						this.settings.state[sourcePath][tableIndex].data;
					const newData = addRow(oldData);
					await saveAppData(
						this,
						newData,
						tableIndex,
						sectionInfo,
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
		tableIndex,
		sectionInfo,
		sourcePath,
		viewType,
	}: FocusedTable) => {
		this.focused = {
			tableIndex,
			sectionInfo,
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
