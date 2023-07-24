import {
	MarkdownView,
	Notice,
	Plugin,
	TAbstractFile,
	TFile,
	TFolder,
	normalizePath,
} from "obsidian";

import { store } from "./redux/global/store";
import { setDarkMode, setSettings } from "./redux/global/global-slice";
import DataLoomView, { DATA_LOOM_VIEW } from "./obsidian/dataloom-view";
import { FILE_EXTENSION, WIKI_LINK_REGEX } from "./data/constants";
import { createLoomFile } from "src/data/loom-file";
import {
	EVENT_COLUMN_ADD,
	EVENT_COLUMN_DELETE,
	EVENT_DOWNLOAD_CSV,
	EVENT_DOWNLOAD_MARKDOWN,
	EVENT_OUTSIDE_CLICK,
	EVENT_OUTSIDE_KEYDOWN,
	EVENT_REFRESH_APP,
	EVENT_REFRESH_EDITING_VIEW,
	EVENT_ROW_ADD,
	EVENT_ROW_DELETE,
} from "./shared/events";
import { editingViewPlugin } from "./obsidian/editing-view-plugin";
import {
	deserializeLoomState,
	serializeLoomState,
} from "./data/serialize-loom-state";
import { updateLinkReferences } from "./data/utils";
import { getBasename } from "./shared/link/link-utils";
import { hasDarkTheme } from "./shared/render/utils";
import { removeFocusVisibleClass } from "./shared/menu/focus-visible";
import { LoomState } from "./shared/types";
import WelcomeModal from "./obsidian/welcome-modal";
import WhatsNewModal from "./obsidian/whats-new-modal";
import DataLoomSettingsTab from "./obsidian/dataloom-settings-tab";
import {
	loadPreviewModeApps,
	purgeEmbeddedLoomApps,
} from "./obsidian/embedded-app-manager";

export interface DataLoomSettings {
	shouldDebug: boolean;
	createAtObsidianAttachmentFolder: boolean;
	customFolderForNewFiles: string;
	exportRenderMarkdown: boolean;
	defaultEmbedWidth: string;
	defaultEmbedHeight: string;
	hasMigratedTo800: boolean;
	showWelcomeModal: boolean;
	pluginVersion: string;
}

export const DEFAULT_SETTINGS: DataLoomSettings = {
	shouldDebug: false,
	createAtObsidianAttachmentFolder: false,
	customFolderForNewFiles: "",
	exportRenderMarkdown: true,
	defaultEmbedWidth: "100%",
	defaultEmbedHeight: "340px",
	hasMigratedTo800: false,
	showWelcomeModal: true,
	pluginVersion: "",
};

/**
 * The plugin id is the id used in the manifest.json file
 * We use the old plugin id to maintain our download count
 */
export const DATA_LOOM_PLUGIN_ID = "notion-like-tables";

export default class DataLoomPlugin extends Plugin {
	settings: DataLoomSettings;

	/**
	 * Called on plugin load.
	 * This can be when the plugin is enabled or Obsidian is first opened.
	 */
	async onload() {
		await this.loadSettings();

		this.registerView(DATA_LOOM_VIEW, (leaf) => new DataLoomView(leaf));
		this.registerExtensions([FILE_EXTENSION], DATA_LOOM_VIEW);

		this.addRibbonIcon("table", "Create new loom", async () => {
			await this.newLoomFile(null);
		});

		this.addSettingTab(new DataLoomSettingsTab(this.app, this));
		this.registerEmbeddedView();
		this.registerCommands();
		this.registerEvents();
		this.registerDOMEvents();

		this.app.workspace.onLayoutReady(async () => {
			const isDark = hasDarkTheme();
			store.dispatch(setDarkMode(isDark));

			await this.migrateLoomFiles();
		});

		if (this.settings.pluginVersion !== this.manifest.version) {
			//Don't show updates for the first install
			//unless you have already downloaded the plugin

			//Since current users won't have a plugin version set, we will disable this
			//until maybe 8.2.0 or 8.3.0
			//if (this.settings.pluginVersion !== "") {
			new WhatsNewModal(this.app).open();
			//}
		}

		if (this.settings.showWelcomeModal) {
			new WelcomeModal(app).open();
			this.settings.showWelcomeModal = false;
			await this.saveSettings();
		}

		this.settings.pluginVersion = this.manifest.version;
		await this.saveSettings();
	}

