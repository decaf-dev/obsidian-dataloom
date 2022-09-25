import React from "react";
import { createRoot, Root } from "react-dom/client";
import { MarkdownRenderChild, MarkdownViewModeType } from "obsidian";

import App from "./App";
import { store } from "./services/redux/store";
import { Provider } from "react-redux";

import NltPlugin from "./main";

export class NltTable extends MarkdownRenderChild {
	el: HTMLElement;
	plugin: NltPlugin;
	tableId: string;
	viewMode: MarkdownViewModeType;
	root: Root;

	constructor(
		el: HTMLElement,
		plugin: NltPlugin,
		tableId: string,
		viewMode: MarkdownViewModeType
	) {
		super(el);
		this.el = el;
		this.plugin = plugin;
		this.tableId = tableId;
		this.viewMode = viewMode;
	}

	async onload() {
		const rootEl = this.el.createEl("div");
		this.root = createRoot(rootEl);
		this.root.render(
			<Provider store={store}>
				<App
					plugin={this.plugin}
					tableId={this.tableId}
					viewMode={this.viewMode}
				/>
			</Provider>
		);
		this.el.children[0].replaceWith(rootEl);
	}

	async onunload() {
		this.root.unmount();
	}
}
