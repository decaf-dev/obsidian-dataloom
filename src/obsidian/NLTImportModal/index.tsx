import { App, Modal } from "obsidian";
import { NLTView } from "../../NLTView";
import Json from "../../services/io/Json";
import { TableState } from "../../services/tableState/types";
import { Root, createRoot } from "react-dom/client";
import ImportApp from "./components/ImportApp";

export default class NLTImportModal extends Modal {
	root: Root;

	constructor(app: App) {
		super(app);
		this.app = app;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createDiv({ text: "Notion-Like Tables Import" });
		const appContainer = contentEl.createDiv();

		const view = app.workspace.getActiveViewOfType(NLTView);
		if (view) {
			//Get table state
			const data = view.getViewData();
			const state = Json.deserializeTableState(data);

			this.root = createRoot(appContainer);
			this.root.render(
				<ImportApp
					initialState={state}
					onStateSave={(state) => this.handleStateSave(view, state)}
				/>
			);
		}
	}

	private handleStateSave = (view: NLTView, state: TableState) => {
		const serialized = Json.serializeTableState(state);

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
