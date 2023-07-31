import { App, Modal, Notice, TFile } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { deserializeLoomState } from "src/data/serialize-loom-state";
import { ExportApp } from "src/react/export-app";
import { Provider } from "react-redux";
import { store } from "src/redux/global/store";

export default class ExportModal extends Modal {
	root: Root;
	loomFile: TFile;
	pluginVersion: string;

	constructor(app: App, loomFile: TFile, pluginVersion: string) {
		super(app);
		this.app = app;
		this.loomFile = loomFile;
		this.pluginVersion = pluginVersion;
	}

	onOpen() {
		this.renderApp();
	}

	private async renderApp() {
		try {
			const data = await app.vault.read(this.loomFile);
			const state = deserializeLoomState(data, this.pluginVersion);

			this.root = createRoot(this.containerEl.children[1]);
			this.root.render(
				<Provider store={store}>
					<ExportApp
						loomState={state}
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
