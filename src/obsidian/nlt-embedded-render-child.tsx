import { MarkdownRenderChild, TFile } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import NotionLikeTable from "src/obsidian-shim/build/notion-like-table";
import { store } from "src/redux/global/store";
import { NLTView } from "./nlt-view";
import { deserializeTableState } from "src/data/serialize-table-state";
import { v4 as uuidv4 } from "uuid";

export default class NLTEmbeddedRenderChild extends MarkdownRenderChild {
	private root: Root | null;
	private fileName: string;
	private appId: string;

	constructor(containerEl: HTMLElement, fileName: string) {
		super(containerEl);
		this.root = null;
		this.fileName = fileName;
		this.appId = uuidv4();
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
					leaf={activeView.leaf}
					appId={this.appId}
					filePath={file.path}
					isMarkdownView
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
