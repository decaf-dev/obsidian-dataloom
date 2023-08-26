import { App, Modal, Notice, TFile } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import ImportApp from "../../react/import-app";
import { deserializeLoomState } from "src/data/serialize";
import { Provider } from "react-redux";
import { store } from "src/redux/store";
import { renderDivider, setModalTitle } from "../shared";

export default class ImportModal extends Modal {
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
		setModalTitle(containerEl, "DataLoom Import");

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
					<ImportApp
						initialState={state}
						onStateSave={() => {}}
						// onStateSave={(state) =>
						// 	this.handleStateSave(view, state)
						// }
					/>
				</Provider>
			);
		} catch (err) {
			new Notice("Error reading loom file data.");
		}
	}

	// private handleStateSave = (view: DataLoomView, state: LoomState) => {
	// 	const serialized = serializeLoomState(state);

	// 	//Update the file contents and force an update of the React app
	// 	view.setViewData(serialized, true);
	// 	this.close();
	// };

	onClose() {
		if (this.root) this.root.unmount();
	}
}
