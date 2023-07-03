import {
	MarkdownView,
	Notice,
	Plugin,
	TAbstractFile,
	TFile,
	TFolder,
} from "obsidian";

import DashboardsSettingsTab from "./obsidian/dashboards-settings-tab";

import { store } from "./redux/global/store";
import { setDarkMode, setSettings } from "./redux/global/global-slice";
import DashboardsView, { DASHBOARDS_VIEW } from "./obsidian/dashboards-view";
import { TABLE_EXTENSION, WIKI_LINK_REGEX } from "./data/constants";
import { createTableFile } from "src/data/table-file";
import {
	EVENT_COLUMN_ADD,
	EVENT_COLUMN_DELETE,
	EVENT_DOWNLOAD_CSV,
	EVENT_DOWNLOAD_MARKDOWN,
	EVENT_OUTSIDE_CLICK,
	EVENT_OUTSIDE_KEYDOWN,
	EVENT_REFRESH_TABLES,
	EVENT_ROW_ADD,
	EVENT_ROW_DELETE,
} from "./shared/events";
import { editingViewPlugin } from "./obsidian/editing-view-plugin";
import {
	deserializeTableState,
	serializeTableState,
} from "./data/serialize-table-state";
import { updateLinkReferences } from "./data/utils";
import { getBasename } from "./shared/link/link-utils";
import { hasDarkTheme } from "./shared/render/utils";
import { removeFocusVisibleClass } from "./shared/menu/focus-visible";
import { TableState } from "./shared/types";

export interface DashboardsSettings {
	shouldDebug: boolean;
	createAtObsidianAttachmentFolder: boolean;
	customFolderForNewTables: string;
	exportRenderMarkdown: boolean;
	defaultEmbedWidth: string;
	defaultEmbedHeight: string;
}

export const DEFAULT_SETTINGS: DashboardsSettings = {
	shouldDebug: false,
	createAtObsidianAttachmentFolder: false,
	customFolderForNewTables: "",
	exportRenderMarkdown: true,
	defaultEmbedWidth: "100%",
	defaultEmbedHeight: "340px",
};

export default class DashboardsPlugin extends Plugin {
	settings: DashboardsSettings;

	/**
	 * Called on plugin load.
	 * This can be when the plugin is enabled or Obsidian is first opened.
	 */
	async onload() {
		await this.loadSettings();

		this.registerView(DASHBOARDS_VIEW, (leaf) => new DashboardsView(leaf));
		this.registerExtensions([TABLE_EXTENSION], DASHBOARDS_VIEW);

		this.addRibbonIcon("table", "Create Notion-Like table", async () => {
			await this.newTableFile(null);
		});

		this.addSettingTab(new DashboardsSettingsTab(this.app, this));
		this.registerEmbeddedView();
		this.registerCommands();
		this.registerEvents();
		this.registerDOMEvents();
	}

	private registerEmbeddedView() {
		//This registers a CodeMirror extension. It is used to render the embedded
		//table in live preview mode.
		this.registerEditorExtension(editingViewPlugin);

		//This registers a Markdown post processor. It is used to render the embedded
		//table in preview mode.
		// this.registerMarkdownPostProcessor((element, context) => {
		// 	const embeddedTableLinkEls = getEmbeddedTableLinkEls(element);
		// 	for (let i = 0; i < embeddedTableLinkEls.length; i++) {
		// 		const linkEl = embeddedTableLinkEls[i];
		// 		context.addChild(
		// 			new DashboardsReadingChild(
		// 				linkEl,
		// 				linkEl.getAttribute("src")!
		// 			)
		// 		);
		// 	}
		// });
	}

	private async newTableFile(
		contextMenuFolderPath: string | null,
		embedded?: boolean
	) {
		let folderPath = "";
		if (contextMenuFolderPath) {
			folderPath = contextMenuFolderPath;
		} else if (this.settings.createAtObsidianAttachmentFolder) {
			folderPath = (this.app.vault as any).getConfig(
				"attachmentFolderPath"
			);
		} else {
			folderPath = this.settings.customFolderForNewTables;
		}

		const filePath = await createTableFile({
			folderPath,
		});
		if (embedded) return filePath;
		//Open file in a new tab and set it to active
		await app.workspace.getLeaf(true).setViewState({
			type: DASHBOARDS_VIEW,
			active: true,
			state: { file: filePath },
		});
	}

