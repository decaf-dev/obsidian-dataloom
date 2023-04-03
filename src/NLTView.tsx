import { TextFileView, WorkspaceLeaf } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import Json from "./services/file/Json";
import { store } from "./services/redux/store";
import { TableState } from "./services/tableState/types";

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
		const serialized = Json.serializeTableState(tableState);
		this.data = serialized;
		await this.requestSave();
	};

	setViewData(data: string, clear: boolean): void {
		this.data = data;

		const tableState = Json.deserializeTableState(data);

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
					<App
						initialState={tableState}
						onSaveTableState={this.handleSaveTableState}
					/>
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
	}

	async onClose() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}
