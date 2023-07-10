import { MarkdownRenderChild, TFile } from "obsidian";

if (process.env.ENABLE_REACT_DEVTOOLS === "true") {
	import("react-devtools");
}
import { Root, createRoot } from "react-dom/client";
import { store } from "src/redux/global/store";
import { deserializeLoomState } from "src/data/serialize-loom-state";
import { v4 as uuidv4 } from "uuid";
import LoomApp from "src/react/loom-app";
import DataLoomView from "./dataloom-view";

export default class ReadingViewChild extends MarkdownRenderChild {
	private root: Root | null;
	private fileName: string;
	private appId: string;

	constructor(containerEl: HTMLElement, fileName: string) {
		super(containerEl);
		this.root = null;
		this.fileName = fileName;
		this.appId = uuidv4();
	}

	private handleSaveLoomState() {}

	async onload() {
		const container = this.containerEl;
		const activeView = app.workspace.getActiveViewOfType(DataLoomView);
		if (!activeView) return;

		const file = app.vault.getAbstractFileByPath(this.fileName);
		if (!file) return;

		if (file instanceof TFile) {
			const data = await app.vault.read(file);
			const state = deserializeLoomState(data);

			//Get loom state
			this.root = createRoot(container);

			this.root.render(
				<LoomApp
					mountLeaf={activeView.leaf}
					appId={this.appId}
					loomFile={file}
					isMarkdownView
					store={store}
					LoomState={state}
					onSaveState={this.handleSaveLoomState}
				/>
			);
		}
	}

	onunload() {
		if (this.root) this.root.unmount();
	}
}
