import React from "react";
import ReactDOM, { unmountComponentAtNode } from "react-dom";
import { MarkdownRenderChild } from "obsidian";

import App from "./App";
import MenuProvider from "./components/MenuProvider";
import FocusProvider from "./components/FocusProvider";

import { loadTableState } from "./services/external/load";
import NltPlugin from "./main";

import { MarkdownTable } from "./services/external/types";

export class NltTable extends MarkdownRenderChild {
	el: HTMLElement;
	plugin: NltPlugin;
	sourcePath: string;
	markdownTable: MarkdownTable;
	tableId: string;
	tableEl: HTMLElement;

	constructor(
		el: HTMLElement,
		plugin: NltPlugin,
		tableId: string,
		markdownTable: MarkdownTable,
		sourcePath: string
	) {
		super(el);
		this.el = el;
		this.plugin = plugin;
		this.tableId = tableId;
		this.markdownTable = markdownTable;
		this.sourcePath = sourcePath;
	}

	async onload() {
		const tableState = await loadTableState(
			this.plugin,
			this.containerEl,
			this.tableId,
			this.markdownTable,
			this.sourcePath
		);

		this.tableEl = this.el.createEl("div");
		ReactDOM.render(
			<FocusProvider
				plugin={this.plugin}
				sourcePath={this.sourcePath}
				tableId={this.tableId}
				markdownTable={this.markdownTable}
				el={this.containerEl}
			>
				<MenuProvider>
					<App
						plugin={this.plugin}
						markdownTable={this.markdownTable}
						tableState={tableState}
						sourcePath={this.sourcePath}
						tableId={this.tableId}
						el={this.containerEl}
					/>
				</MenuProvider>
			</FocusProvider>,
			this.tableEl
		);
		this.el.children[0].replaceWith(this.tableEl);
	}

	async onunload() {
		unmountComponentAtNode(this.tableEl);
	}
}
