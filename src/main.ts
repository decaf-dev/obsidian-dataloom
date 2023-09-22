import {
	MarkdownView,
	Notice,
	Plugin,
	TAbstractFile,
	TFile,
	TFolder,
	normalizePath,
} from "obsidian";

import SupportModal from "./obsidian/modal/support-modal";
import WelcomeModal from "./obsidian/modal/welcome-modal";
import WhatsNewModal from "./obsidian/modal/whats-new-modal";
import DataLoomSettingsTab from "./obsidian/dataloom-settings-tab";
import EditingViewPlugin from "./obsidian/editing-view-plugin";
import DataLoomView, { DATA_LOOM_VIEW } from "./obsidian/dataloom-view";

import { store } from "./redux/store";
import {
	setDarkMode,
	setSettings,
	setPluginVersion,
} from "./redux/global-slice";
import { LOOM_EXTENSION, WIKI_LINK_REGEX } from "./data/constants";
import { createLoomFile } from "src/data/loom-file";
import {
	EVENT_COLUMN_ADD,
	EVENT_COLUMN_DELETE,
	EVENT_DOWNLOAD_CSV,
	EVENT_DOWNLOAD_MARKDOWN,
	EVENT_GLOBAL_CLICK,
	EVENT_GLOBAL_KEYDOWN,
	EVENT_APP_REFRESH,
	EVENT_ROW_ADD,
	EVENT_ROW_DELETE,
} from "./shared/events";
import { deserializeLoomState, serializeLoomState } from "./data/serialize";
import { updateLinkReferences } from "./data/utils";
import { getBasename } from "./shared/link/link-utils";
import { hasDarkTheme } from "./shared/render/utils";
import { removeCurrentFocusClass } from "./react/loom-app/app/hooks/use-focus/utils";
import { LoomState } from "./shared/loom-state/types/loom-state";
import {
	loadPreviewModeApps,
	purgeEmbeddedLoomApps,
} from "./obsidian/embedded/embedded-app-manager";

export interface DataLoomSettings {
	shouldDebug: boolean;
	createAtObsidianAttachmentFolder: boolean;
	customFolderForNewFiles: string;
	removeMarkdownOnExport: boolean;
	defaultEmbedWidth: string;
	defaultEmbedHeight: string;
	hasMigratedTo800: boolean;
	showWelcomeModal: boolean;
	showSupportModal: boolean;
	showWhatsNewModal: boolean;
	defaultFrozenColumnCount: number;
	pluginVersion: string;
}

export const DEFAULT_SETTINGS: DataLoomSettings = {
	shouldDebug: false,
	createAtObsidianAttachmentFolder: false,
	customFolderForNewFiles: "",
	removeMarkdownOnExport: true,
	defaultEmbedWidth: "100%",
	defaultEmbedHeight: "340px",
	hasMigratedTo800: false,
	showWelcomeModal: true,
	showSupportModal: true,
	showWhatsNewModal: true,
	defaultFrozenColumnCount: 1,
	pluginVersion: "",
};

export default class DataLoomPlugin extends Plugin {
	settings: DataLoomSettings;
	displayModalsOnLoomOpen: boolean;

	/**
	 * Called on plugin load.
	 * This can be when the plugin is enabled or Obsidian is first opened.
	 */
	async onload() {
		await this.loadSettings();

		this.registerView(
			DATA_LOOM_VIEW,
			(leaf) =>
				new DataLoomView(leaf, this.manifest.id, this.manifest.version)
		);
		this.registerExtensions([LOOM_EXTENSION], DATA_LOOM_VIEW);

		this.addRibbonIcon("table", "Create new loom", async () => {
			await this.newLoomFile(null);
		});

		this.addSettingTab(new DataLoomSettingsTab(this.app, this));

		this.registerEditorExtension(
			EditingViewPlugin(this.app, this.manifest.version)
		);

		this.setModalDisplay();

		this.registerCommands();
		this.registerEvents();
		this.registerDOMEvents();

		this.app.workspace.onLayoutReady(async () => {
			const isDark = hasDarkTheme();
			store.dispatch(setDarkMode(isDark));

			await this.migrateLoomFiles();
		});

		if (this.settings.showWelcomeModal) {
			new WelcomeModal(this.app).open();
			this.settings.showWelcomeModal = false;
			await this.saveSettings();
		}

		this.settings.pluginVersion = this.manifest.version;
		await this.saveSettings();
		store.dispatch(setPluginVersion(this.manifest.version));
	}

	private setModalDisplay() {
		if (this.settings.pluginVersion !== this.manifest.version) {
			if (this.settings.pluginVersion !== "") {
				this.displayModalsOnLoomOpen = true;
				return;
			}
		}
		this.displayModalsOnLoomOpen = false;
	}

