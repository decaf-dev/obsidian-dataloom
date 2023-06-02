import { PluginValue, ViewPlugin } from "@codemirror/view";

import { MarkdownView, TFile, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { serializeTableState } from "src/data/serialize-table-state";
import { deserializeTableState } from "src/data/serialize-table-state";
import { NotionLikeTable } from "src/react/table-app";
import { store } from "src/redux/global/store";
import { eventSystem } from "src/shared/event-system/event-system";
import { EVENT_REFRESH_TABLES } from "src/shared/events";
import { TableState } from "src/shared/types/types";
import _ from "lodash";
import { getEmbeddedTableLinkEls } from "./utils";

class NLTEmbeddedPlugin implements PluginValue {
	activeTables: {
		leaf: WorkspaceLeaf;
		containerEl: HTMLElement;
		root: Root;
		file: TFile;
	}[];

	constructor() {
		this.activeTables = [];
		this.setupEventListeners();
	}

	//This is ran on any editor change
	async update() {
		const activeView = app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) return;

		const embeddedTableLinkEls = getEmbeddedTableLinkEls(
			activeView.containerEl
		);

		for (let i = 0; i < embeddedTableLinkEls.length; i++) {
			const linkEl = embeddedTableLinkEls[i];
			const child = linkEl.children[0];

			//If the child is not a title, we have already mounted an app
			if (!child.className.includes("file-embed-title")) return;

			//Remove the child, we don't need it
			linkEl.removeChild(child);

			//Get the table file that matches the src
			const src = linkEl.getAttribute("src")!;
			const tableFile = app.vault
				.getFiles()
				.find((file) => file.name === src);

			if (!tableFile) return;

			linkEl.style.height = "300px";
			linkEl.style.backgroundColor = "var(--color-primary)";
			linkEl.style.cursor = "unset";
			linkEl.style.padding = "0px";

			const containerEl = linkEl.createDiv();
			containerEl.style.height = "100%";
			containerEl.style.width = "100%";

			/**
			 * Setup event listeners
			 *
			 * We do this so we can stop propagation to the embedded link,
			 * otherwise we will navigate to the linked file when it is clicked.
			 * The containerEl listener is needed because the event bubbling chain is broken
			 * between the embedded link and the container when we stop propagation.
			 */
			activeView.containerEl.addEventListener("click", (e) => {
				eventSystem.dispatchEvent("click", e);
			});
			containerEl.addEventListener("click", (e) => {
				e.stopPropagation();
				eventSystem.dispatchEvent("click", e);
			});

			//Get the table state
			const data = await app.vault.read(tableFile);
			const tableState = deserializeTableState(data);

			const root = createRoot(containerEl);
			this.renderApp(activeView.leaf, tableFile, root, tableState);

			this.activeTables.push({
				leaf: activeView.leaf,
				containerEl,
				root,
				file: tableFile,
			});
		}
	}

	private renderApp(
		leaf: WorkspaceLeaf,
		tableFile: TFile,
		root: Root,
		tableState: TableState
	) {
		async function handleSave(value: TableState) {
			//Save the new state
			const serialized = serializeTableState(value);
			await app.vault.modify(tableFile, serialized);

			//Tell all other views to refresh
			app.workspace.trigger(
				EVENT_REFRESH_TABLES,
				leaf,
				tableFile.path,
				value
			);
		}

		//Throttle the save function so we don't save too often
		//This is the same time as the `debounceFunction`
		const throttleHandleSave = _.throttle(handleSave, 2000);

		root.render(
			<NotionLikeTable
				fileName={tableFile.name}
				leaf={leaf}
				store={store}
				tableState={tableState}
				onSaveState={throttleHandleSave}
			/>
		);
	}

	private handleRefreshEvent = (
		leaf: WorkspaceLeaf,
		filePath: string,
		tableState: TableState
	) => {
		const table = this.activeTables.find(
			(table) => table.file.path === filePath
		);
		if (!table) return;
		const { leaf: tableLeaf } = table;
		if (leaf === tableLeaf) return;

		const { containerEl, root } = table;

		root.unmount();
		table.root = createRoot(containerEl);
		this.renderApp(tableLeaf, table.file, table.root, tableState);
	};

	private setupEventListeners() {
		//@ts-expect-error not an native Obsidian event
		app.workspace.on(EVENT_REFRESH_TABLES, this.handleRefreshEvent);
	}

	destroy() {
		this.activeTables.forEach((table) => table.root.unmount());
		app.workspace.off(EVENT_REFRESH_TABLES, this.handleRefreshEvent);
	}
}

export const nltEmbeddedPlugin = ViewPlugin.fromClass(NLTEmbeddedPlugin);
