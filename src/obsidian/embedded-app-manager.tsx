import { MarkdownView, TFile, WorkspaceLeaf } from "obsidian";

import { v4 as uuid } from "uuid";

import {
	findEmbeddedLoomFile,
	getEmbeddedLoomHeight,
	getEmbeddedLoomLinkEls,
	getEmbeddedLoomWidth,
	hasLoadedEmbeddedLoom,
} from "./embed-utils";
import { Root, createRoot } from "react-dom/client";
import { store } from "src/redux/global/store";
import {
	deserializeLoomState,
	serializeLoomState,
} from "src/data/serialize-loom-state";
import { LoomState } from "src/shared/types";
import _ from "lodash";
import LoomApp from "src/react/loom-app";

interface EmbeddedApp {
	id: string;
	containerEl: HTMLElement;
	leaf: WorkspaceLeaf;
	root?: Root;
	file: TFile;
	mode: "source" | "preview";
}

let embeddedApps: EmbeddedApp[] = [];

let registeredLeaves: {
	id: string;
	lastMode: "preview" | "source";
}[] = [];

export const loadPreviewModeApps = (markdownLeaves: WorkspaceLeaf[]) => {
	markdownLeaves.forEach((leaf) => {
		//@ts-expect-error - private property
		const { id } = leaf;

		const view = leaf.view as MarkdownView;
		const mode = view.getMode();

		const registeredLeaf = registeredLeaves.find((leaf) => leaf.id === id);
		if (registeredLeaf) {
			//If the leaf was previously in source mode and is now in preview mode,
			if (registeredLeaf.lastMode === "source" && mode === "preview") {
				loadEmbeddedLoomApps(leaf, "preview");
			}
			registeredLeaf.lastMode = mode;
		} else {
			if (mode === "preview") {
				registeredLeaves.push({ id, lastMode: mode });
				loadEmbeddedLoomApps(leaf, "preview");
			}
		}
	});
};

/**
 * Iterates through all embedded loom links and renders a loop app for each one
 * Since a leaf can have an editing and reading view, we specify which child
 * to look in
 * @param markdownLeaf - The leaf that contains the markdown view
 * @param mode - The mode of the markdown view (source or preview)
 */
export const loadEmbeddedLoomApps = (
	markdownLeaf: WorkspaceLeaf,
	mode: "source" | "preview"
) => {
	const view = markdownLeaf.view as MarkdownView;
	const linkEls = getEmbeddedLoomLinkEls(view, mode);
	console.log(linkEls);
	linkEls.forEach((linkEl) =>
		processEmbeddedLink(linkEl, markdownLeaf, mode)
	);
	console.log(embeddedApps);
};

/**
 * Removes embedded apps that are found in leaves that are no longer open
 * @param leaves - The open markdown leaves
 */
export const purgeEmbeddedLoomApps = (leaves: WorkspaceLeaf[]) => {
	//@ts-expect-error - private property
	const leafIds = leaves.map((leaf) => leaf.id);

	registeredLeaves = registeredLeaves.filter((leaf) =>
		leafIds.includes(leaf.id)
	);
	//@ts-expect-error - private property
	embeddedApps = embeddedApps.filter((app) => leafIds.includes(app.leaf.id));
};

/**
 * Processes an embedded loom link
 * @param linkEl - The link element that contains the embedded loom
 * @param leaf - The leaf that contains the markdown view
 * @returns
 */
const processEmbeddedLink = async (
	linkEl: HTMLElement,
	leaf: WorkspaceLeaf,
	mode: "source" | "preview"
) => {
	//Set the width and height of the embedded loom
	//We do this first because if we have already loaded the loom, we stil want
	//the width and height of the embed to update if the user changes it
	setEmbedSize(linkEl);

	//If the loom has already been loaded, we don't need to do anything else
	if (hasLoadedEmbeddedLoom(linkEl)) return;

	const sourcePath = (leaf.view as MarkdownView).file.path;
	const file = findEmbeddedLoomFile(linkEl, sourcePath);
	if (!file) return;

	//Clear default Obsidian placeholder content
	linkEl.empty();

	//Set link el styles
	linkEl.style.backgroundColor = "var(--color-primary)";
	linkEl.style.cursor = "unset";
	linkEl.style.margin = "0px";
	linkEl.style.padding = "0px";

	const containerEl = linkEl.createDiv({
		cls: "DataLoom__embedded-container",
	});
	containerEl.style.height = "100%";
	containerEl.style.width = "100%";
	containerEl.style.padding = "10px 0px";

	const appId = uuid();
	const embeddedApp: EmbeddedApp = {
		id: appId,
		leaf,
		containerEl,
		file,
		mode,
	};
	embeddedApps.push(embeddedApp);

	//Stop propagation of the click event. We do this so that the embedded link div
	//don't navigate to the linked file when it is clicked.
	containerEl.addEventListener("click", (e) => {
		e.stopPropagation();
	});

	//Get the loom state
	const data = await app.vault.read(file);
	const appState = deserializeLoomState(data);

	embeddedApp.root = createRoot(containerEl);
	renderApp(appId, leaf, file, embeddedApp.root, appState);
};

const renderApp = (
	id: string,
	leaf: WorkspaceLeaf,
	file: TFile,
	root: Root,
	state: LoomState
) => {
	//Throttle the save function so we don't save too often
	const throttleHandleSave = _.throttle(handleSave, 2000);

	root.render(
		<LoomApp
			appId={id}
			isMarkdownView
			loomFile={file}
			mountLeaf={leaf}
			store={store}
			loomState={state}
			onSaveState={(_appId, state) => throttleHandleSave(file, state)}
		/>
	);
};

const handleSave = async (file: TFile, state: LoomState) => {
	const serialized = serializeLoomState(state);
	await app.vault.modify(file, serialized);

	// app.workspace.trigger(EVENT_REFRESH_APP, loomFile.path, appId, state);
};

/**
 * Sets the embed size based on the width or height in the markdown link
 * If no width or height is specified, the default width and height is used
 * @example
 * ![[filename.loom|300x300]]
 * //width: 300px
 * //height: 300px
 * @param linkEl - The link element that contains the embedded loom
 */
const setEmbedSize = (linkEl: HTMLElement) => {
	const { defaultEmbedWidth, defaultEmbedHeight } =
		store.getState().global.settings;

	const width = getEmbeddedLoomWidth(linkEl, defaultEmbedWidth);
	const height = getEmbeddedLoomHeight(linkEl, defaultEmbedHeight);

	linkEl.style.width = width;
	linkEl.style.height = height;
};
