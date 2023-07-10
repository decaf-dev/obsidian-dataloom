import { App, Modal, Notice, TFile } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { deserializeLoomState } from "src/data/serialize-loom-state";
import { ExportApp } from "src/react/export-app";
import { Provider } from "react-redux";
import { store } from "src/redux/global/store";

export default class ExportModal extends Modal {
	root: Root;
	loomFile: TFile;

	constructor(app: App, loomFile: TFile) {
		super(app);
		this.app = app;
		this.loomFile = loomFile;
	}

	onOpen() {
		this.renderApp();
	}

	private async renderApp() {
		try {
			const data = await app.vault.read(this.loomFile);
			const state = deserializeLoomState(data);

			this.root = createRoot(this.containerEl.children[1]);
			this.root.render(
				<Provider store={store}>
					<ExportApp
						LoomState={state}
						loomFilePath={this.loomFile.path}
					/>
				</Provider>
			);
		} catch (err) {
			new Notice("Error reading loom file data.");
		}
	}

	onClose() {
		if (this.root) this.root.unmount();
	}
}
