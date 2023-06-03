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
import { v4 as uuidv4 } from "uuid";
import { numToPx } from "src/shared/conversion";

class NLTEmbeddedPlugin implements PluginValue {
	private tableApps: {
		id: string;
		parentEl: HTMLElement;
		leaf: WorkspaceLeaf;
		root: Root;
		file: TFile;
	}[];

	constructor() {
		this.tableApps = [];
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

			if (linkEl.children.length === 1) {
				const child = linkEl.children[0];
				if (child.classList.contains("NLT__embedded-container"))
					continue;
			}

			//Remove any children
			for (let i = 0; i < linkEl.children.length; i++) {
				linkEl.removeChild(linkEl.children[i]);
			}

			//Get the table file that matches the src
			const src = linkEl.getAttribute("src");

			let tableFile = app.vault
				.getFiles()
				.find((file) => file.path === src);
			if (tableFile === undefined) {
				tableFile = app.vault
					.getFiles()
					.find((file) => file.name === src);
			}
			if (!tableFile) continue;

			let renderWidth = "100%";
			const width = linkEl.getAttribute("width");
			if (width !== null && width !== "1") renderWidth = numToPx(width);

			let renderHeight = "340px";
			const height = linkEl.getAttribute("height");
			if (height !== null && height !== "1")
				renderHeight = numToPx(height);

			linkEl.style.width = renderWidth;
			linkEl.style.height = renderHeight;
			linkEl.style.backgroundColor = "var(--color-primary)";
			linkEl.style.cursor = "unset";
			linkEl.style.padding = "10px 0px";

			const containerEl = linkEl.createDiv();
			containerEl.className = "NLT__embedded-container";
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

			const appId = uuidv4();
			const root = createRoot(containerEl);
			this.renderApp(appId, activeView.leaf, tableFile, root, tableState);

			this.tableApps.push({
				id: appId,
				leaf: activeView.leaf,
				parentEl: containerEl,
				root,
				file: tableFile,
			});
		}
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
				isEmbedded
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
		const apps = this.tableApps.filter(
			(app) => app.id !== sourceAppId && app.file.path === filePath
		);
		apps.forEach((app) => {
			const { id, parentEl, leaf, file } = app;

			setTimeout(() => {
				app.root.unmount();
				app.root = createRoot(parentEl);
				this.renderApp(id, leaf, file, app.root, state);
			}, 0);
		});
	};

	private setupEventListeners() {
		//@ts-expect-error not an native Obsidian event
		app.workspace.on(EVENT_REFRESH_TABLES, this.handleRefreshEvent);
	}

	destroy() {
		this.tableApps.forEach((app) => app.root.unmount());
		app.workspace.off(EVENT_REFRESH_TABLES, this.handleRefreshEvent);
	}
}

export const nltEmbeddedPlugin = ViewPlugin.fromClass(NLTEmbeddedPlugin);
