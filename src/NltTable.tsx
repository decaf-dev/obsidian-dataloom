import { MarkdownRenderChild, MarkdownSectionInformation } from "obsidian";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { loadTableState } from "./services/external/load";
import NltPlugin from "./main";
import MenuProvider from "./components/MenuProvider";
import FocusProvider from "./components/FocusProvider";

import { createRoot, Root } from "react-dom/client";

export class NltTable extends MarkdownRenderChild {
	plugin: NltPlugin;
	sourcePath: string;
	sectionInfo: MarkdownSectionInformation;
	blockId: string;
	root: Root;

	constructor(
		plugin: NltPlugin,
		containerEl: HTMLElement,
		blockId: string,
		sectionInfo: MarkdownSectionInformation,
		sourcePath: string
	) {
		super(containerEl);
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

		this.root = createRoot(this.containerEl);
		this.root.render(
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
			</FocusProvider>
		);
	}

	async onunload() {
		this.root.unmount();
	}
}
