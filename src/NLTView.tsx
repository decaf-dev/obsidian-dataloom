import { TextFileView, WorkspaceLeaf } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./services/redux/store";

export const NOTION_LIKE_TABLES_VIEW = "notion-like-tables";

export class NLTView extends TextFileView {
	root: Root;
	data: string;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewData(): string {
		return this.data;
	}
	setViewData(data: string, clear: boolean): void {
		this.data = data;
		this.root.render(
			<Provider store={store}>
				<Test data={data} />
			</Provider>
		);
	}

	clear(): void {
		this.data = "";
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
		const container = this.containerEl.children[1];
		container.empty();

		this.root = createRoot(container);
	}

	async onClose() {
		this.root.unmount();
	}
}
