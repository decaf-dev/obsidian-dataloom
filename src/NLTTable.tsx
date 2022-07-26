import { MarkdownRenderChild, App as ObsidianApp } from "obsidian";
import React from "react";
import ReactDOM from "react-dom";
import App from "./app/App";
import { loadAppData } from "./app/services/appData/external/load";
import { NltSettings } from "./app/services/settings";
import NltPlugin from "main";
import MenuProvider from "./app/components/MenuProvider";
import FocusProvider from "./app/components/FocusProvider";

//This is our main class that will render the React app to the Obsidian container element
export class NLTTable extends MarkdownRenderChild {
	app: ObsidianApp;
	plugin: NltPlugin;
	settings: NltSettings;
	el: HTMLElement;
	sourcePath: string;
	parent: HTMLElement;

	constructor(
		containerEl: HTMLElement,
		app: ObsidianApp,
		plugin: NltPlugin,
		settings: NltSettings,
		sourcePath: string
	) {
		super(containerEl);
		this.app = app;
		this.plugin = plugin;
		this.settings = settings;
		this.sourcePath = sourcePath;
	}

	async onload() {
		const { tableIndex, data } = await loadAppData(
			this.plugin,
			this.settings,
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
					tableIndex={tableIndex}
					el={this.el}
				>
					<MenuProvider>
						<App
							plugin={this.plugin}
							settings={this.settings}
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
