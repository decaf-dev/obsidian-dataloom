import { PluginValue, ViewPlugin, ViewUpdate } from "@codemirror/view";

import { loadEmbeddedLoomApps } from "./embedded/embedded-app-manager";
import { App } from "obsidian";

export default function EditingViewPlugin(app: App, pluginVersion: string) {
	return ViewPlugin.fromClass(
		/**
		 * This plugin is responsible for rendering the loom app in live preview mode.
		 * It is instantiated for each open leaf
		 */
		class EditingViewPlugin implements PluginValue {
			/**
			 * Called whenever the markdown of the current leaf is updated.
			 */
			update(update: ViewUpdate) {
				const markdownLeaves =
					app.workspace.getLeavesOfType("markdown");
				const activeLeaf = markdownLeaves.find(
					//@ts-expect-error - private property
					(leaf) => leaf.view.editor.cm === update.view
				);
				if (!activeLeaf) return;
				loadEmbeddedLoomApps(app, pluginVersion, activeLeaf, "source");
			}
		}
	);
}
