import { MarkdownRenderChild, MarkdownSectionInformation } from "obsidian";
import React from "react";
import ReactDOM, { unmountComponentAtNode } from "react-dom";
import App from "./App";
import { loadTableState } from "./services/external/load";
import NltPlugin from "./main";
import MenuProvider from "./components/MenuProvider";
import FocusProvider from "./components/FocusProvider";

export class NltTable extends MarkdownRenderChild {
	el: HTMLElement;
	plugin: NltPlugin;
	sourcePath: string;
	sectionInfo: MarkdownSectionInformation;
	blockId: string;
	tableEl: HTMLElement;

	constructor(
		el: HTMLElement,
		plugin: NltPlugin,
		blockId: string,
		sectionInfo: MarkdownSectionInformation,
		sourcePath: string
	) {
		super(el);
		this.el = el;
		this.plugin = plugin;
		this.blockId = blockId;
		this.sectionInfo = sectionInfo;
		this.sourcePath = sourcePath;
	}

	async onload() {
		const tableState = await loadTableState(
			this.plugin,
			this.containerEl,
			this.blockId,
			this.sectionInfo,
			this.sourcePath
		);

		this.tableEl = this.el.createEl("div");
		ReactDOM.render(
			<FocusProvider
				plugin={this.plugin}
				sourcePath={this.sourcePath}
				sectionInfo={this.sectionInfo}
				blockId={this.blockId}
				el={this.containerEl}
			>
				<MenuProvider>
					<App
						plugin={this.plugin}
						sectionInfo={this.sectionInfo}
						tableState={tableState}
						sourcePath={this.sourcePath}
						blockId={this.blockId}
						el={this.containerEl}
					/>
				</MenuProvider>
			</FocusProvider>,
			this.tableEl
		);
	}

	async onunload() {
		unmountComponentAtNode(this.tableEl);
	}
}
