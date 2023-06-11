import { PluginValue, ViewPlugin } from "@codemirror/view";

import { MarkdownView, TFile, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { serializeTableState } from "src/data/serialize-table-state";
import { deserializeTableState } from "src/data/serialize-table-state";
import NotionLikeTable from "src/obsidian-shim/build/notion-like-table";
import { store } from "src/redux/global/store";
import { EVENT_REFRESH_TABLES } from "src/shared/events";
import { TableState } from "src/shared/types";
import _ from "lodash";
import {
	findEmbeddedTableFile,
	getEmbeddedTableHeight,
	getEmbeddedTableLinkEls,
	getEmbeddedTableWidth,
	removeEmbeddedLinkChildren,
} from "./utils";
import { v4 as uuidv4 } from "uuid";

class NLTEmbeddedPlugin implements PluginValue {
	private tableApps: {
		id: string;
		parentEl: HTMLElement;
		leaf: WorkspaceLeaf;
		root?: Root;
		file: TFile;
	}[];

	constructor() {
		this.tableApps = [];
		this.setupEventListeners();
	}

	//This is ran on any editor change
	update() {
		const activeView = app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) return;

		const embeddedTableLinkEls = getEmbeddedTableLinkEls(
			activeView.containerEl
		);

		for (let i = 0; i < embeddedTableLinkEls.length; i++) {
			const linkEl = embeddedTableLinkEls[i];
			removeEmbeddedLinkChildren(linkEl);

			const file = findEmbeddedTableFile(linkEl);
			if (!file) return;

			const width = getEmbeddedTableWidth(linkEl);
			const height = getEmbeddedTableHeight(linkEl);

			linkEl.style.width = width;
			linkEl.style.height = height;

			//If we've already created the table, then return
			if (this.tableApps.find((app) => app.file.path === file.path))
				return;

			linkEl.style.backgroundColor = "var(--color-primary)";
			linkEl.style.cursor = "unset";
			linkEl.style.margin = "0px";
			linkEl.style.padding = "0px";

			const tableContainerEl = linkEl.createDiv();
			tableContainerEl.className = "NLT__embedded-container";
			tableContainerEl.style.height = "100%";
			tableContainerEl.style.width = "100%";

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
		 *
		 * Then pass the event on the grandparent
		 */
		tableContainerEl.addEventListener("click", (e) => {
			e.stopPropagation();
		});

		//Get the table state
		const data = await app.vault.read(file);
		const tableState = deserializeTableState(data);

		const table = this.tableApps.find((app) => app.id === appId);
		if (!table) return;

		table.root = createRoot(tableContainerEl);
		this.renderApp(appId, activeView.leaf, file, table.root, tableState);
	}

	private async handleSave(
		tableFile: TFile,
		appId: string,
		state: TableState
	) {
		//Save the new state
		const serialized = serializeTableState(state);
		await app.vault.modify(tableFile, serialized);

		//Tell all other views to refresh
		app.workspace.trigger(
			EVENT_REFRESH_TABLES,
			tableFile.path,
			appId,
			state
		);
	}

	private renderApp(
		id: string,
		leaf: WorkspaceLeaf,
		tableFile: TFile,
		root: Root,
		tableState: TableState
	) {
		//Throttle the save function so we don't save too often
		const throttleHandleSave = _.throttle(this.handleSave, 2000);

		root.render(
			<NotionLikeTable
				appId={id}
				isMarkdownView
				filePath={tableFile.path}
				leaf={leaf}
				store={store}
				tableState={tableState}
				onSaveState={(appId, state) =>
					throttleHandleSave(tableFile, appId, state)
				}
			/>
		);
	}

	private handleRefreshEvent = (
		filePath: string,
		sourceAppId: string,
		state: TableState
	) => {
		//Find a table instance with the same file path
		const app = this.tableApps.find(
			(app) => app.id !== sourceAppId && app.file.path === filePath
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
		app.workspace.on(EVENT_REFRESH_TABLES, this.handleRefreshEvent);
	}

	destroy() {
		this.tableApps.forEach((app) => app.root?.unmount());
		this.tableApps = [];
		app.workspace.off(EVENT_REFRESH_TABLES, this.handleRefreshEvent);
	}
}

export const nltEmbeddedPlugin = ViewPlugin.fromClass(NLTEmbeddedPlugin);
