import { TextFileView, WorkspaceLeaf } from "obsidian";

if (process.env.ENABLE_REACT_DEVTOOLS === "true") {
	import("react-devtools");
}

import { createRoot, Root } from "react-dom/client";
import { store } from "src/redux/global/store";
import { LoomState } from "src/shared/types";
import {
	deserializeLoomState,
	serializeLoomState,
} from "src/data/serialize-loom-state";
import { EVENT_APP_REFRESH } from "src/shared/events";
import { v4 as uuidv4 } from "uuid";
import { DATA_LOOM_PLUGIN_ID } from "src/main";
import LoomApp from "src/react/loom-app";

export const DATA_LOOM_VIEW = "dataloom";

export default class DataLoomView extends TextFileView {
	private root: Root | null;
	private appId: string;

	data: string;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
		this.root = null;
		this.data = "";
		this.appId = uuidv4();
	}

	async onOpen() {
		//Add offset to the container to account for the mobile action bar
		this.containerEl.style.paddingBottom = "48px";

		//Add settings button to action bar
		this.addAction("settings", "Settings", () => {
			//Open settings tab
			(this.app as any).setting.open();
			//Navigate to plugin settings
			(this.app as any).setting.openTabById(DATA_LOOM_PLUGIN_ID);
		});
	}

	async onClose() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}

	setViewData(data: string, clear: boolean): void {
		this.data = data;

		//This is only called when the view is initially opened
		if (clear) {
			const state = deserializeLoomState(data);
			const container = this.containerEl.children[1];
			this.root = createRoot(container);
			this.renderApp(this.appId, state);
		}
	}

	clear(): void {
		this.data = "{}";
	}

	getViewData(): string {
		return this.data;
	}

	getViewType() {
		return DATA_LOOM_VIEW;
	}

	getDisplayText() {
		const fileName = this.file?.name;
		if (fileName) {
			const extensionIndex = fileName.lastIndexOf(".");
			return fileName.substring(0, extensionIndex);
		}
		return "";
	}

	private handleSaveLoomState = (appId: string, state: LoomState) => {
		//We need this for when we open a new tab of the same file
		//so that the data is up to date
		const serialized = serializeLoomState(state);
		this.setViewData(serialized, false);

		//Request a save - every 2s
		this.requestSave();

		//Trigger an event to refresh the other open views of this file
		this.app.workspace.trigger(
			EVENT_APP_REFRESH,
			this.file.path,
			appId,
			state
		);
	};

	private renderApp(appId: string, state: LoomState) {
		if (this.root) {
			this.root.render(
				<LoomApp
					mountLeaf={this.leaf}
					appId={appId}
					loomFile={this.file}
					isMarkdownView={false}
					store={store}
					loomState={state}
					onSaveState={this.handleSaveLoomState}
				/>
			);
		}
	}
}
