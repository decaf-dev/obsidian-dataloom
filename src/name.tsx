import { MarkdownRenderChild, MarkdownSectionInformation } from "obsidian";
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
	el: HTMLElement;

	constructor(
		containerEl: HTMLElement,
		plugin: NltPlugin,
		sectionInfo: MarkdownSectionInformation,
		sourcePath: string
	) {
		super(containerEl);
		this.plugin = plugin;
		this.sectionInfo = sectionInfo;
		this.sourcePath = sourcePath;
	}

	async onload() {
		const { tableIndex, data } = await loadAppData(
			this.plugin,
			this.containerEl,
			this.sourcePath
		);

		//If data is not defined then it isn't a valid table
		if (data) {
			this.el = this.containerEl.createEl("div");
			ReactDOM.render(
				<FocusProvider
					plugin={this.plugin}
					sourcePath={this.sourcePath}
					sectionInfo={this.sectionInfo}
					tableIndex={tableIndex}
					el={this.el}
				>
					<MenuProvider>
						<App
							plugin={this.plugin}
							sectionInfo={this.sectionInfo}
							loadedData={data}
							sourcePath={this.sourcePath}
							tableIndex={tableIndex}
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
