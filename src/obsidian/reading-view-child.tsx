import { MarkdownRenderChild, TFile } from "obsidian";

import "react-devtools";
import { Root, createRoot } from "react-dom/client";
import { store } from "src/redux/global/store";
import DashboardsView from "./dashboards-view";
import { deserializeDashboardState } from "src/data/serialize-dashboard-state";
import { v4 as uuidv4 } from "uuid";
import DashboardApp from "src/react/dashboard-app";

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

	private handleSaveDashboardState() {}

	async onload() {
		const container = this.containerEl;
		const activeView = app.workspace.getActiveViewOfType(DashboardsView);
		if (!activeView) return;

		const file = app.vault.getAbstractFileByPath(this.fileName);
		if (!file) return;

		if (file instanceof TFile) {
			const data = await app.vault.read(file);
			const state = deserializeDashboardState(data);

			//Get dashboard state
			this.root = createRoot(container);

			this.root.render(
				<DashboardApp
					leaf={activeView.leaf}
					appId={this.appId}
					filePath={file.path}
					isMarkdownView
					store={store}
					dashboardState={state}
					onSaveState={this.handleSaveDashboardState}
				/>
			);
		}
	}

	onunload() {
		if (this.root) this.root.unmount();
	}
}
