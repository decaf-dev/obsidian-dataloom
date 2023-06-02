import { TextFileView, WorkspaceLeaf } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { NotionLikeTable } from "../react/table-app";
import { store } from "../redux/global/store";
import { TableState } from "../shared/types/types";
import {
	deserializeTableState,
	serializeTableState,
} from "src/data/serialize-table-state";
import { EVENT_REFRESH_VIEW } from "src/shared/events";
import NLTExportModal from "./nlt-export-modal";
import { isEventForThisLeaf } from "src/shared/renderUtils";

export const NOTION_LIKE_TABLES_VIEW = "notion-like-tables";

export class NLTView extends TextFileView {
	root: Root | null = null;
	data: string;

	getViewData(): string {
		return this.data;
	}

	handleSaveTableState = async (tableState: TableState) => {
		//Only save data if the view is in the active leaf
		//This prevents the data being saved multiple times if we have
		//multiple tabs of the same file opens
		if (isEventForThisLeaf(this.leaf)) {
			const serialized = serializeTableState(tableState);
			this.data = serialized;
			await this.requestSave();

			//Trigger an event to refresh the other open views of this file
			this.app.workspace.trigger(
				EVENT_REFRESH_VIEW,
				this.leaf,
				this.file.path,
				tableState
			);
		}
	};

	setViewData(data: string, clear: boolean): void {
		this.data = data;

		//If a table pane is already open, we need to unmount the old instance
		if (clear) {
			if (this.root) {
				this.root.unmount();
				this.root = createRoot(this.containerEl.children[1]);
			}
		}

		const tableState = deserializeTableState(data);
		this.renderApp(tableState);
	}

	renderApp(tableState: TableState) {
		if (this.root) {
			this.root.render(
				<NotionLikeTable
					fileName={this.getDisplayText()}
					view={this}
					store={store}
					tableState={tableState}
					onSaveState={this.handleSaveTableState}
				/>
			);
		}
	}

	clear(): void {
		this.data = "{}";
	}

	getViewType() {
		return NOTION_LIKE_TABLES_VIEW;
	}

	getDisplayText() {
		const fileName = this.file?.name;
		if (fileName) {
			const extensionIndex = fileName.lastIndexOf(".");
			return fileName.substring(0, extensionIndex);
		}
		return "";
	}

	async onOpen() {
		//Add offset to the container to account for the mobile action bar
		this.containerEl.style.paddingBottom = "48px";

		//This is the view content container
		const container = this.containerEl.children[1];
		this.root = createRoot(container);

		//Add settings button to action bar
		this.addAction("settings", "Settings", () => {
			//Open settings tab
			(this.app as any).setting.open();
			//Navigate to Notion-Like-Tables settings
			(this.app as any).setting.openTabById("notion-like-tables");
		});

		this.addAction("download", "Export", () => {
			new NLTExportModal(this.app, this.getDisplayText()).open();
		});

		// this.addAction("import", "Import", () => {
		// 	new NLTImportModal(this.app).open();
		// });

		this.app.workspace.on(
			// @ts-expect-error: not valid event
			EVENT_REFRESH_VIEW,
			(leaf: WorkspaceLeaf, filePath: string, tableState: TableState) => {
				//Make sure that the event is coming from a different leaf but the same file
				//This occurs when we have multiple tabs of the same file open
				if (leaf !== this.leaf && filePath === this.file.path) {
					if (this.root) {
						this.root.unmount();
						this.root = createRoot(this.containerEl.children[1]);
					}

					this.renderApp(tableState);
				}
			}
		);
	}

	async onClose() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}
