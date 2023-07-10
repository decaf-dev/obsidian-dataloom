import { App, Modal, Notice, TFile } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { deserializeDashboardState } from "src/data/serialize-dashboard-state";
import { ExportApp } from "src/react/export-app";
import { Provider } from "react-redux";
import { store } from "src/redux/global/store";

export default class ExportModal extends Modal {
	root: Root;
	tableFile: TFile;

	constructor(app: App, tableFile: TFile) {
		super(app);
		this.app = app;
		this.tableFile = tableFile;
	}

	onOpen() {
		this.renderApp();
	}

	private async renderApp() {
		try {
			const data = await app.vault.read(this.tableFile);
			const state = deserializeDashboardState(data);

			this.root = createRoot(this.containerEl.children[1]);
			this.root.render(
				<Provider store={store}>
					<ExportApp
						dashboardState={state}
						tableFilePath={this.tableFile.path}
					/>
				</Provider>
			);
		} catch (err) {
			new Notice("Error reading table file data.");
		}
	}

	onClose() {
		if (this.root) this.root.unmount();
	}
}
