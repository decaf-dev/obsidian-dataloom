import { App, Modal, Notice, TFile } from "obsidian";

import { Root, createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import ImportApp from "../../react/import-app";

import { deserializeLoomState, serializeLoomState } from "src/data/serialize";
import { store } from "src/redux/store";
import { renderDivider, setModalTitle } from "../shared";
import { LoomState } from "src/shared/loom-state/types";
import { EVENT_APP_REFRESH } from "src/shared/events";
import MenuProvider from "src/react/shared/menu-provider";
import ModalMountProvider from "src/react/shared/modal-mount-provider";

export default class ImportModal extends Modal {
	root: Root;
	loomFile: TFile;
	pluginVersion: string;

	constructor(app: App, loomFile: TFile, pluginVersion: string) {
		super(app);
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

			const modalEl = contentEl.closest(".modal") as HTMLElement | null;
			if (!modalEl) throw new Error("Modal element not found.");

			this.root = createRoot(contentEl);
			this.root.render(
				<Provider store={store}>
					<ModalMountProvider
						obsidianApp={this.app}
						modalEl={modalEl}
					>
						<MenuProvider>
							<ImportApp
								state={state}
								onStateChange={this.handleStateChange}
							/>
						</MenuProvider>
					</ModalMountProvider>
				</Provider>
			);
		} catch (err) {
			console.error(err);
			new Notice("Error reading loom file data.");
		}
	}

	private handleStateChange = async (state: LoomState) => {
		const serialized = serializeLoomState(state);
		await this.app.vault.modify(this.loomFile, serialized);

		//Trigger an event to refresh the other open views of this file
		this.app.workspace.trigger(
			EVENT_APP_REFRESH,
			this.loomFile.path,
			"", //No app id. Target all views of this file
			state
		);
		this.close();
	};

	onClose() {
		if (this.root) this.root.unmount();
	}
}
