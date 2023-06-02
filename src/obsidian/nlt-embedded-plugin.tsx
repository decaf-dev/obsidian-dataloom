import { PluginValue, ViewPlugin } from "@codemirror/view";

import { MarkdownView } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { deserializeTableState } from "src/data/serialize-table-state";
import { NotionLikeTable } from "src/react/table-app";
import { store } from "src/redux/global/store";
import { eventSystem } from "src/shared/event-system/event-system";

class NLTEmbeddedPlugin implements PluginValue {
	root: Root[];

	constructor() {
		this.root = [];
	}

	async update() {
		const activeView = app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) return;

		//Get all embedded links
		const embeddedLinks =
			activeView.containerEl.querySelectorAll(".internal-embed");

		//Get all embedded table links
		const embeddedTableLinks: HTMLElement[] = [];
		for (let i = 0; i < embeddedLinks.length; i++) {
			const file = embeddedLinks[i];
			const src = file.getAttribute("src");
			if (src?.endsWith(".table"))
				embeddedTableLinks.push(file as HTMLElement);
		}

		for (let i = 0; i < embeddedTableLinks.length; i++) {
			const embeddedLink = embeddedTableLinks[i];
			const child = embeddedLink.children[0];
			//Check if the embedded link has a child
			if (child) {
				if (!child.className.includes("file-embed-title")) return;

				//Remove the child, we don't need it
				embeddedLink.removeChild(child);

				//Get the table file that matches the src
				const src = embeddedLink.getAttribute("src")!;
				const tableFile = app.vault
					.getFiles()
					.find((file) => file.name === src);

				if (!tableFile) return;

				embeddedLink.style.height = "300px";
				embeddedLink.style.resize = "vertical";
				embeddedLink.style.backgroundColor = "var(--color-primary)";
				embeddedLink.style.cursor = "unset";
				embeddedLink.style.padding = "0px";

				const container = embeddedLink.createDiv();
				container.style.height = "100%";
				container.style.width = "100%";

				container.addEventListener("click", (e) => {
					e.stopPropagation();
					eventSystem.dispatchEvent("click", e);
				});

				//Render a table
				const data = await app.vault.read(tableFile);
				const tableState = deserializeTableState(data);
				const root = createRoot(container);
				root.render(
					<NotionLikeTable
						fileName={tableFile.basename}
						view={activeView}
						store={store}
						tableState={tableState}
					/>
				);
				this.root.push(root);
			}
		}
	}

	destroy() {
		this.root.forEach((root) => root.unmount());
	}
}

export const nltEmbeddedPlugin = ViewPlugin.fromClass(NLTEmbeddedPlugin);
