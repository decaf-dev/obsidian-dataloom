import { PluginValue, ViewPlugin, EditorView } from "@codemirror/view";

if (process.env.ENABLE_REACT_DEVTOOLS === "true") {
	import("react-devtools");
}
import { loadEmbeddedLoomApps } from "./embedded-app-manager";

/**
 * This plugin is responsible for rendering the loom app in live preview mode.
 * It is instantiated for each open leaf
 */
class EditingViewPlugin implements PluginValue {
	/**
	 * The editor view that this plugin is attached to.
	 */
	private editorView: EditorView;

	constructor(view: EditorView) {
		this.editorView = view;
	}

	/**
	 * Called whenever the markdown of the current leaf is updated.
	 */
	update() {
		const markdownLeaves = app.workspace.getLeavesOfType("markdown");
		const activeLeaf = markdownLeaves.find(
			//@ts-expect-error - private property
			(leaf) => leaf.view.editor.cm === this.editorView
		);
		if (!activeLeaf) return;
		loadEmbeddedLoomApps(activeLeaf, "source");
	}

	// private handleRefreshEvent = (
	// 	sourceFilePath: string,
	// 	sourceAppId: string,
	// 	state: LoomState
	// ) => {
	// 	//Find a loom instance with the same file path
	// 	const app = this.loomApps.find(
	// 		(app) => app.id !== sourceAppId && app.file.path === sourceFilePath
	// 	);
	// 	if (!app) return;

	// 	const { id, parentEl, leaf, file } = app;
	// 	if (!app.root) return;

	// 	setTimeout(() => {
	// 		app.root?.unmount();
	// 		app.root = createRoot(parentEl);
	// 		this.renderApp(id, leaf, file, app.root, state);
	// 	}, 0);
	// };

	// private setupEventListeners() {
	// 	//@ts-expect-error not an native Obsidian event
	// 	app.workspace.on(EVENT_REFRESH_APP, this.handleRefreshEvent);
	// 	//@ts-expect-error not an native Obsidian event
	// 	app.workspace.on(EVENT_REFRESH_EDITING_VIEW, this.update);
	// }

	destroy() {
		// this.loomApps.forEach((app) => app.root?.unmount());
		// this.loomApps = [];
		// app.workspace.off(EVENT_REFRESH_APP, this.handleRefreshEvent);
		// app.workspace.off(EVENT_REFRESH_EDITING_VIEW, this.update);
	}
}

export const editingViewPlugin = ViewPlugin.fromClass(EditingViewPlugin);
