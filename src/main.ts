import { MarkdownView, Plugin, TAbstractFile, TFile, TFolder } from "obsidian";

import NLTSettingsTab from "./obsidian/nlt-settings-tab";

import { store } from "./redux/global/store";
import { setDarkMode, setDebugMode } from "./redux/global/global-slice";
import { NLTView, NOTION_LIKE_TABLES_VIEW } from "./obsidian/nlt-view";
import { TABLE_EXTENSION } from "./data/constants";
import { createTableFile } from "src/data/table-file";
import {
	EVENT_COLUMN_ADD,
	EVENT_COLUMN_DELETE,
	EVENT_DOWNLOAD_CSV,
	EVENT_DOWNLOAD_MARKDOWN,
	EVENT_REFRESH_TABLES,
	EVENT_ROW_ADD,
	EVENT_ROW_DELETE,
} from "./shared/events";
import { nltEmbeddedPlugin } from "./obsidian/nlt-embedded-plugin";
import {
	deserializeTableState,
	serializeTableState,
} from "./data/serialize-table-state";
import { updateLinkReferences } from "./data/utils";
import { filterUniqueStrings } from "./react/shared/suggest-menu/utils";
import { getBasename } from "./shared/link/link-utils";
import { hasDarkTheme } from "./shared/render/utils";

export interface NLTSettings {
	shouldDebug: boolean;
	createAtObsidianAttachmentFolder: boolean;
	customFolderForNewTables: string;
	nameWithActiveFileNameAndTimestamp: boolean;
}

export const DEFAULT_SETTINGS: NLTSettings = {
	shouldDebug: false,
	createAtObsidianAttachmentFolder: false,
	customFolderForNewTables: "",
	nameWithActiveFileNameAndTimestamp: false,
};
export default class NLTPlugin extends Plugin {
	settings: NLTSettings;

	/**
	 * Called on plugin load.
	 * This can be when the plugin is enabled or Obsidian is first opened.
	 */
	async onload() {
		await this.loadSettings();

		this.registerView(NOTION_LIKE_TABLES_VIEW, (leaf) => new NLTView(leaf));
		this.registerExtensions([TABLE_EXTENSION], NOTION_LIKE_TABLES_VIEW);

		this.addRibbonIcon("table", "Create Notion-Like table", async () => {
			await this.newTableFile(null);
		});

		this.addSettingTab(new NLTSettingsTab(this.app, this));
		this.registerEmbeddedView();
		this.registerCommands();
		this.registerEvents();
	}

	private registerEmbeddedView() {
		//This registers a CodeMirror extension. It is used to render the embedded
		//table in live preview mode.
		this.registerEditorExtension(nltEmbeddedPlugin);

		//This registers a Markdown post processor. It is used to render the embedded
		//table in preview mode.
		// this.registerMarkdownPostProcessor((element, context) => {
		// 	const embeddedTableLinkEls = getEmbeddedTableLinkEls(element);
		// 	for (let i = 0; i < embeddedTableLinkEls.length; i++) {
		// 		const linkEl = embeddedTableLinkEls[i];
		// 		context.addChild(
		// 			new NLTEmbeddedRenderChild(
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
			useActiveFileNameAndTimestamp:
				this.settings.nameWithActiveFileNameAndTimestamp,
		});
		if (embedded) return filePath;
		//Open file in a new tab and set it to active
		await app.workspace.getLeaf(true).setViewState({
			type: NOTION_LIKE_TABLES_VIEW,
			active: true,
			state: { file: filePath },
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
					const files = this.app.vault.getFiles();

					const uniqueFileNames = filterUniqueStrings(
						files.map((file) => file.name)
					);
					const isUniqueFileName = uniqueFileNames.includes(
						file.name
					);

					//Get all table files
					const tableFiles = files.filter(
						(file) => file.extension === TABLE_EXTENSION
					);
					for (let i = 0; i < tableFiles.length; i++) {
						const tableFile = tableFiles[i];

						//For each file read its contents
						const content = await tableFile.vault.read(
							tableFiles[i]
						);
						const deserializedState =
							deserializeTableState(content);

						//Iterate over all body cells and check the markdwon
						const newState = structuredClone(deserializedState);
						newState.model.bodyCells.forEach((cell) => {
							//If the markdown contains a wiki link with old path, update it
							const updatedMarkdown = updateLinkReferences(
								cell.markdown,
								file,
								oldPath,
								isUniqueFileName
							);
							cell.markdown = updatedMarkdown;
						});

						//If the state has changed, update the file
						if (
							JSON.stringify(deserializedState) !==
							JSON.stringify(newState)
						) {
							const serializedState =
								serializeTableState(newState);
							await tableFile.vault.modify(
								tableFile,
								serializedState
							);

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
			store.dispatch(setDebugMode(this.settings.shouldDebug));
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
				const nltView = this.app.workspace.getActiveViewOfType(NLTView);
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
				const nltView = this.app.workspace.getActiveViewOfType(NLTView);
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
				const nltView = this.app.workspace.getActiveViewOfType(NLTView);
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
				const nltView = this.app.workspace.getActiveViewOfType(NLTView);
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
				const nltView = this.app.workspace.getActiveViewOfType(NLTView);
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
				const nltView = this.app.workspace.getActiveViewOfType(NLTView);
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
