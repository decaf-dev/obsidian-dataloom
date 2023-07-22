import { PluginValue, ViewPlugin, EditorView } from "@codemirror/view";
import { MarkdownView, TFile, WorkspaceLeaf } from "obsidian";

if (process.env.ENABLE_REACT_DEVTOOLS === "true") {
	import("react-devtools");
}
import { Root, createRoot } from "react-dom/client";

import { serializeLoomState } from "src/data/serialize-loom-state";
import { deserializeLoomState } from "src/data/serialize-loom-state";
import { store } from "src/redux/global/store";
import {
	EVENT_REFRESH_APP,
	EVENT_REFRESH_EDITING_VIEW,
} from "src/shared/events";
import { LoomState } from "src/shared/types";
import _ from "lodash";
import {
	findEmbeddedLoomFile,
	getEmbeddedLoomHeight,
	getEmbeddedLoomLinkEls,
	getEmbeddedLoomWidth,
	hasLoadedEmbeddedLoom,
} from "./utils";
import { v4 as uuidv4 } from "uuid";
import LoomApp from "src/react/loom-app";

class EditingViewPlugin implements PluginValue {
	private editorView: EditorView;
	private loomApps: {
		id: string;
		parentEl: HTMLElement;
		leaf: WorkspaceLeaf;
		root?: Root;
		file: TFile;
	}[];

	constructor(view: EditorView) {
		this.editorView = view;
		this.loomApps = [];
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

		const embeddedLoomLinkEls = getEmbeddedLoomLinkEls(
			activeView.containerEl
		);

		for (let i = 0; i < embeddedLoomLinkEls.length; i++) {
			const linkEl = embeddedLoomLinkEls[i];

			const { defaultEmbedWidth, defaultEmbedHeight } =
				store.getState().global.settings;

			const width = getEmbeddedLoomWidth(linkEl, defaultEmbedWidth);
			const height = getEmbeddedLoomHeight(linkEl, defaultEmbedHeight);

			linkEl.style.width = width;
			linkEl.style.height = height;

			if (hasLoadedEmbeddedLoom(linkEl)) continue;

			//Clear default Obsidian placeholder children
			linkEl.empty();

			const sourcePath = activeView.file.path;
			const file = findEmbeddedLoomFile(linkEl, sourcePath);
			if (!file) continue;

			//Filter out any old looms
			this.loomApps = this.loomApps.filter(
				(app) => app.file.path !== file.path
			);

			linkEl.style.backgroundColor = "var(--color-primary)";
			linkEl.style.cursor = "unset";
			linkEl.style.margin = "0px";
			linkEl.style.padding = "0px";

			const loomContainerEl = linkEl.createDiv();
			loomContainerEl.className = "DataLoom__embedded-container";
			loomContainerEl.style.height = "100%";
			loomContainerEl.style.width = "100%";
			loomContainerEl.style.padding = "10px 0px";

			const appId = uuidv4();
			this.loomApps.push({
				id: appId,
				leaf: activeView.leaf,
				parentEl: loomContainerEl,
				file,
			});

			//Call a separate function to not block the update function
			this.setupLoom(activeView, loomContainerEl, file, appId);
		}
	}

	private async setupLoom(
		activeView: MarkdownView,
		loomContainerEl: HTMLElement,
		file: TFile,
		appId: string
	) {
		/**
		 * Stop propagation of the click event. We do this so that the embedded link div
		 * don't navigate to the linked file when it is clicked.
		 */
		loomContainerEl.addEventListener("click", (e) => {
			e.stopPropagation();
		});

		//Get the loom state
		const data = await app.vault.read(file);
		const LoomState = deserializeLoomState(data);

		const loom = this.loomApps.find((app) => app.id === appId);
		if (!loom) return;

		loom.root = createRoot(loomContainerEl);
		this.renderApp(appId, activeView.leaf, file, loom.root, LoomState);
	}

	private async handleSave(loomFile: TFile, appId: string, state: LoomState) {
		//Save the new state
		const serialized = serializeLoomState(state);
		await app.vault.modify(loomFile, serialized);

		//Tell all other views to refresh
		app.workspace.trigger(EVENT_REFRESH_APP, loomFile.path, appId, state);
	}

	private renderApp(
		id: string,
		leaf: WorkspaceLeaf,
		loomFile: TFile,
		root: Root,
		LoomState: LoomState
	) {
		//Throttle the save function so we don't save too often
		const throttleHandleSave = _.throttle(this.handleSave, 2000);

		root.render(
			<LoomApp
				appId={id}
				isMarkdownView
				loomFile={loomFile}
				mountLeaf={leaf}
				store={store}
				LoomState={LoomState}
				onSaveState={(appId, state) =>
					throttleHandleSave(loomFile, appId, state)
				}
			/>
		);
	}

	private handleRefreshEvent = (
		sourceFilePath: string,
		sourceAppId: string,
		state: LoomState
	) => {
		//Find a loom instance with the same file path
		const app = this.loomApps.find(
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
		this.loomApps.forEach((app) => app.root?.unmount());
		this.loomApps = [];
		app.workspace.off(EVENT_REFRESH_APP, this.handleRefreshEvent);
		app.workspace.off(EVENT_REFRESH_EDITING_VIEW, this.update);
	}
}

export const editingViewPlugin = ViewPlugin.fromClass(EditingViewPlugin);
