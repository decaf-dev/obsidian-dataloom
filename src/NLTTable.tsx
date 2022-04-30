import { MarkdownRenderChild, App as ObsidianApp } from "obsidian";
import React from "react";
import ReactDOM from "react-dom";
import { AppContext } from "./app/services/hooks";
import App from "./app/App";
import { loadAppData } from "./app/services/dataUtils";
import { NltSettings } from "./app/services/state";
import NltPlugin from "main";

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
		const { tableId, data } = loadAppData(
			this.plugin,
			this.settings,
			this.containerEl,
			this.sourcePath
		);

		//If data is not defined then that means that the table doesn't have a type
		//defintion row. Therefore, it's not a valid NLT table
		if (data) {
			this.el = this.containerEl.createEl("div");
			ReactDOM.render(
				<AppContext.Provider value={this.app}>
					<App
						plugin={this.plugin}
						settings={this.settings}
						data={data}
						sourcePath={this.sourcePath}
						tableId={tableId}
					/>
				</AppContext.Provider>,
				this.el
			);
			this.containerEl.children[0].replaceWith(this.el);
		}
	}
}
