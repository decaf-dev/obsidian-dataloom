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
}

export const editingViewPlugin = ViewPlugin.fromClass(EditingViewPlugin);
