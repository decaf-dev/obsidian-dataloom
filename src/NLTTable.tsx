import { MarkdownRenderChild, App as ObsidianApp } from "obsidian";
import React from "react";
import ReactDOM from "react-dom";

import { AppContext } from "./app/services/hooks";
import App from "./app/App";
import ErrorDisplay from "./app/components/ErrorDisplay";
import { loadData } from "./app/services/dataUtils";
import { instanceOfErrorData, NltSettings } from "./app/services/state";
import NltPlugin from "main";

//This is our main class that will render the React app to the Obsidian container element
export class NLTTable extends MarkdownRenderChild {
	app: ObsidianApp;
	plugin: NltPlugin;
	settings: NltSettings;
	el: HTMLElement;

	constructor(
		containerEl: HTMLElement,
		app: ObsidianApp,
		plugin: NltPlugin,
		settings: NltSettings
	) {
		super(containerEl);
		this.app = app;
		this.plugin = plugin;
		this.settings = settings;
	}

	onload() {
		this.el = this.containerEl.createEl("div");

		const data = loadData(this.containerEl, this.settings);
		if (instanceOfErrorData(data)) {
			ReactDOM.render(<ErrorDisplay data={data} />, this.el);
		} else {
			ReactDOM.render(
				<AppContext.Provider value={this.app}>
					<App
						plugin={this.plugin}
						settings={this.settings}
						data={data}
					/>
				</AppContext.Provider>,
				this.el
			);
		}
		this.containerEl.replaceWith(this.el);
	}
}
