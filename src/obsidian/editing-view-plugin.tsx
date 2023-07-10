import { PluginValue, ViewPlugin, EditorView } from "@codemirror/view";
import { MarkdownView, TFile, WorkspaceLeaf } from "obsidian";

if (process.env.ENABLE_REACT_DEVTOOLS === "true") {
	import("react-devtools");
}
import { Root, createRoot } from "react-dom/client";

import { serializeLoomState } from "src/data/serialize-table-state";
import { deserializeLoomState } from "src/data/serialize-table-state";
import { store } from "src/redux/global/store";
import {
	EVENT_REFRESH_APP,
	EVENT_REFRESH_EDITING_VIEW,
} from "src/shared/events";
import { LoomState } from "src/shared/types";
import _ from "lodash";
import {
	findEmbeddedTableFile,
	getEmbeddedTableHeight,
	getEmbeddedTableLinkEls,
	getEmbeddedTableWidth,
	hasLoadedEmbeddedTable,
} from "./utils";
import { v4 as uuidv4 } from "uuid";
import TableApp from "src/react/table-app";

class EditingViewPlugin implements PluginValue {
	private editorView: EditorView;
	private tableApps: {
		id: string;
		parentEl: HTMLElement;
		leaf: WorkspaceLeaf;
		root?: Root;
		file: TFile;
	}[];

	constructor(view: EditorView) {
		this.editorView = view;
		this.tableApps = [];
		this.setupEventListeners();
	}

	//This is ran on any editor change
	update() {
		const markdownLeaves = app.workspace.getLeavesOfType("markdown");
		const activeLeaf = markdownLeaves.find(
			//@ts-expect-error - private property
			(leaf) => leaf.view.editor.cm === this.editorView
		);
		if (!activeLeaf) return;

		const activeView = activeLeaf.view as MarkdownView;

		const embeddedTableLinkEls = getEmbeddedTableLinkEls(
			activeView.containerEl
		);

		for (let i = 0; i < embeddedTableLinkEls.length; i++) {
			const linkEl = embeddedTableLinkEls[i];

			const { defaultEmbedWidth, defaultEmbedHeight } =
				store.getState().global.settings;

			const width = getEmbeddedTableWidth(linkEl, defaultEmbedWidth);
			const height = getEmbeddedTableHeight(linkEl, defaultEmbedHeight);

			linkEl.style.width = width;
			linkEl.style.height = height;

			if (hasLoadedEmbeddedTable(linkEl)) continue;

			//Clear default Obsidian placeholder children
			linkEl.empty();

			const file = findEmbeddedTableFile(linkEl);
			if (!file) continue;

			//Filter out any old tables
			this.tableApps = this.tableApps.filter(
				(app) => app.file.path !== file.path
			);

			linkEl.style.backgroundColor = "var(--color-primary)";
			linkEl.style.cursor = "unset";
			linkEl.style.margin = "0px";
			linkEl.style.padding = "0px";

			const tableContainerEl = linkEl.createDiv();
			tableContainerEl.className = "DataLoom__embedded-container";
			tableContainerEl.style.height = "100%";
			tableContainerEl.style.width = "100%";
			tableContainerEl.style.padding = "10px 0px";

			const appId = uuidv4();
			this.tableApps.push({
				id: appId,
				leaf: activeView.leaf,
				parentEl: tableContainerEl,
				file,
			});

			//Call a separate function to not block the update function
			this.setupTable(activeView, tableContainerEl, file, appId);
		}
	}

	private async setupTable(
		activeView: MarkdownView,
		tableContainerEl: HTMLElement,
		file: TFile,
		appId: string
	) {
		/**
		 * Stop propagation of the click event. We do this so that the embedded link div
		 * don't navigate to the linked file when it is clicked.
		 */
		tableContainerEl.addEventListener("click", (e) => {
			e.stopPropagation();
		});

		//Get the table state
		const data = await app.vault.read(file);
		const LoomState = deserializeLoomState(data);

		const table = this.tableApps.find((app) => app.id === appId);
		if (!table) return;

		table.root = createRoot(tableContainerEl);
		this.renderApp(appId, activeView.leaf, file, table.root, LoomState);
	}

	private async handleSave(
		tableFile: TFile,
		appId: string,
		state: LoomState
	) {
		//Save the new state
		const serialized = serializeLoomState(state);
		await app.vault.modify(tableFile, serialized);

		//Tell all other views to refresh
		app.workspace.trigger(EVENT_REFRESH_APP, tableFile.path, appId, state);
	}

	private renderApp(
		id: string,
		leaf: WorkspaceLeaf,
		tableFile: TFile,
		root: Root,
		LoomState: LoomState
	) {
		//Throttle the save function so we don't save too often
		const throttleHandleSave = _.throttle(this.handleSave, 2000);

		root.render(
			<TableApp
				appId={id}
				isMarkdownView
				tableFile={tableFile}
				mountLeaf={leaf}
				store={store}
				LoomState={LoomState}
				onSaveState={(appId, state) =>
					throttleHandleSave(tableFile, appId, state)
				}
			/>
		);
	}

	private handleRefreshEvent = (
		sourceFilePath: string,
		sourceAppId: string,
		state: LoomState
	) => {
		//Find a table instance with the same file path
		const app = this.tableApps.find(
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
		this.tableApps.forEach((app) => app.root?.unmount());
		this.tableApps = [];
		app.workspace.off(EVENT_REFRESH_APP, this.handleRefreshEvent);
		app.workspace.off(EVENT_REFRESH_EDITING_VIEW, this.update);
	}
}

export const editingViewPlugin = ViewPlugin.fromClass(EditingViewPlugin);
