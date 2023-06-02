import { MarkdownRenderChild, TFile } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { NotionLikeTable } from "src/react/table-app";
import { store } from "src/redux/global/store";
import { NLTView } from "./nlt-view";
import { deserializeTableState } from "src/data/serialize-table-state";

export default class NLTEmbeddedRenderChild extends MarkdownRenderChild {
	private root: Root | null;
	private fileName: string;

	constructor(containerEl: HTMLElement, fileName: string) {
		super(containerEl);
		this.root = null;
		this.fileName = fileName;
	}

	private handleSaveTableState() {}

	async onload() {
		const container = this.containerEl;
		const activeView = app.workspace.getActiveViewOfType(NLTView);
		if (!activeView) return;

		const file = app.vault.getAbstractFileByPath(this.fileName);
		if (!file) return;

		if (file instanceof TFile) {
			const data = await app.vault.read(file);
			const state = deserializeTableState(data);

			//Get table state
			this.root = createRoot(container);

			this.root.render(
				<NotionLikeTable
					fileName={this.fileName}
					leaf={activeView.leaf}
					store={store}
					tableState={state}
					onSaveState={this.handleSaveTableState}
				/>
			);
		}
	}

	onunload() {
		if (this.root) this.root.unmount();
	}
}
