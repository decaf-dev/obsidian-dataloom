import { TextFileView, WorkspaceLeaf } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { Provider } from "react-redux";
import App from "../react/App/App";
import { store } from "../services/redux/store";
import { TableState } from "../data/types";
import TableStateProvider from "../services/tableState/useTableState";
import NLTImportModal from "./NLTImportModal";
import {
	deserializeTableState,
	serializeTableState,
} from "src/data/serializeTableState";

export const NOTION_LIKE_TABLES_VIEW = "notion-like-tables";

export class NLTView extends TextFileView {
	root: Root | null = null;
	data: string;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewData(): string {
		return this.data;
	}

	handleSaveTableState = async (tableState: TableState) => {
		const serialized = serializeTableState(tableState);
		this.data = serialized;
		await this.requestSave();
	};

	setViewData(data: string, clear: boolean): void {
		this.data = data;

		const tableState = deserializeTableState(data);

		//If a table pane is already open, we need to unmount the old instance
		if (clear) {
			if (this.root) {
				this.root.unmount();
				this.root = createRoot(this.containerEl.children[1]);
			}
		}

		if (this.root) {
			this.root.render(
				<Provider store={store}>
					<TableStateProvider initialState={tableState}>
						<App onSaveTableState={this.handleSaveTableState} />
					</TableStateProvider>
				</Provider>
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

		//this.addAction("download", "Export", () => {});

		this.addAction("import", "Import", () => {
			new NLTImportModal(this.app).open();
		});
	}

	async onClose() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}
