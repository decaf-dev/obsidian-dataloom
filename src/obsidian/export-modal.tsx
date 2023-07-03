import { App, Modal } from "obsidian";
import DashboardsView from "./dashboards-view";
import { Root, createRoot } from "react-dom/client";
import { deserializeDashboardState } from "src/data/serialize-table-state";
import { ExportApp } from "src/react/export-app";
import { Provider } from "react-redux";
import { store } from "src/redux/global/store";

export default class ExportModal extends Modal {
	root: Root;
	filePath: string;

	constructor(app: App, filePath: string) {
		super(app);
		this.app = app;
		this.filePath = filePath;
	}

	onOpen() {
		const container = this.containerEl.children[1];

		const view = app.workspace.getActiveViewOfType(DashboardsView);
		if (view) {
			//Get table state
			const data = view.getViewData();
			const state = deserializeDashboardState(data);

			this.root = createRoot(container);
			this.root.render(
				<Provider store={store}>
					<ExportApp
						dashboardState={state}
						filePath={this.filePath}
					/>
				</Provider>
			);
		}
	}

	onClose() {
		if (this.root) this.root.unmount();
	}
}
