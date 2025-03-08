import { App, Modal, TFile } from "obsidian";
import { type Root, createRoot } from "react-dom/client";
import { ExportApp } from "src/react/export-app";
import type { LoomState } from "src/shared/loom-state/types/loom-state";
import { renderDivider, setModalTitle } from "../shared";

export default class ExportModal extends Modal {
	root: Root;
	loomFile: TFile;
	loomState: LoomState;

	constructor(app: App, loomFile: TFile, loomState: LoomState) {
		super(app);
		this.app = app;
		this.loomFile = loomFile;
		this.loomState = loomState;
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
		this.root = createRoot(contentEl);
		this.root.render(
			<ExportApp
				app={this.app}
				loomState={this.loomState}
				loomFilePath={this.loomFile.path}
			/>
		);
	}

	onClose() {
		if (this.root) this.root.unmount();
	}
}
