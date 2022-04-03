import { MarkdownRenderChild, App as ObsidianApp } from "obsidian";
import React from "react";
import ReactDOM from "react-dom";

import { AppContext } from "./app/services/hooks";
import App from "./app/App";
import ErrorDisplay from "./app/components/ErrorDisplay";
import { loadData, instanceOfErrorData } from "./app/services/dataUtils";

//This is our main class that will render the React app to the Obsidian container element
export class NLTTable extends MarkdownRenderChild {
	app: ObsidianApp;
	el: HTMLElement;

	constructor(containerEl: HTMLElement, app: ObsidianApp) {
		super(containerEl);
		this.app = app;
	}

	onload() {
		console.log("On Load Called!");
		const data = loadData(this.containerEl);
		this.el = this.containerEl.createEl("div");

		if (instanceOfErrorData(data)) {
			ReactDOM.render(<ErrorDisplay data={data} />, this.el);
		} else {
			ReactDOM.render(
				<AppContext.Provider value={this.app}>
					<App data={data} />
				</AppContext.Provider>,
				this.el
			);
		}
		this.containerEl.replaceWith(this.el);
	}

	onunload(): void {}
}
