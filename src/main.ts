import {
	Plugin,
	Editor,
	MarkdownView,
	Notice,
	MarkdownViewModeType,
} from "obsidian";

import NltSettingsTab from "./NltSettingsTab";

import { NltTable } from "./NltTable";
import { addRow, addColumn } from "./services/internal/add";
import { serializeTable } from "./services/io/serialize";
import { createEmptyMarkdownTable } from "./services/random";
import { TableState } from "./services/table/types";

export interface NltSettings {
	data: {
		[tableIndex: string]: TableState;
	};
	tableFolder: string;
	dirty: {
		viewMode: MarkdownViewModeType;
		tableId: string;
	} | null;
	syncInterval: number;
}

export const DEFAULT_SETTINGS: NltSettings = {
	data: {},
	tableFolder: "_notion-like-tables",
	dirty: null,
	syncInterval: 2000,
};

interface FocusedTable {
	tableId: string;
}
export default class NltPlugin extends Plugin {
	settings: NltSettings;
	focused: FocusedTable | null = null;

	private getViewMode = (el: HTMLElement): MarkdownViewModeType | null => {
		const parent = el.parentElement;
		if (parent) {
			return parent.className.includes("cm-preview-code-block")
				? "source"
				: "preview";
		}
		return null;
	};

	/**
	 * Called on plugin load.
	 * This can be when the plugin is enabled or Obsidian is first opened.
	 */
	async onload() {
		await this.loadSettings();
		await this.forcePostProcessorReload();

		this.registerMarkdownCodeBlockProcessor(
			"notion-like-tables",
			(source, el, ctx) => {
				const TABLE_ID_REGEX = new RegExp(/^table-id-[a-zA-Z0-9_-]+$/);
				const text = source.trim();
				const tableId = text.match(TABLE_ID_REGEX) ? text : null;
				if (tableId) {
					const viewMode = this.getViewMode(el);
					if (viewMode) {
						ctx.addChild(new NltTable(el, this, tableId, viewMode));
					}
				}
			}
		);

		this.addSettingTab(new NltSettingsTab(this.app, this));
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
					const { tableId } = this.focused;
					const { model, settings } = this.settings.data[tableId];
					const [updatedModel, updatedSettings] = addColumn(
						model,
						settings
					);
					await serializeTable(
						true,
						this,
						updatedModel,
						updatedSettings,
						tableId
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
					const { tableId } = this.focused;
					const { model, settings } = this.settings.data[tableId];
					const newData = addRow(model);
					await serializeTable(
						true,
						this,
						newData,
						settings,
						tableId
					);
				} else {
					new Notice(
						"No table focused. Please click a table to preform this operation."
					);
				}
			},
		});
	}

	focusTable = ({ tableId }: FocusedTable) => {
		this.focused = {
			tableId,
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
