import { Plugin } from "obsidian";

import NLTSettingsTab from "./NLTSettingsTab";

import { store } from "./services/redux/store";
import { setDarkMode, setDebugMode } from "./services/redux/globalSlice";
import { NLTView, NOTION_LIKE_TABLES_VIEW } from "./NLTView";
import TableFile, { TABLE_EXTENSION, getAvailableTablePath } from "./services/file/TableFile";

export interface NLTSettings {
	shouldDebug: boolean;

	// If true, new tables will be created in the attachments folder define in 
	// Obsidian settings. Otherwise, the `customFolderForNewTables` value will
	// be used.
	createAtObsidianAttachmentFolder: boolean;

	// Custom location for newly created tables. If the value is an empty string,
	// the root vault folder will be used.
	customFolderForNewTables: string;

	// If true, new tables will be named as ${activeFileName}-${timestamp}. However,
	// if no file has been opened, creating a new table will still use the default
	// table name.
	nameWithActiveFileNameAndTimestamp: boolean;
}

export const DEFAULT_SETTINGS: NLTSettings = {
	shouldDebug: false,
	createAtObsidianAttachmentFolder: true,
	customFolderForNewTables: '',
	nameWithActiveFileNameAndTimestamp: false,
};
export default class NLTPlugin extends Plugin {
	settings: NLTSettings;
	focusedTableId: string | null = null;
	layoutChangeTime: number;

	/**
	 * Called on plugin load.
	 * This can be when the plugin is enabled or Obsidian is first opened.
	 */
	async onload() {
		await this.loadSettings();
		//Make sure settings are valid
		this.validateSettings();

		this.registerView(NOTION_LIKE_TABLES_VIEW, (leaf) => new NLTView(leaf));
		this.registerExtensions([TABLE_EXTENSION], NOTION_LIKE_TABLES_VIEW);

		this.addRibbonIcon("table", "Create Notion-Like table", async () => {
			await this.createTableFile();
		});

		this.addSettingTab(new NLTSettingsTab(this.app, this));
		this.registerCommands();
		this.registerEvents();

		this.app.workspace.onLayoutReady(() => {
			this.checkForDarkMode();
			this.checkForDebug();
		});
	}

	//TODO validate settings
	validateSettings() {
		const {} = this.settings;
	}

	private async createTableFile() {
		const tableFile = await TableFile.createNotionLikeTableFile(
			await getAvailableTablePath(this.settings)
		);
		//Open file in a new tab and set it to active
		await app.workspace.getLeaf(true).setViewState({
			type: NOTION_LIKE_TABLES_VIEW,
			active: true,
			state: { file: tableFile.path },
		});
	}

	private checkForDebug() {
		store.dispatch(setDebugMode(this.settings.shouldDebug));
	}

	private checkForDarkMode() {
		store.dispatch(setDarkMode(this.hasDarkTheme()));
	}

	private hasDarkTheme = () => {
		const el = document.querySelector("body");
		if (el) {
			return el.className.includes("theme-dark");
		}
		return false;
	};

	registerEvents() {
		this.registerEvent(
			this.app.workspace.on("css-change", () => {
				this.checkForDarkMode();
			})
		);
	}

	registerCommands() {
		this.addCommand({
			id: "nlt-create-table",
			name: "Create table",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "=" }],
			callback: async () => {
				this.createTableFile();
			},
		});
		//TODO implement
		// this.addCommand({
		// 	id: "nlt-add-column",
		// 	name: "Add column to focused table",
		// 	hotkeys: [{ modifiers: ["Mod", "Shift"], key: "\\" }],
		// 	callback: async () => {
		// 	},
		// });
		//TODO implement
		// this.addCommand({
		// 	id: "nlt-add-row",
		// 	name: "Add row to focused table",
		// 	hotkeys: [{ modifiers: ["Mod", "Shift"], key: "Enter" }],
		// 	callback: async () => {
		// 	},
		// });
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
		this.app.workspace.detachLeavesOfType(NOTION_LIKE_TABLES_VIEW);
	}
}
