import { MarkdownRenderChild, App as ObsidianApp } from "obsidian";
import React from "react";
import ReactDOM from "react-dom";

import { AppContext } from "./app/services/hooks";
import App from "./app/App";
import ErrorDisplay from "./app/components/ErrorDisplay";
import { loadAppData } from "./app/services/dataUtils";
import { instanceOfErrorData, NltSettings } from "./app/services/state";
import NltPlugin from "main";

//This is our main class that will render the React app to the Obsidian container element
export class NLTTable extends MarkdownRenderChild {
	app: ObsidianApp;
	plugin: NltPlugin;
	settings: NltSettings;
	el: HTMLElement;
	sourcePath: string;

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

	onload() {
		this.el = this.containerEl.createEl("div");

		const data = loadAppData(
			this.plugin,
			this.app,
			this.settings,
			this.containerEl,
			this.sourcePath
		);
		if (instanceOfErrorData(data)) {
			ReactDOM.render(<ErrorDisplay data={data} />, this.el);
		} else {
			ReactDOM.render(
				<AppContext.Provider value={this.app}>
					<App
						plugin={this.plugin}
						settings={this.settings}
						data={data}
						sourcePath={this.sourcePath}
					/>
				</AppContext.Provider>,
				this.el
			);
		}
		this.containerEl.replaceWith(this.el);
	}
}
