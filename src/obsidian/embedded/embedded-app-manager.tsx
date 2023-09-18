import { App, MarkdownView, TFile, WorkspaceLeaf } from "obsidian";

import {
	findEmbeddedLoomFile,
	getEmbeddedLoomLinkEls,
	getLinkWidth,
	getLinkHeight,
	hasLoadedEmbeddedLoom,
} from "./embed-utils";
import { Root, createRoot } from "react-dom/client";
import { store } from "src/redux/store";
import { deserializeLoomState, serializeLoomState } from "src/data/serialize";
import { LoomState } from "src/shared/loom-state/types/loom-state";
import _ from "lodash";
import { EVENT_APP_REFRESH } from "src/shared/events";
import LoomAppWrapper from "src/react/loom-app";
import { createAppId } from "../utils";

interface EmbeddedApp {
	id: string;
	containerEl: HTMLElement;
	leaf: WorkspaceLeaf;
	leafFilePath: string; //Leafs and views are reused, so we need to store a value that won't change
	root?: Root;
	file: TFile;
	mode: "source" | "preview";
}

//Stores all embedded apps
let embeddedApps: EmbeddedApp[] = [];

/**
 * Iterates through all open markdown leaves and then iterates through all embedded loom links
 * for each leaf and renders a loom for each one.
 * This is intended to be used in the `on("layout-change")` callback function
 * @param markdownLeaves - The open markdown leaves
 */
export const loadPreviewModeApps = (
	app: App,
	markdownLeaves: WorkspaceLeaf[],
	pluginVersion: string
) => {
	for (let i = 0; i < markdownLeaves.length; i++) {
		const leaf = markdownLeaves[i];

		const view = leaf.view as MarkdownView;
		const mode = view.getMode();

		if (mode === "preview")
			loadEmbeddedLoomApps(app, pluginVersion, leaf, "preview");
	}
};

/**
 * Iterates through all embedded loom links and renders a Loom for each one.
 * Since a leaf can have an editing and reading view, we specify which child
 * to look in
 * @param markdownLeaf - The leaf that contains the markdown view
 * @param mode - The mode of the markdown view (source or preview)
 */
export const loadEmbeddedLoomApps = (
	app: App,
	pluginVersion: string,
	markdownLeaf: WorkspaceLeaf,
	mode: "source" | "preview"
) => {
	const view = markdownLeaf.view as MarkdownView;
	const linkEls = getEmbeddedLoomLinkEls(view, mode);
	linkEls.forEach((linkEl) =>
		processLinkEl(app, pluginVersion, markdownLeaf, linkEl, mode)
	);
};

/**
 * Removes embedded apps that are found in leaves that are no longer open
 * @param leaves - The open markdown leaves
 */
export const purgeEmbeddedLoomApps = (leaves: WorkspaceLeaf[]) => {
	embeddedApps = embeddedApps.filter((app) =>
		leaves.find(
			(l) => (l.view as MarkdownView).file?.path === app.leafFilePath
		)
	);
};

/**
 * Processes an embedded loom link
 * @param linkEl - The link element that contains the embedded loom
 * @param leaf - The leaf that contains the markdown view
 * @returns
 */
const processLinkEl = async (
	app: App,
	pluginVersion: string,
	leaf: WorkspaceLeaf,
	linkEl: HTMLElement,
	mode: "source" | "preview"
) => {
	//Set the width and height of the embedded loom
	//We do this first because if we have already loaded the loom, we stil want
	//the width and height of the embed to update if the user changes it
	setLinkSize(linkEl);

	//If the loom has already been loaded, we don't need to do anything else
	if (hasLoadedEmbeddedLoom(linkEl)) return;

	const sourcePath = (leaf.view as MarkdownView).file?.path ?? "";
	const file = findEmbeddedLoomFile(app, linkEl, sourcePath);
	if (!file) return;

	resetLinkStyles(linkEl);

	//Create a container
	const containerEl = renderContainerEl(linkEl);

	//Get the loom state
	const data = await app.vault.read(file);
	const state = deserializeLoomState(data, pluginVersion);

	//Store the embed in memory
	const appId = createAppId();
	const embeddedApp: EmbeddedApp = {
		id: appId,
		leaf,
		leafFilePath: sourcePath,
		containerEl,
		file,
		mode,
	};
	embeddedApps.push(embeddedApp);

	//Create the react app
	const root = createRoot(containerEl);
	embeddedApp.root = root;
	renderApp(app, appId, leaf, file, root, state);
};

/**
 * Renders a React app for a loom file
 * @param appId - The unique id of the embedded app
 * @param leaf - The leaf that contains the markdown view
 * @param file - The loom file
 * @param root - The root element of the react app
 * @param state - The loom state
 */
const renderApp = (
	app: App,
	reactAppId: string,
	leaf: WorkspaceLeaf,
	file: TFile,
	root: Root,
	state: LoomState
) => {
	//Throttle the save function so we don't save too often
	const THROTTLE_TIME_MILLIS = 2000;
	const throttleHandleSave = _.throttle(handleSave, THROTTLE_TIME_MILLIS);

	root.render(
		<LoomAppWrapper
			app={app}
			reactAppId={reactAppId}
			isMarkdownView
			loomFile={file}
			mountLeaf={leaf}
			store={store}
			loomState={state}
			onSaveState={(appId, state) =>
				throttleHandleSave(app, file, appId, state)
			}
		/>
	);
};

/**
 * Saves the loom state to the loom file
 * @param file - The loom file
 * @param state - The loom state
 */
const handleSave = async (
	app: App,
	file: TFile,
	appId: string,
	state: LoomState
) => {
	const serialized = serializeLoomState(state);
	await app.vault.modify(file, serialized);

	//Trigger an event to refresh the other open views of this file
	app.workspace.trigger(EVENT_APP_REFRESH, file.path, appId, state);
};

/**
 * Creates a container for the embedded loom
 * This container has padding so that text doesn't touch the edges of the embed
 * @param linkEl - The link element that contains the embedded loom
 */
const renderContainerEl = (linkEl: HTMLElement) => {
	const containerEl = linkEl.createDiv({
		cls: "dataloom-embedded-container",
	});
	containerEl.style.height = "100%";
	containerEl.style.width = "100%";
	containerEl.style.padding = "10px 0px";

	//Stop propagation of the click event. We do this so that the embed link
	//doesn't navigate to the linked file when clicked
	containerEl.addEventListener("click", (e) => {
		e.stopPropagation();
	});
	return containerEl;
};

/**
 * Removes the default Obsidian styles from the link element
 * Obsidian by default will have a gray rectangle with padding and margin
 * @param linkEl - The link element that contains the embedded loom
 */
const resetLinkStyles = (linkEl: HTMLElement) => {
	//Clear default Obsidian placeholder content
	linkEl.empty();

	//Reset styles
	linkEl.style.backgroundColor = "var(--color-primary)";
	linkEl.style.cursor = "unset";
	linkEl.style.margin = "0px";
	linkEl.style.padding = "0px";
};

/**
 * Sets the link size based on the width and height attributes of the link
 * If no width or height is specified, the default width and height is used
 * @example
 * ![[filename.loom|300x300]]
 * //width: 300px
 * //height: 300px
 * @param linkEl - The link element that contains the embedded loom
 */
const setLinkSize = (linkEl: HTMLElement) => {
	const { defaultEmbedWidth, defaultEmbedHeight } =
		store.getState().global.settings;

	const width = getLinkWidth(linkEl, defaultEmbedWidth);
	const height = getLinkHeight(linkEl, defaultEmbedHeight);

	linkEl.style.width = width;
	linkEl.style.height = height;
};
