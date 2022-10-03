import {
	Plugin,
	Editor,
	MarkdownView,
	Notice,
	TFile,
	MarkdownViewModeType,
} from "obsidian";

import NltSettingsTab from "./NltSettingsTab";

import { NltTable } from "./NltTable";
import { addRow } from "./services/table/row";
import { addColumn } from "./services/table/column";
import { serializeTable, updateSortTime } from "./services/io/serialize";
import { generateNLTCodeBlock } from "./services/random";
import {
	closeAllMenus,
	getTopLevelMenu,
	closeTopLevelMenu,
	timeSinceMenuOpen,
	updateMenuPosition,
} from "./services/menu/menuSlice";
import { store } from "./services/redux/store";
import { TableState } from "./services/table/types";
import _ from "lodash";
import { isMenuId } from "./services/menu/utils";
import { setDarkMode, setDebugMode } from "./services/redux/globalSlice";
import { TABLE_ID_REGEX } from "./services/string/regex";
import MigrationModal from "./MigrationModal";
export interface NltSettings {
	data: {
		[tableId: string]: TableState;
	};
	tableFolder: string;
	viewModeSync: {
		eventType: "update-state" | "sort-rows";
		tableId: string | null;
		viewModes: MarkdownViewModeType[];
	};
	shouldDebug: boolean;
	shouldClear: boolean;
}

export const DEFAULT_SETTINGS: NltSettings = {
	data: {},
	tableFolder: "_notion-like-tables",
	viewModeSync: {
		eventType: "update-state",
		tableId: null,
		viewModes: [],
	},
	shouldClear: true,
	shouldDebug: false,
};
export default class NltPlugin extends Plugin {
	settings: NltSettings;
	focusedTableId: string | null = null;
	layoutChangeTime: number;

	private getViewMode = (el: HTMLElement): MarkdownViewModeType | null => {
		const parent = el.parentElement;
		if (parent) {
			return parent.className.includes("cm-preview-code-block")
				? "source"
				: "preview";
		}
		return null;
	};

	isLivePreviewEnabled() {
		return (this.app.vault as any).config?.livePreview;
	}

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

		this.app.workspace.onLayoutReady(() => {
			this.checkForDarkMode();
			this.checkForDebug();
		});
	}

	private throttleCloseAllMenus = _.throttle(() => {
		store.dispatch(closeAllMenus());
	}, 150);

	private throttlePositionUpdate = _.throttle(() => {
		store.dispatch(updateMenuPosition());
	}, 150);

	private checkForDebug() {
		store.dispatch(setDebugMode(this.settings.shouldDebug));
	}

	private checkForDarkMode() {
		store.dispatch(setDarkMode(this.hasDarkTheme()));
	}

	private hasDarkTheme = () => {
		const el = document.querySelector("body");
		return el.className.includes("theme-dark");
	};

	registerEvents() {
		this.registerEvent(
			this.app.workspace.on("file-open", () => {
				//Clear the focused table
				this.blurTable();

				const livePreviewScroller =
					document.querySelector(".cm-scroller");
				const readingModeScroller = document.querySelector(
					".markdown-preview-view"
				);
				if (livePreviewScroller) {
					livePreviewScroller.addEventListener("scroll", () => {
						this.throttleCloseAllMenus();
						this.throttlePositionUpdate();
					});
				}
				if (readingModeScroller) {
					readingModeScroller.addEventListener("scroll", () => {
						this.throttleCloseAllMenus();
						this.throttlePositionUpdate();
					});
				}
			})
		);

		this.registerEvent(
			this.app.workspace.on("css-change", () => {
				this.checkForDarkMode();
			})
		);

		this.registerEvent(
			this.app.workspace.on("resize", () => {
				this.throttleCloseAllMenus();
				this.throttlePositionUpdate();
			})
		);

		this.registerDomEvent(activeDocument, "keydown", async (e) => {
			if (e.key === "Enter") {
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
							this.focusTable(id);
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
		this.addCommand({
			id: "nlt-migration-tool",
			name: "Migration tool",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "m" }],
			callback: async () => {
				new MigrationModal(this).open();
			},
		});

		this.addCommand({
			id: "nlt-add-table",
			name: "Add table",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "=" }],
			editorCallback: (editor: Editor) => {
				editor.replaceSelection(generateNLTCodeBlock());
			},
		});

		this.addCommand({
			id: "nlt-add-column",
			name: "Add column to focused table",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "\\" }],
			callback: async () => {
				if (this.focusedTableId) {
					const tableId = this.focusedTableId;
					const prevState = this.settings.data[tableId];
					const [updatedModel, updatedSettings] =
						addColumn(prevState);
					const newState = {
						...this.settings.data[tableId],
						model: updatedModel,
						settings: updatedSettings,
					};
					const viewModesToUpdate: MarkdownViewModeType[] = [
						"preview",
					];
					if (this.isLivePreviewEnabled())
						viewModesToUpdate.push("source");
					await serializeTable(
						true,
						this,
						newState,
						tableId,
						viewModesToUpdate
					);
				} else {
					new Notice(
						"No focused table. Please click a table to focus it and retry this operation again."
					);
				}
			},
		});

		this.addCommand({
			id: "nlt-add-row",
			name: "Add row to focused table",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "Enter" }],
			callback: async () => {
				if (this.focusedTableId) {
					const tableId = this.focusedTableId;
					const prevState = this.settings.data[tableId];
					const newState = addRow(prevState);
					const viewModesToUpdate: MarkdownViewModeType[] = [
						"preview",
					];
					if (this.isLivePreviewEnabled())
						viewModesToUpdate.push("source");
					await serializeTable(
						true,
						this,
						newState,
						tableId,
						viewModesToUpdate
					);
				} else {
					new Notice(
						"No focused table. Please click a table to focus it and retry this operation."
					);
				}
			},
		});
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

	static getFiles(): TFile[] {
		return app.vault.getFiles();
	}
}
