import { TextFileView, WorkspaceLeaf } from "obsidian";

export const NOTION_LIKE_TABLES_VIEW = "notion-like-tables";

export class NLTView extends TextFileView {
	data: string;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewData(): string {
		return this.data;
	}
	setViewData(data: string, clear: boolean): void {
		console.log(data);
	}

	clear(): void {
		this.data = "";
	}

	getViewType() {
		return NOTION_LIKE_TABLES_VIEW;
	}

	getDisplayText() {
		return "Notion-Like Table";
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();
		container.createEl("h4", { text: "Example view" });
	}

	async onClose() {}
}
