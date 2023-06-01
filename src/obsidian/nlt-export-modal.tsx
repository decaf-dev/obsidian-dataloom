import { App, Modal } from "obsidian";
import { NLTView } from "./nlt-view";
import { Root, createRoot } from "react-dom/client";
import { deserializeTableState } from "src/data/serialize-table-state";
import { ExportApp } from "src/react/export-app";

export default class NLTExportModal extends Modal {
	root: Root;
	viewDisplayText: string;

	constructor(app: App, viewDisplayText: string) {
		super(app);
		this.app = app;
		this.viewDisplayText = viewDisplayText;
	}

	onOpen() {
		const container = this.containerEl.children[1];

		const view = app.workspace.getActiveViewOfType(NLTView);
		if (view) {
			//Get table state
			const data = view.getViewData();
			const state = deserializeTableState(data);

			this.root = createRoot(container);
			this.root.render(
				<ExportApp
					tableState={state}
					viewDisplayText={this.viewDisplayText}
				/>
			);
		}
	}

	onClose() {
		if (this.root) this.root.unmount();
	}
}
