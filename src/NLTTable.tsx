import { MarkdownRenderChild, App as ObsidianApp } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { AppContext } from "./app/services/utils";
import App from "./app/App";

//This is our main class that will render the React app to the Obsidian container element
export class NLTTable extends MarkdownRenderChild {
	app: ObsidianApp;
	el: HTMLElement;

	constructor(containerEl: HTMLElement, app: ObsidianApp) {
		super(containerEl);
		this.app = app;
	}

	onload() {
		this.el = this.containerEl.createEl("div");
		ReactDOM.render(
			<AppContext.Provider value={this.app}>
				<App />
			</AppContext.Provider>,
			this.el
		);
		this.containerEl.replaceWith(this.el);
	}

	onunload(): void {}
}
