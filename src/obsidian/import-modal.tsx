import { App, Modal } from "obsidian";
import DataLoomView from "./dataloom-view";
import { LoomState } from "../shared/types";
import { Root, createRoot } from "react-dom/client";
import ImportApp from "../react/import-app";
import {
	deserializeLoomState,
	serializeLoomState,
} from "src/data/serialize-loom-state";

export default class ImportModal extends Modal {
	root: Root;

	constructor(app: App) {
		super(app);
		this.app = app;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createDiv({ text: "DataLoom Import" });
		const appContainer = contentEl.createDiv();

		const view = app.workspace.getActiveViewOfType(DataLoomView);
		if (view) {
			//Get loom state
			const data = view.getViewData();
			const state = deserializeLoomState(data);

			this.root = createRoot(appContainer);
			this.root.render(
				<ImportApp
					initialState={state}
					onStateSave={(state) => this.handleStateSave(view, state)}
				/>
			);
		}
	}

	private handleStateSave = (view: DataLoomView, state: LoomState) => {
		const serialized = serializeLoomState(state);

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
