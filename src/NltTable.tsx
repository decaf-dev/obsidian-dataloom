import {
	ItemView,
	MarkdownRenderChild,
	MarkdownSectionInformation,
} from "obsidian";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { loadAppData } from "./services/appData/external/load";
import NltPlugin from "main";
import MenuProvider from "./components/MenuProvider";
import FocusProvider from "./components/FocusProvider";

//This is our main class that will render the React app to the Obsidian container element
export class NltTable extends MarkdownRenderChild {
	plugin: NltPlugin;
	sourcePath: string;
	sectionInfo: MarkdownSectionInformation;
	blockId: string;
	el: HTMLElement;

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
		const appData = await loadAppData(
			this.plugin,
			this.containerEl,
			this.blockId,
			this.sourcePath
		);

		//If data is not defined then it isn't a valid table
		if (appData) {
			this.el = this.containerEl.createEl("div");
			ReactDOM.render(
				<FocusProvider
					plugin={this.plugin}
					sourcePath={this.sourcePath}
					sectionInfo={this.sectionInfo}
					blockId={this.blockId}
					el={this.el}
				>
					<MenuProvider>
						<App
							plugin={this.plugin}
							sectionInfo={this.sectionInfo}
							loadedData={appData}
							sourcePath={this.sourcePath}
							blockId={this.blockId}
							el={this.containerEl}
						/>
					</MenuProvider>
				</FocusProvider>,
				this.el
			);
			this.containerEl.children[0].replaceWith(this.el);
		}
	}

	async onunload() {
		ReactDOM.unmountComponentAtNode(this.el);
	}
}