	private registerDOMEvents() {
		//This event is guaranteed to fire after our React synthetic event handlers
		this.registerDomEvent(document, "click", () => {
			if (this.settings.shouldDebug) console.log("main handleClick");

			//Clear the focus-visible class from the last focused element
			removeFocusVisibleClass();
			this.app.workspace.trigger(EVENT_OUTSIDE_CLICK);
		});

		//This event is guaranteed to fire after our React synthetic event handlers
		this.registerDomEvent(document, "keydown", (e) => {
			if (this.settings.shouldDebug) console.log("main handleKeyDown");
			this.app.workspace.trigger(EVENT_OUTSIDE_KEYDOWN, e);
		});
	}

	private registerEvents() {
		this.registerEvent(
			this.app.workspace.on("css-change", () => {
				const isDark = hasDarkTheme();
				store.dispatch(setDarkMode(isDark));
			})
		);

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				if (file instanceof TFolder) {
					menu.addItem((item) => {
						item.setTitle("New Notion-Like table")
							.setIcon("document")
							.onClick(async () => {
								await this.newTableFile(file.path);
							});
					});
				}
			})
		);

		this.app.vault.on(
			"rename",
			async (file: TAbstractFile, oldPath: string) => {
				if (file instanceof TFile) {
					const vaultTableFiles = this.app.vault
						.getFiles()
						.filter((file) => file.extension === TABLE_EXTENSION);

					const tablesToUpdate: {
						file: TFile;
						state: TableState;
					}[] = [];

					let numLinks = 0;
					for (const tableFile of vaultTableFiles) {
						//For each file read its contents
						const data = await file.vault.read(tableFile);
						const state = deserializeTableState(data);
						//Search for old path in the file

						state.model.bodyCells.forEach((cell) => {
							const regex = structuredClone(WIKI_LINK_REGEX);
							let matches;
							while (
								(matches = regex.exec(cell.markdown)) !== null
							) {
								const path = matches[1];

								//The path will be the relative path e.g. mytable.table
								//while the old path will be the absolute path in the vault e.g. /tables/mytables.table
								if (oldPath.includes(path)) {
									const found = tablesToUpdate.find(
										(table) =>
											table.file.path === tableFile.path
									);
									if (!found) {
										tablesToUpdate.push({
											file: tableFile,
											state,
										});
									}
									numLinks++;
								}
							}
						});
					}

					if (numLinks > 0) {
						new Notice(
							`Updating ${numLinks} link${
								numLinks > 1 ? "s" : ""
							} in ${
								tablesToUpdate.length
							} Notion-Like Table file${
								tablesToUpdate.length > 1 ? "s" : ""
							}.`
						);
					}

					for (let i = 0; i < tablesToUpdate.length; i++) {
						//If the state has changed, update the file
						const { file: tableFile, state } = tablesToUpdate[i];

						if (this.settings.shouldDebug)
							console.log("Updating links in file", {
								path: tableFile.path,
							});

						const newState = structuredClone(state);
						newState.model.bodyCells.map((cell) => {
							const updatedMarkdown = updateLinkReferences(
								cell.markdown,
								file.path,
								oldPath
							);
							if (cell.markdown !== updatedMarkdown) {
								if (this.settings.shouldDebug) {
									console.log("Updated link", {
										oldLink: cell.markdown,
										newLink: updatedMarkdown,
									});
								}
							}

							cell.markdown = updatedMarkdown;
						});

						if (
							JSON.stringify(state) !== JSON.stringify(newState)
						) {
							const serializedState =
								serializeTableState(newState);

							await file.vault.modify(tableFile, serializedState);

							//Update all tables that match this path
							app.workspace.trigger(
								EVENT_REFRESH_TABLES,
								tableFile.path,
								-1, //update all tables that match this path
								newState
							);
						}
					}
				}
			}
		);

		this.app.workspace.onLayoutReady(() => {
			const isDark = hasDarkTheme();
			store.dispatch(setDarkMode(isDark));
		});
	}

	registerCommands() {
		this.addCommand({
			id: "nlt-create-table",
			name: "Create table",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "=" }],
			callback: async () => {
				await this.newTableFile(null);
			},
		});

		this.addCommand({
			id: "nlt-create-table-and-embed",
			name: "Create table and embed it into current file",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "+" }],
			editorCallback: async (editor) => {
				const filePath = await this.newTableFile(null, true);
				if (!filePath) return;

				const useMarkdownLinks = (this.app.vault as any).getConfig(
					"useMarkdownLinks"
				);

				// Use basename rather than whole name when using Markdownlink like ![abcd](abcd.table) instead of ![abcd.table](abcd.table)
				// It will replace `.table` to "" in abcd.table
				const linkText = useMarkdownLinks
					? `![${getBasename(filePath)}](${encodeURI(filePath)})`
					: `![[${filePath}]]`;

				editor.replaceRange(linkText, editor.getCursor());
				editor.setCursor(
					editor.getCursor().line,
					editor.getCursor().ch + linkText.length
				);
			},
		});

		this.addCommand({
			id: "nlt-add-column",
			name: "Add column",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "\\" }],
			checkCallback: (checking: boolean) => {
				const nltView =
					this.app.workspace.getActiveViewOfType(DashboardsView);
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (nltView || markdownView) {
					if (!checking) {
						this.app.workspace.trigger(EVENT_COLUMN_ADD);
					}
					return true;
				}
				return false;
			},
		});

		this.addCommand({
			id: "nlt-delete-column",
			name: "Delete column",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "Backspace" }],
			checkCallback: (checking: boolean) => {
				const nltView =
					this.app.workspace.getActiveViewOfType(DashboardsView);
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (nltView || markdownView) {
					if (!checking) {
						this.app.workspace.trigger(EVENT_COLUMN_DELETE);
					}
					return true;
				}
				return false;
			},
		});

		this.addCommand({
			id: "nlt-add-row",
			name: "Add row",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "Enter" }],
			checkCallback: (checking: boolean) => {
				const nltView =
					this.app.workspace.getActiveViewOfType(DashboardsView);
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (nltView || markdownView) {
					if (!checking) this.app.workspace.trigger(EVENT_ROW_ADD);
					return true;
				}
				return false;
			},
		});

		this.addCommand({
			id: "nlt-row-column",
			name: "Delete row",
			hotkeys: [{ modifiers: ["Alt", "Shift"], key: "Backspace" }],
			checkCallback: (checking: boolean) => {
				const nltView =
					this.app.workspace.getActiveViewOfType(DashboardsView);
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (nltView || markdownView) {
					if (!checking) {
						this.app.workspace.trigger(EVENT_ROW_DELETE);
					}
					return true;
				}
				return false;
			},
		});

		this.addCommand({
			id: "nlt-export-markdown",
			name: "Export as markdown",
			checkCallback: (checking: boolean) => {
				const nltView =
					this.app.workspace.getActiveViewOfType(DashboardsView);
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (nltView || markdownView) {
					if (!checking) {
						this.app.workspace.trigger(EVENT_DOWNLOAD_MARKDOWN);
					}
					return true;
				}
				return false;
			},
		});

		this.addCommand({
			id: "nlt-export-csv",
			name: "Export as CSV",
			checkCallback: (checking: boolean) => {
				const nltView =
					this.app.workspace.getActiveViewOfType(DashboardsView);
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (nltView || markdownView) {
					if (!checking) {
						this.app.workspace.trigger(EVENT_DOWNLOAD_CSV);
					}
					return true;
				}
				return false;
			},
		});
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
		store.dispatch(setSettings({ ...this.settings }));
	}

	async saveSettings() {
		await this.saveData(this.settings);
		store.dispatch(setSettings({ ...this.settings }));
	}

	/**
	 * Called on plugin unload.
	 * This can be when the plugin is disabled or Obsidian is closed.
	 */
	async onunload() {
		this.app.workspace.detachLeavesOfType(DASHBOARDS_VIEW);
	}
}
