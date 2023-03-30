import { Plugin, TFile, MarkdownViewModeType } from "obsidian";

import NLTSettingsTab from "./NLTSettingsTab";

import { updateSortTime } from "./services/io/serialize";
import {
	closeAllMenus,
	getTopLevelMenu,
	closeTopLevelMenu,
	timeSinceMenuOpen,
} from "./services/menu/menuSlice";
import { store } from "./services/redux/store";
import _ from "lodash";
import { isMenuId } from "./services/menu/utils";
import { setDarkMode, setDebugMode } from "./services/redux/globalSlice";
import { NLTView, NOTION_LIKE_TABLES_VIEW } from "./NLTView";
import TableFile, { TABLE_EXTENSION } from "./services/file/TableFile";

export interface NLTSettings {
	viewModeSync: {
		eventType: "update-state" | "sort-rows";
		tableId: string | null;
		viewModes: MarkdownViewModeType[];
	};
	shouldDebug: boolean;
}

export const DEFAULT_SETTINGS: NLTSettings = {
	viewModeSync: {
		eventType: "update-state",
		tableId: null,
		viewModes: [],
	},
	shouldDebug: false,
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

		this.addRibbonIcon(
			"table",
			"Create new Notion-Like table",
			async () => {
				const filePath = await TableFile.createNotionLikeTableFile();
				//Open file in a new tab and set it to active
				await app.workspace.getLeaf(true).setViewState({
					type: NOTION_LIKE_TABLES_VIEW,
					active: true,
					state: { file: filePath },
				});
			}
		);

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
			this.app.workspace.on("file-open", (file) => {
				//Clear the focused table
				// this.blurTable();
				// const livePreviewScroller =
				// 	document.querySelector(".cm-scroller");
				// const readingModeScroller = document.querySelector(
				// 	".markdown-preview-view"
				// );
				// if (livePreviewScroller) {
				// 	livePreviewScroller.addEventListener("scroll", () => {
				// 		store.dispatch(updateMenuPosition());
				// 	});
				// }
				// if (readingModeScroller) {
				// 	readingModeScroller.addEventListener("scroll", () => {
				// 		store.dispatch(updateMenuPosition());
				// 	});
				// }
			})
		);

		this.registerEvent(
			this.app.workspace.on("resize", () => {
				//store.dispatch(updateMenuPosition());
			})
		);

		this.registerEvent(
			this.app.workspace.on("css-change", () => {
				this.checkForDarkMode();
			})
		);

		this.registerDomEvent(activeDocument, "keydown", async (e) => {
			if (e.key === "Enter" || e.key === "Escape") {
				if (this.focusedTableId) {
					const topLevelMenu = getTopLevelMenu(store.getState());
					if (topLevelMenu && topLevelMenu.sortRowsOnClose) {
						updateSortTime(this, this.focusedTableId);
					}
					//TODO should this be in redux?
					//Redux is state between multiple tables on the same page
					store.dispatch(closeTopLevelMenu());
				}
			}
		});

		this.registerDomEvent(activeDocument, "click", (el: any) => {
			const topLevelMenu = getTopLevelMenu(store.getState());
			//Without this, the menu will immediately close on our open click
			const time = timeSinceMenuOpen(store.getState());
			if (topLevelMenu !== null && time > 100) {
				for (let i = 0; i < el.path.length; i++) {
					const element = el.path[i];
					if (element instanceof HTMLElement) {
						const { id } = element;
						if (id === topLevelMenu.id) break;
						if (
							isMenuId(id) ||
							element.className.includes("NLT__app")
						) {
							//If we've clicked in the app but not in the menu
							store.dispatch(closeTopLevelMenu());
							if (
								this.focusedTableId &&
								topLevelMenu.sortRowsOnClose
							)
								updateSortTime(this, this.focusedTableId);
							break;
						}
						//If we're clicking outside of the app
						if (element.className.includes("view-content")) {
							store.dispatch(closeAllMenus());
							if (
								this.focusedTableId &&
								topLevelMenu.sortRowsOnClose
							)
								updateSortTime(this, this.focusedTableId);
							break;
						}
					}
				}
			} else {
				for (let i = 0; i < el.path.length; i++) {
					const element = el.path[i];
					if (element instanceof HTMLElement) {
						//If we've clicked in an app
						if (element.className.includes("NLT__app")) {
							const id = element.getAttribute("data-id");
							if (id) this.focusTable(id);
							break;
						}
						//If we're clicking outside of the app
						if (element.className.includes("view-content")) {
							this.blurTable();
							break;
						}
					}
				}
			}
		});
	}

	registerCommands() {
		// this.addCommand({
		// 	id: "nlt-create-table",
		// 	name: "Create new Notion-Like Table",
		// 	hotkeys: [{ modifiers: ["Mod", "Shift"], key: "=" }],
		// 	callback: async () => {
		// 	},
		// });
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

	focusTable = (tableId: string) => {
		this.focusedTableId = tableId;
	};

	blurTable = () => {
		this.focusedTableId = null;
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
		this.app.workspace.detachLeavesOfType(NOTION_LIKE_TABLES_VIEW);
	}

	static getFiles(): TFile[] {
		return app.vault.getFiles();
	}
}