	//TODO remove this in future versions
	private async migrateLoomFiles() {
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
				const data = await this.app.vault.read(file);
				const parsedState = JSON.parse(data);
				if (!parsedState.model) return;

				const newFilePath = file.path.replace(
					`.${file.extension}`,
					`.${LOOM_EXTENSION}`
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
		const filePath = await createLoomFile(
			this.app,
			folderPath,
			this.manifest.version,
			this.settings.defaultFrozenColumnCount
		);

		//If the file is embedded, we don't need to open it
		if (embedded) return filePath;

		//Open file in a new tab and set it to active
		await this.app.workspace.getLeaf(true).setViewState({
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
			removeCurrentFocusClass();
			this.app.workspace.trigger(EVENT_GLOBAL_CLICK);
		});

		//This event is guaranteed to fire after our React synthetic event handlers
		this.registerDomEvent(document, "keydown", (e) => {
			if (this.settings.shouldDebug) console.log("main handleKeyDown");
			this.app.workspace.trigger(EVENT_GLOBAL_KEYDOWN, e);
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

				//TODO find a better way to do this
				//Wait for the DOM to update before loading the preview mode apps
				//2ms should be enough time
				setTimeout(() => {
					loadPreviewModeApps(
						this.app,
						leaves,
						this.manifest.version
					);
				}, 2);
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

		this.registerEvent(
			this.app.workspace.on("file-open", async (file: TFile | null) => {
				if (!file) return;
				if (!this.displayModalsOnLoomOpen) return;

				let shouldOpen = false;
				if (file.extension === LOOM_EXTENSION) {
					shouldOpen = true;
				} else {
					const data = await this.app.vault.cachedRead(file);
					const loomEmbedRegex = new RegExp(
						/!\[\[[^\]]+\.loom(?:\|[0-9]+(?:x[0-9]+)?)?\]\]/
					);
					if (data.match(loomEmbedRegex)) {
						shouldOpen = true;
					}
				}

				if (shouldOpen) {
					this.displayModalsOnLoomOpen = false;
					if (this.settings.showWhatsNewModal) {
						new WhatsNewModal(this.app, () => {
							if (this.settings.showSupportModal) {
								new SupportModal(this.app).open();
							}
						}).open();
					}
				}
			})
		);

		this.registerEvent(
			this.app.vault.on(
				"rename",
				async (file: TAbstractFile, oldPath: string) => {
					if (file instanceof TFile) {
						const loomFiles = this.app.vault
							.getFiles()
							.filter(
								(file) => file.extension === LOOM_EXTENSION
							);

						const loomsToUpdate: {
							file: TFile;
							state: LoomState;
						}[] = [];

						let numLinks = 0;
						for (const loomFile of loomFiles) {
							//For each file read its contents
							const data = await file.vault.read(loomFile);
							const state = deserializeLoomState(
								data,
								this.manifest.version
							);
							//Search for old path in the file

							state.model.bodyCells.forEach((cell) => {
								const regex = structuredClone(WIKI_LINK_REGEX);
								let matches;
								while (
									(matches = regex.exec(cell.markdown)) !==
									null
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
								JSON.stringify(state) !==
								JSON.stringify(newState)
							) {
								const serializedState =
									serializeLoomState(newState);

								await file.vault.modify(
									loomFile,
									serializedState
								);

								//Update all looms that match this path
								this.app.workspace.trigger(
									EVENT_APP_REFRESH,
									loomFile.path,
									-1, //update all looms that match this path
									newState
								);
							}
						}
					}
				}
			)
		);
	}

	registerCommands() {
		this.addCommand({
			id: "create",
			name: "Create loom",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "=" }],
			callback: async () => {
				await this.newLoomFile(null);
			},
		});

		this.addCommand({
			id: "create-and-embed",
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
			id: "add-column",
			name: "Add column",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "\\" }],
			checkCallback: (checking: boolean) => {
				const loomView =
					this.app.workspace.getActiveViewOfType(DataLoomView);
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (loomView || markdownView) {
					if (!checking) {
						this.app.workspace.trigger(EVENT_COLUMN_ADD);
					}
					return true;
				}
				return false;
			},
		});

		this.addCommand({
			id: "delete-column",
			name: "Delete column",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "Backspace" }],
			checkCallback: (checking: boolean) => {
				const loomView =
					this.app.workspace.getActiveViewOfType(DataLoomView);
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (loomView || markdownView) {
					if (!checking) {
						this.app.workspace.trigger(EVENT_COLUMN_DELETE);
					}
					return true;
				}
				return false;
			},
		});

		this.addCommand({
			id: "add-row",
			name: "Add row",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "Enter" }],
			checkCallback: (checking: boolean) => {
				const loomView =
					this.app.workspace.getActiveViewOfType(DataLoomView);
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (loomView || markdownView) {
					if (!checking) this.app.workspace.trigger(EVENT_ROW_ADD);
					return true;
				}
				return false;
			},
		});

		this.addCommand({
			id: "delete-row",
			name: "Delete row",
			hotkeys: [{ modifiers: ["Alt", "Shift"], key: "Backspace" }],
			checkCallback: (checking: boolean) => {
				const loomView =
					this.app.workspace.getActiveViewOfType(DataLoomView);
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (loomView || markdownView) {
					if (!checking) {
						this.app.workspace.trigger(EVENT_ROW_DELETE);
					}
					return true;
				}
				return false;
			},
		});

		this.addCommand({
			id: "export-markdown",
			name: "Export as markdown",
			checkCallback: (checking: boolean) => {
				const loomView =
					this.app.workspace.getActiveViewOfType(DataLoomView);
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (loomView || markdownView) {
					if (!checking) {
						this.app.workspace.trigger(EVENT_DOWNLOAD_MARKDOWN);
					}
					return true;
				}
				return false;
			},
		});

		this.addCommand({
			id: "export-csv",
			name: "Export as CSV",
			checkCallback: (checking: boolean) => {
				const loomView =
					this.app.workspace.getActiveViewOfType(DataLoomView);
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (loomView || markdownView) {
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
