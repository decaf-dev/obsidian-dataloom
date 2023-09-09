import { TextFileView, WorkspaceLeaf } from "obsidian";

import { createRoot, Root } from "react-dom/client";
import { store } from "src/redux/store";
import { LoomState } from "src/shared/loom-state/types";
import { deserializeLoomState, serializeLoomState } from "src/data/serialize";
import { EVENT_APP_REFRESH } from "src/shared/events";
import LoomAppWrapper from "src/react/loom-app";
import { createAppId } from "./utils";

export const DATA_LOOM_VIEW = "dataloom";

export default class DataLoomView extends TextFileView {
	private root: Root | null;
	private appId: string;
	private pluginId: string;
	private pluginVersion: string;

	data: string;

	constructor(leaf: WorkspaceLeaf, pluginId: string, pluginVersion: string) {
		super(leaf);
		this.pluginId = pluginId;
		this.pluginVersion = pluginVersion;
		this.root = null;
		this.data = "";
		this.appId = createAppId();
	}

	async onOpen() {
		//Add offset to the container to account for the mobile action bar
		this.containerEl.style.paddingBottom = "48px";

		//Add settings button to action bar
		this.addAction("settings", "Settings", () => {
			//Open settings tab
			(this.app as any).setting.open();
			//Navigate to plugin settings
			(this.app as any).setting.openTabById(this.pluginId);
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
			if (this.root) {
				this.root.unmount();
			}
			const state = deserializeLoomState(data, this.pluginVersion);
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
		if (!this.file) return "";

		const fileName = this.file.name;
		const extensionIndex = fileName.lastIndexOf(".");
		return fileName.substring(0, extensionIndex);
	}

	private handleSaveLoomState = (appId: string, state: LoomState) => {
		if (!this.file) return;

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
		if (!this.file) return;

		if (this.root) {
			this.root.render(
				<LoomAppWrapper
					app={this.app}
					mountLeaf={this.leaf}
					reactAppId={appId}
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
