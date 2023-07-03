import { TextFileView, WorkspaceLeaf } from "obsidian";

import "react-devtools";
import { createRoot, Root } from "react-dom/client";
import { store } from "src/redux/global/store";
import { TableState } from "src/shared/types";
import {
	deserializeTableState,
	serializeTableState,
} from "src/data/serialize-table-state";
import { EVENT_REFRESH_TABLES } from "src/shared/events";
import ExportModal from "./export-modal";
import { v4 as uuidv4 } from "uuid";
import DashboardsApp from "src/react/dashboard-app";
import { DASHBOARDS_PLUGIN_ID } from "src/main";

export const DASHBOARDS_VIEW = "dashboards";

export default class DashboardsView extends TextFileView {
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
			(this.app as any).setting.openTabById(DASHBOARDS_PLUGIN_ID);
		});

		this.addAction("download", "Export", () => {
			new ExportModal(this.app, this.file.path).open();
		});

		this.app.workspace.on(
			// @ts-expect-error: not a native Obsidian event
			EVENT_REFRESH_TABLES,
			this.handleRefreshEvent
		);
	}

	async onClose() {
		this.app.workspace.off(EVENT_REFRESH_TABLES, this.handleRefreshEvent);
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}

	setViewData(data: string, clear: boolean): void {
		this.data = data;

		const state = deserializeTableState(data);
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
		return DASHBOARDS_VIEW;
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
		state: TableState
	) => {
		if (this.appId !== sourceAppId && filePath === this.file.path) {
			const serialized = serializeTableState(state);
			this.setViewData(serialized, true);
		}
	};

	private handleSaveTableState = (appId: string, state: TableState) => {
		//We need this for when we open a new tab of the same file
		//so that the data is up to date
		const serialized = serializeTableState(state);
		this.data = serialized;

		//Request a save - every 2s
		this.requestSave();

		//Trigger an event to refresh the other open views of this file
		this.app.workspace.trigger(
			EVENT_REFRESH_TABLES,
			this.file.path,
			appId,
			state
		);
	};

	private renderApp(appId: string, state: TableState) {
		if (this.root) {
			this.root.render(
				<DashboardsApp
					leaf={this.leaf}
					appId={appId}
					filePath={this.file.path}
					isMarkdownView={false}
					store={store}
					tableState={state}
					onSaveState={this.handleSaveTableState}
				/>
			);
		}
	}
}
