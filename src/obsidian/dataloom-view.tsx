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
import { EVENT_REFRESH_APP } from "src/shared/events";
import { v4 as uuidv4 } from "uuid";
import { DATA_LOOM_PLUGIN_ID } from "src/main";
import LoomApp from "src/react/loom-app";

export const DATA_LOOM_VIEW = "dashloom";

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

		//This is the view content container
		const container = this.containerEl.children[1];
		this.root = createRoot(container);

		//Add settings button to action bar
		this.addAction("settings", "Settings", () => {
			//Open settings tab
			(this.app as any).setting.open();
			//Navigate to plugin settings
			(this.app as any).setting.openTabById(DATA_LOOM_PLUGIN_ID);
		});

		this.app.workspace.on(
			// @ts-expect-error: not a native Obsidian event
			EVENT_REFRESH_APP,
			this.handleRefreshEvent
		);
	}

	async onClose() {
		this.app.workspace.off(EVENT_REFRESH_APP, this.handleRefreshEvent);
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}

	setViewData(data: string, clear: boolean): void {
		this.data = data;

		const state = deserializeLoomState(data);
		if (clear) {
			//We need to set this in a timeout to prevent errors from React
			setTimeout(() => {
				if (this.root) {
					this.root.unmount();
					const container = this.containerEl.children[1];
					this.root = createRoot(container);
					this.renderApp(this.appId, state);
				}
			}, 0);
		} else {
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

	private handleRefreshEvent = (
		filePath: string,
		sourceAppId: string,
		state: LoomState
	) => {
		if (this.appId !== sourceAppId && filePath === this.file.path) {
			const serialized = serializeLoomState(state);
			this.setViewData(serialized, true);
		}
	};

	private handleSaveLoomState = (appId: string, state: LoomState) => {
		//We need this for when we open a new tab of the same file
		//so that the data is up to date
		const serialized = serializeLoomState(state);
		this.data = serialized;

		//Request a save - every 2s
		this.requestSave();

		//Trigger an event to refresh the other open views of this file
		this.app.workspace.trigger(
			EVENT_REFRESH_APP,
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
					LoomState={state}
					onSaveState={this.handleSaveLoomState}
				/>
			);
		}
	}
}
