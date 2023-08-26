import { App, Modal, Notice, TFile } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { deserializeLoomState } from "src/data/serialize";
import { ExportApp } from "src/react/export-app";
import { Provider } from "react-redux";
import { store } from "src/redux/store";
import { renderDivider, setModalTitle } from "../shared";

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
		const { containerEl } = this;
		setModalTitle(containerEl, "DataLoom Export");

		const { contentEl } = this;
		renderDivider(contentEl);
		const appContainerEl = contentEl.createDiv();
		this.renderApp(appContainerEl);
	}

	private async renderApp(contentEl: HTMLElement) {
		try {
			const data = await this.app.vault.read(this.loomFile);
			const state = deserializeLoomState(data, this.pluginVersion);

			this.root = createRoot(contentEl);
			this.root.render(
				<Provider store={store}>
					<ExportApp
						app={this.app}
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
