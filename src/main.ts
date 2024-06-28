import {
	MarkdownView,
	Notice,
	Plugin,
	TAbstractFile,
	TFile,
	TFolder,
} from "obsidian";

import WelcomeModal from "./obsidian/modal/welcome-modal";
import DataLoomSettingsTab from "./obsidian/dataloom-settings-tab";
import EditingViewPlugin from "./obsidian/editing-view-plugin";
import DataLoomView, { DATA_LOOM_VIEW } from "./obsidian/dataloom-view";

import { store } from "./redux/store";
import {
	setDarkMode,
	setSettings,
	setPluginVersion,
} from "./redux/global-slice";
import { LOOM_EXTENSION } from "./data/constants";
import { createLoomFile } from "src/data/loom-file";
import { hasDarkTheme } from "./shared/render/utils";
import {
	loadPreviewModeApps,
	purgeEmbeddedLoomApps,
} from "./obsidian/embedded/embedded-app-manager";
import FrontmatterCache from "./shared/frontmatter/frontmatter-cache";
import EventManager from "./shared/event/event-manager";
import { getAssignedPropertyType } from "./shared/frontmatter/obsidian-utils";
import { handleFileRename } from "./data/main-utils";
import { getBasename } from "./shared/link-and-path/file-path-utils";
import Logger from "js-logger";
import { formatMessageForLogger, stringToLogLevel } from "./shared/logger";
import { LOG_LEVEL_OFF } from "./shared/logger/constants";
import LastSavedManager from "./shared/last-saved-manager";

export interface DataLoomSettings {
	logLevel: string;
	createAtObsidianAttachmentFolder: boolean;
	customFolderForNewFiles: string;
	removeMarkdownOnExport: boolean;
	defaultEmbedWidth: string;
	defaultEmbedHeight: string;
	hasMigratedTo800: boolean;
	showWelcomeModal: boolean;
	defaultFrozenColumnCount: number;
	pluginVersion: string;
}

export const DEFAULT_SETTINGS: DataLoomSettings = {
	logLevel: LOG_LEVEL_OFF,
	createAtObsidianAttachmentFolder: false,
	customFolderForNewFiles: "",
	removeMarkdownOnExport: true,
	defaultEmbedWidth: "100%",
	defaultEmbedHeight: "340px",
	hasMigratedTo800: false,
	showWelcomeModal: true,
	defaultFrozenColumnCount: 1,
	pluginVersion: "",
};

const FILE_NAME = "main.ts";

export default class DataLoomPlugin extends Plugin {
	settings: DataLoomSettings;
	displayModalsOnLoomOpen: boolean;