	private async migrateLoomFiles() {
		// Migrate .dashboard files to .loom files
		if (!this.settings.hasMigratedTo800) {
			const loomFiles = this.app.vault
				.getFiles()
				.filter(
					(file) =>
						file.extension === "dashboard" ||
						file.extension === "table"
				);

			for (let i = 0; i < loomFiles.length; i++) {
				const file = loomFiles[i];
				const newFilePath = file.path.replace(
					`.${file.extension}`,
					`.${FILE_EXTENSION}`
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
			this.settings.hasMigratedTo800 = true;
			await this.saveSettings();
		}
	}

	private registerEmbeddedView() {
		//This registers a CodeMirror extension. It is used to render the embedded
		//loom in live preview mode.
		this.registerEditorExtension(editingViewPlugin);
	}

	private getFolderForNewLoomFile(contextMenuFolderPath: string | null) {
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
		const normalized = normalizePath(folderPath);
		if (normalized === ".") return "/";
		return normalized;
	}

	private async newLoomFile(
		contextMenuFolderPath: string | null,
		embedded?: boolean
	) {
		const folderPath = this.getFolderForNewLoomFile(contextMenuFolderPath);
		const filePath = await createLoomFile(folderPath);

		//If the file is embedded, we don't need to open it
		if (embedded) return filePath;

		//Open file in a new tab and set it to active
		await app.workspace.getLeaf(true).setViewState({
			type: DATA_LOOM_VIEW,
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

		//This event is fired whenever a leaf is opened, close, moved,
		//or the user switches between editing and preview mode
		this.registerEvent(
			this.app.workspace.on("layout-change", () => {
				const leaves = this.app.workspace.getLeavesOfType("markdown");

				purgeEmbeddedLoomApps(leaves);
				//Wait for the DOM to update before loading the preview mode apps
				setTimeout(() => {
					loadPreviewModeApps(leaves);
				}, 0);
			})
		);

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				if (file instanceof TFolder) {
					menu.addItem((item) => {
						item.setTitle("New loom")
							.setIcon("document")
							.onClick(async () => {
								await this.newLoomFile(file.path);
							});
					});
				}
			})
		);

		this.app.vault.on(
			"rename",
			async (file: TAbstractFile, oldPath: string) => {
				//When a file is renamed, we want to refresh all open leafs
				//that contain an embedded loom
				const leafs = app.workspace.getLeavesOfType("markdown");
				leafs.forEach((leaf) => {
					leaf.trigger(EVENT_REFRESH_EDITING_VIEW);
				});

				if (file instanceof TFile) {
					const loomFiles = this.app.vault
						.getFiles()
						.filter((file) => file.extension === FILE_EXTENSION);

					const loomsToUpdate: {
						file: TFile;
						state: LoomState;
					}[] = [];

					let numLinks = 0;
					for (const loomFile of loomFiles) {
						//For each file read its contents
						const data = await file.vault.read(loomFile);
						const state = deserializeLoomState(data);
						//Search for old path in the file

						state.model.bodyCells.forEach((cell) => {
							const regex = structuredClone(WIKI_LINK_REGEX);
							let matches;
							while (
								(matches = regex.exec(cell.markdown)) !== null
							) {
								const path = matches[1];

								//The path will be the relative path e.g. filename.loom
								//while the old path will be the absolute path in the vault e.g. /looms/filename.loom
								if (oldPath.includes(path)) {
									const found = loomsToUpdate.find(
										(loom) =>
											loom.file.path === loomFile.path
									);
									if (!found) {
										loomsToUpdate.push({
											file: loomFile,
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
							} in ${loomsToUpdate.length} loom file${
								loomsToUpdate.length > 1 ? "s" : ""
							}.`
						);
					}

					for (let i = 0; i < loomsToUpdate.length; i++) {
						//If the state has changed, update the file
						const { file: loomFile, state } = loomsToUpdate[i];

						if (this.settings.shouldDebug)
							console.log("Updating links in file", {
								path: loomFile.path,
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
								serializeLoomState(newState);

							await file.vault.modify(loomFile, serializedState);

							//Update all looms that match this path
							app.workspace.trigger(
								EVENT_REFRESH_APP,
								loomFile.path,
								-1, //update all looms that match this path
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
			id: "dataloom-create",
			name: "Create loom",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "=" }],
			callback: async () => {
				await this.newLoomFile(null);
			},
		});

		this.addCommand({
			id: "dataloom-create-and-embed",
			name: "Create loom and embed it into current file",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "+" }],
			editorCallback: async (editor) => {
				const filePath = await this.newLoomFile(null, true);
				if (!filePath) return;

				const useMarkdownLinks = (this.app.vault as any).getConfig(
					"useMarkdownLinks"
				);

				// Use basename rather than whole name when using Markdownlink like ![abcd](abcd.loom) instead of ![abcd.loom](abcd.loom)
				// It will replace `.loom` to "" in abcd.loom
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
					this.app.workspace.getActiveViewOfType(DataLoomView);
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
					this.app.workspace.getActiveViewOfType(DataLoomView);
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
					this.app.workspace.getActiveViewOfType(DataLoomView);
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
					this.app.workspace.getActiveViewOfType(DataLoomView);
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
					this.app.workspace.getActiveViewOfType(DataLoomView);
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
					this.app.workspace.getActiveViewOfType(DataLoomView);
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
		this.app.workspace.detachLeavesOfType(DATA_LOOM_VIEW);
	}
}
