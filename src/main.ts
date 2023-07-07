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
import {
	CURRENT_FILE_EXTENSION,
	PREVIOUS_FILE_EXTENSION,
	WIKI_LINK_REGEX,
} from "./data/constants";
import { createDashboardFile } from "src/data/dashboard-file";
import {
	EVENT_COLUMN_ADD,
	EVENT_COLUMN_DELETE,
	EVENT_DOWNLOAD_CSV,
	EVENT_DOWNLOAD_MARKDOWN,
	EVENT_OUTSIDE_CLICK,
	EVENT_OUTSIDE_KEYDOWN,
	EVENT_REFRESH_DASHBOARDS,
	EVENT_ROW_ADD,
	EVENT_ROW_DELETE,
} from "./shared/events";
import { editingViewPlugin } from "./obsidian/editing-view-plugin";
import {
	deserializeDashboardState,
	serializeDashboardState,
} from "./data/serialize-dashboard-state";
import { updateLinkReferences } from "./data/utils";
import { getBasename } from "./shared/link/link-utils";
import { hasDarkTheme } from "./shared/render/utils";
import { removeFocusVisibleClass } from "./shared/menu/focus-visible";
import { DashboardState } from "./shared/types";
import WelcomeModal from "./obsidian/welcome-modal";
import WhatsNewModal from "./obsidian/whats-new-modal";

export interface DashboardsSettings {
	shouldDebug: boolean;
	createAtObsidianAttachmentFolder: boolean;
	customFolderForNewFiles: string;
	exportRenderMarkdown: boolean;
	defaultEmbedWidth: string;
	defaultEmbedHeight: string;
	hasMigratedTo700: boolean;
	showWelcomeModal: boolean;
	pluginVersion: string;
}

export const DEFAULT_SETTINGS: DashboardsSettings = {
	shouldDebug: false,
	createAtObsidianAttachmentFolder: false,
	customFolderForNewFiles: "",
	exportRenderMarkdown: true,
	defaultEmbedWidth: "100%",
	defaultEmbedHeight: "340px",
	hasMigratedTo700: false,
	showWelcomeModal: true,
	pluginVersion: "",
};

/**
 * The plugin id is the id used in the manifest.json file
 * We use the old plugin id to maintain our download count
 */
export const DASHBOARDS_PLUGIN_ID = "notion-like-tables";

export default class DashboardsPlugin extends Plugin {
	settings: DashboardsSettings;

	/**
	 * Called on plugin load.
	 * This can be when the plugin is enabled or Obsidian is first opened.
	 */
	async onload() {
		await this.loadSettings();

		this.registerView(DASHBOARDS_VIEW, (leaf) => new DashboardsView(leaf));
		this.registerExtensions([CURRENT_FILE_EXTENSION], DASHBOARDS_VIEW);

		this.addRibbonIcon("table", "Create new dashboard", async () => {
			await this.newDashboardFile(null);
		});

		this.addSettingTab(new DashboardsSettingsTab(this.app, this));
		this.registerEmbeddedView();
		this.registerCommands();
		this.registerEvents();
		this.registerDOMEvents();

		this.app.workspace.onLayoutReady(async () => {
			const isDark = hasDarkTheme();
			store.dispatch(setDarkMode(isDark));

			await this.migrateTableFiles();
		});

		if (this.settings.showWelcomeModal) {
			new WelcomeModal(app).open();
			this.settings.showWelcomeModal = false;
			await this.saveSettings();
		} else if (this.settings.pluginVersion !== this.manifest.version) {
			new WhatsNewModal(this.app).open();
			this.settings.pluginVersion = this.manifest.version;
			await this.saveSettings();
		}
	}

	private async migrateTableFiles() {
		// Migrate .table files to .dashboard files
		if (!this.settings.hasMigratedTo700) {
			const tableFiles = this.app.vault
				.getFiles()
				.filter((file) => file.extension === PREVIOUS_FILE_EXTENSION);

			for (let i = 0; i < tableFiles.length; i++) {
				const file = tableFiles[i];
				const newFilePath = file.path.replace(
					`.${PREVIOUS_FILE_EXTENSION}`,
					`.${CURRENT_FILE_EXTENSION}`
				);
				try {
					await this.app.vault.rename(file, newFilePath);
				} catch (err) {
					new Notice(
						`Failed renaming ${file.path} to ${newFilePath}`
					);
					new Notice("Please rename this file manually");
				}
			}
			this.settings.hasMigratedTo700 = true;
			await this.saveSettings();
		}
	}

	private registerEmbeddedView() {
		//This registers a CodeMirror extension. It is used to render the embedded
		//table in live preview mode.
		this.registerEditorExtension(editingViewPlugin);

		//This registers a Markdown post processor. It is used to render the embedded
		//table in preview mode.
		// this.registerMarkdownPostProcessor((element, context) => {
		// 	const embeddedTableLinkEls = getEmbeddedDashboardLinkEls(element);
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

	private async newDashboardFile(
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
			folderPath = this.settings.customFolderForNewFiles;
		}

		const filePath = await createDashboardFile({
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
						item.setTitle("New dashboard")
							.setIcon("document")
							.onClick(async () => {
								await this.newDashboardFile(file.path);
							});
					});
				}
			})
		);

		this.app.vault.on(
			"rename",
			async (file: TAbstractFile, oldPath: string) => {
				if (file instanceof TFile) {
					const dashboardFiles = this.app.vault
						.getFiles()
						.filter(
							(file) => file.extension === CURRENT_FILE_EXTENSION
						);

					const dashboardsToUpdate: {
						file: TFile;
						state: DashboardState;
					}[] = [];

					let numLinks = 0;
					for (const dashboardFile of dashboardFiles) {
						//For each file read its contents
						const data = await file.vault.read(dashboardFile);
						const state = deserializeDashboardState(data);
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
									const found = dashboardsToUpdate.find(
										(table) =>
											table.file.path ===
											dashboardFile.path
									);
									if (!found) {
										dashboardsToUpdate.push({
											file: dashboardFile,
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
							} in ${dashboardsToUpdate.length} Dashboard file${
								dashboardsToUpdate.length > 1 ? "s" : ""
							}.`
						);
					}

					for (let i = 0; i < dashboardsToUpdate.length; i++) {
						//If the state has changed, update the file
						const { file: tableFile, state } =
							dashboardsToUpdate[i];

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
								serializeDashboardState(newState);

							await file.vault.modify(tableFile, serializedState);

							//Update all tables that match this path
							app.workspace.trigger(
								EVENT_REFRESH_DASHBOARDS,
								tableFile.path,
								-1, //update all tables that match this path
								newState
							);
						}
					}
				}
			}
		);
	}

	registerCommands() {
		this.addCommand({
			id: "dashboards-create",
			name: "Create dashboard",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "=" }],
			callback: async () => {
				await this.newDashboardFile(null);
			},
		});

		this.addCommand({
			id: "dashboards-create-and-embed",
			name: "Create dashboard and embed it into current file",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "+" }],
			editorCallback: async (editor) => {
				const filePath = await this.newDashboardFile(null, true);
				if (!filePath) return;

				const useMarkdownLinks = (this.app.vault as any).getConfig(
					"useMarkdownLinks"
				);

				// Use basename rather than whole name when using Markdownlink like ![abcd](abcd.dashboard) instead of ![abcd.dashboard](abcd.dashboard)
				// It will replace `.dashboard` to "" in abcd.dashboard
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