	/**
	 * Called on plugin load.
	 * This can be when the plugin is enabled or Obsidian is first opened.
	 */
	async onload() {
		await this.loadSettings();

		Logger.useDefaults();

		Logger.setHandler(function (messages) {
			const { message, data } = formatMessageForLogger(...messages);
			console.log(message);
			if (data) {
				console.log(data);
			}
		});

		const logLevel = stringToLogLevel(this.settings.logLevel);
		Logger.setLevel(logLevel);

		this.registerView(
			DATA_LOOM_VIEW,
			(leaf) =>
				new DataLoomView(leaf, this.manifest.id, this.manifest.version)
		);
		this.registerExtensions([LOOM_EXTENSION], DATA_LOOM_VIEW);

		this.addRibbonIcon("table", "Create loom", async () => {
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
			Logger.trace(FILE_NAME, "onLayoutReady", "called");
			Logger.debug(FILE_NAME, "onLayoutReady", "workspace layout is ready");

			const isDark = hasDarkTheme();
			store.dispatch(setDarkMode(isDark));

			await this.migrateLoomFiles();

			//If there are any views open with a loom, they will load before onLayoutReady
			//is called. To make sure that the looms get the loaded properties, we need to
			//emit an event to update them
			FrontmatterCache.getInstance().loadProperties(this.app);
			EventManager.getInstance().emit("file-frontmatter-change");

			//This will run once when the plugin is first loaded
			//unless it is placed in the onLayoutReady function
			this.registerEvent(
				this.app.vault.on("create", (file: TAbstractFile) => {
					if (file instanceof TFile) {
						Logger.trace(FILE_NAME, "registerEvent", "vault.create event called");
						EventManager.getInstance().emit("file-create");
					}
				})
			);
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
			Logger.info(FILE_NAME, "migrateLoomFiles", "migrating to 8.0.0");
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

	private async newLoomFile(
		contextMenuFolderPath: string | null,
		embedded?: boolean
	) {
		const file = await createLoomFile(
			this.app,
			this.manifest.version,
			this.settings.defaultFrozenColumnCount,
			{
				contextMenuFolderPath,
				createAtAttachmentsFolder:
					this.settings.createAtObsidianAttachmentFolder,
				customFolderForNewFiles: this.settings.customFolderForNewFiles,
			}
		);

		//If the file is embedded, we don't need to open it
		if (embedded) return file.path;

		//Open the file in a new tab
		await this.app.workspace.getLeaf(true).openFile(file);
	}

	private registerDOMEvents() {
		//This event is guaranteed to fire after our React synthetic event handlers
		this.registerDomEvent(document, "click", () => {
			Logger.trace(FILE_NAME, "registerDomEvent", "click event called");

			EventManager.getInstance().emit("clear-menu-trigger-focus");
			EventManager.getInstance().emit("global-click");
		});

		//This event is guaranteed to fire after our React synthetic event handlers
		this.registerDomEvent(document, "keydown", (e) => {
			Logger.trace(FILE_NAME, "registerDomEvent", "keydown event called");
			EventManager.getInstance().emit("global-keydown", e);
		});
	}

	private registerEvents() {
		this.registerEvent(
			this.app.workspace.on("css-change", () => {
				Logger.trace(FILE_NAME, "registerEvent", "css-change event called");
				const isDark = hasDarkTheme();
				store.dispatch(setDarkMode(isDark));
			})
		);

		//This event is fired whenever a leaf is opened, close, moved,
		//or the user switches between editing and preview mode
		this.registerEvent(
			this.app.workspace.on("layout-change", () => {
				Logger.trace("main.ts", "registerEvent", "layout-change event called");
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
				Logger.trace(FILE_NAME, "registerEvent", "file-menu event called");
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
				Logger.trace(FILE_NAME, "registerEvent", "file-open event called");
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
				}
			})
		);

		this.registerEvent(
			this.app.vault.on(
				"rename",
				async (file: TAbstractFile, oldPath: string) => {
					Logger.trace(FILE_NAME, "registerEvent", "rename event called");
					if (file instanceof TFile) {
						handleFileRename(
							this.app,
							file,
							oldPath,
							this.manifest.version
						);
					}
				}
			)
		);

		this.registerEvent(
			this.app.vault.on("modify", async (file: TAbstractFile) => {
				Logger.trace(FILE_NAME, "registerEvent", "vault.modify event called", file);
				if (file instanceof TFile) {
					if (file.extension === LOOM_EXTENSION) {
						const lastSavedFile = LastSavedManager.getInstance().getLastSavedFile();
						if (lastSavedFile === file.path) {
							const now = Date.now();
							const lastTime = LastSavedManager.getInstance().getLastSavedTime();
							if (now - lastTime < 5000) {
								Logger.debug(FILE_NAME, "registerEvent", "vault.modify event ignored because it file was saved less than 5 seconds ago");
								return;
							}
						}
						EventManager.getInstance().emit("app-refresh-by-file", file, this.manifest.version);
					}
				}
			})
		);

		this.registerSourceEvents();
	}

	/**
	 * Register events that are needed for updating the rows created by sources
	 */
	private registerSourceEvents() {
		this.registerEvent(
			this.app.vault.on("rename", (file: TAbstractFile) => {
				Logger.trace(FILE_NAME, "registerEvent", "vault.rename event called");
				if (file instanceof TFile) {
					EventManager.getInstance().emit("file-rename");
				} else {
					EventManager.getInstance().emit("folder-rename");
				}
			})
		);

		this.registerEvent(
			this.app.vault.on("delete", (file: TAbstractFile) => {
				Logger.trace(FILE_NAME, "registerEvent", "vault.delete event called");
				if (file instanceof TFile) {
					EventManager.getInstance().emit("file-delete");
				} else {
					EventManager.getInstance().emit("folder-delete");
				}
			})
		);

		//This runs whenever a property changes types
		this.registerEvent(
			(this.app as any).metadataTypeManager.on(
				"changed",
				async (propertyName: string) => {
					Logger.trace(FILE_NAME, "registerEvent", "metadataTypeManager.changed event called");
					const updatedType = getAssignedPropertyType(
						this.app,
						propertyName
					);
					FrontmatterCache.getInstance().setPropertyType(
						propertyName,
						updatedType
					);
					EventManager.getInstance().emit("property-type-change");
				}
			)
		);

		this.registerEvent(
			this.app.metadataCache.on(
				"changed",
				async (file: TAbstractFile) => {
					if (file instanceof TFile) {
						Logger.trace(FILE_NAME, "registerEvent", "metadataCache.changed event called");
						//Wait until metadataTypeManager has the updated properties
						//This is a bug. Bug #1
						//TODO tell the Obsidian team
						await new Promise((resolve) =>
							setTimeout(resolve, 100)
						);
						FrontmatterCache.getInstance().loadProperties(this.app);
						EventManager.getInstance().emit(
							"file-frontmatter-change"
						);
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
						EventManager.getInstance().emit("add-column");
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
						EventManager.getInstance().emit("delete-column");
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
					if (!checking) EventManager.getInstance().emit("add-row");
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
						EventManager.getInstance().emit("delete-row");
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
						EventManager.getInstance().emit("download-markdown");
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
						EventManager.getInstance().emit("download-csv");
					}
					return true;
				}
				return false;
			},
		});
	}

	async loadSettings() {
		Logger.trace(FILE_NAME, "loadSettings", "called");
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
		store.dispatch(setSettings({ ...this.settings }));
	}

	async saveSettings() {
		Logger.trace(FILE_NAME, "saveSettings", "called");
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
