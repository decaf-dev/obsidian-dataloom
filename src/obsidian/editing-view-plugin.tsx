import { PluginValue, ViewPlugin, EditorView } from "@codemirror/view";
import { MarkdownView, TFile, WorkspaceLeaf } from "obsidian";

if (process.env.ENABLE_REACT_DEVTOOLS === "true") {
	import("react-devtools");
}
import { Root, createRoot } from "react-dom/client";

import { serializeDashboardState } from "src/data/serialize-dashboard-state";
import { deserializeDashboardState } from "src/data/serialize-dashboard-state";
import { store } from "src/redux/global/store";
import {
	EVENT_REFRESH_APP,
	EVENT_REFRESH_EDITING_VIEW,
} from "src/shared/events";
import { DashboardState } from "src/shared/types";
import _ from "lodash";
import {
	findEmbeddedTableFile,
	getEmbeddedDashboardHeight,
	getEmbeddedDashboardLinkEls,
	getEmbeddedDashboardWidth,
	hasLoadedEmbeddedDashboard,
} from "./utils";
import { v4 as uuidv4 } from "uuid";
import DashboardApp from "src/react/dashboard-app";

class EditingViewPlugin implements PluginValue {
	private editorView: EditorView;
	private dashboardApps: {
		id: string;
		parentEl: HTMLElement;
		leaf: WorkspaceLeaf;
		root?: Root;
		file: TFile;
	}[];

	constructor(view: EditorView) {
		this.editorView = view;
		this.dashboardApps = [];
		this.setupEventListeners();
	}

	//This is ran on any editor change
	update() {
		console.log("update() called");
		const markdownLeaves = app.workspace.getLeavesOfType("markdown");
		const activeLeaf = markdownLeaves.find(
			//@ts-expect-error - private property
			(leaf) => leaf.view.editor.cm === this.editorView
		);
		if (!activeLeaf) return;

		const activeView = activeLeaf.view as MarkdownView;

		const embeddedTableLinkEls = getEmbeddedDashboardLinkEls(
			activeView.containerEl
		);

		for (let i = 0; i < embeddedTableLinkEls.length; i++) {
			const linkEl = embeddedTableLinkEls[i];

			const { defaultEmbedWidth, defaultEmbedHeight } =
				store.getState().global.settings;

			const width = getEmbeddedDashboardWidth(linkEl, defaultEmbedWidth);
			const height = getEmbeddedDashboardHeight(
				linkEl,
				defaultEmbedHeight
			);

			linkEl.style.width = width;
			linkEl.style.height = height;

			if (hasLoadedEmbeddedDashboard(linkEl)) continue;

			//Clear default Obsidian placeholder children
			linkEl.empty();

			const file = findEmbeddedTableFile(linkEl);
			if (!file) continue;

			//Filter out any old dashboards
			this.dashboardApps = this.dashboardApps.filter(
				(app) => app.file.path !== file.path
			);

			linkEl.style.backgroundColor = "var(--color-primary)";
			linkEl.style.cursor = "unset";
			linkEl.style.margin = "0px";
			linkEl.style.padding = "0px";

			const dashboardContainerEl = linkEl.createDiv();
			dashboardContainerEl.className = "Dashboards__embedded-container";
			dashboardContainerEl.style.height = "100%";
			dashboardContainerEl.style.width = "100%";
			dashboardContainerEl.style.padding = "10px 0px";

			const appId = uuidv4();
			this.dashboardApps.push({
				id: appId,
				leaf: activeView.leaf,
				parentEl: dashboardContainerEl,
				file,
			});

			//Call a separate function to not block the update function
			this.setupTable(activeView, dashboardContainerEl, file, appId);
		}
	}

	private async setupTable(
		activeView: MarkdownView,
		dashboardContainerEl: HTMLElement,
		file: TFile,
		appId: string
	) {
		/**
		 * Stop propagation of the click event. We do this so that the embedded link div
		 * don't navigate to the linked file when it is clicked.
		 */
		dashboardContainerEl.addEventListener("click", (e) => {
			e.stopPropagation();
		});

		//Get the dashboard state
		const data = await app.vault.read(file);
		const dashboardState = deserializeDashboardState(data);

		const dashboard = this.dashboardApps.find((app) => app.id === appId);
		if (!dashboard) return;

		dashboard.root = createRoot(dashboardContainerEl);
		this.renderApp(
			appId,
			activeView.leaf,
			file,
			dashboard.root,
			dashboardState
		);
	}

	private async handleSave(
		dashboardFile: TFile,
		appId: string,
		state: DashboardState
	) {
		//Save the new state
		const serialized = serializeDashboardState(state);
		await app.vault.modify(dashboardFile, serialized);

		//Tell all other views to refresh
		app.workspace.trigger(
			EVENT_REFRESH_APP,
			dashboardFile.path,
			appId,
			state
		);
	}

	private renderApp(
		id: string,
		leaf: WorkspaceLeaf,
		dashboardFile: TFile,
		root: Root,
		dashboardState: DashboardState
	) {
		//Throttle the save function so we don't save too often
		const throttleHandleSave = _.throttle(this.handleSave, 2000);

		root.render(
			<DashboardApp
				appId={id}
				isMarkdownView
				tableFile={dashboardFile}
				mountLeaf={leaf}
				store={store}
				dashboardState={dashboardState}
				onSaveState={(appId, state) =>
					throttleHandleSave(dashboardFile, appId, state)
				}
			/>
		);
	}

	private handleRefreshEvent = (
		sourceFilePath: string,
		sourceAppId: string,
		state: DashboardState
	) => {
		//Find a dashboard instance with the same file path
		const app = this.dashboardApps.find(
			(app) => app.id !== sourceAppId && app.file.path === sourceFilePath
		);
		if (!app) return;

		const { id, parentEl, leaf, file } = app;
		if (!app.root) return;

		setTimeout(() => {
			app.root?.unmount();
			app.root = createRoot(parentEl);
			this.renderApp(id, leaf, file, app.root, state);
		}, 0);
	};

	private setupEventListeners() {
		//@ts-expect-error not an native Obsidian event
		app.workspace.on(EVENT_REFRESH_APP, this.handleRefreshEvent);
		//@ts-expect-error not an native Obsidian event
		app.workspace.on(EVENT_REFRESH_EDITING_VIEW, this.update);
	}

	destroy() {
		this.dashboardApps.forEach((app) => app.root?.unmount());
		this.dashboardApps = [];
		app.workspace.off(EVENT_REFRESH_APP, this.handleRefreshEvent);
		app.workspace.off(EVENT_REFRESH_EDITING_VIEW, this.update);
	}
}

export const editingViewPlugin = ViewPlugin.fromClass(EditingViewPlugin);
