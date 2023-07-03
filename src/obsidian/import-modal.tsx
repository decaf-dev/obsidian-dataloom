import { App, Modal } from "obsidian";
import DashboardsView from "./dashboards-view";
import { TableState } from "../shared/types";
import { Root, createRoot } from "react-dom/client";
import ImportApp from "../react/import-app";
import {
	deserializeTableState,
	serializeTableState,
} from "src/data/serialize-table-state";

export default class ImportModal extends Modal {
	root: Root;

	constructor(app: App) {
		super(app);
		this.app = app;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createDiv({ text: "Dashboards Import" });
		const appContainer = contentEl.createDiv();

		const view = app.workspace.getActiveViewOfType(DashboardsView);
		if (view) {
			//Get table state
			const data = view.getViewData();
			const state = deserializeTableState(data);

			this.root = createRoot(appContainer);
			this.root.render(
				<ImportApp
					initialState={state}
					onStateSave={(state) => this.handleStateSave(view, state)}
				/>
			);
		}
	}

	private handleStateSave = (view: DashboardsView, state: TableState) => {
		const serialized = serializeTableState(state);

		//Update the file contents and force an update of the React app
		view.setViewData(serialized, true);
		this.close();
	};

	onClose() {
		const { contentEl } = this;
		if (this.root) this.root.unmount();
		contentEl.empty();
	}
}
