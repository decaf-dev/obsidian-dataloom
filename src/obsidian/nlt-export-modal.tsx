import { App, Modal } from "obsidian";
import { NLTView } from "./nlt-view";
import { Root, createRoot } from "react-dom/client";
import { deserializeTableState } from "src/data/serialize-table-state";
import { ExportApp } from "src/react/export-app";
import { Provider } from "react-redux";
import { store } from "src/redux/global/store";

export default class NLTExportModal extends Modal {
	root: Root;
	filePath: string;

	constructor(app: App, filePath: string) {
		super(app);
		this.app = app;
		this.filePath = filePath;
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
				<Provider store={store}>
					<ExportApp tableState={state} filePath={this.filePath} />
				</Provider>
			);
		}
	}

	onClose() {
		if (this.root) this.root.unmount();
	}
}
