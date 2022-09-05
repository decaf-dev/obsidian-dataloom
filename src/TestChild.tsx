import React from "react";
import ReactDOM from "react-dom";
import { MarkdownRenderChild } from "obsidian";
import parse from "html-react-parser";

const App = ({ element }: { element: HTMLElement }) => {
	return <div>{parse(element.innerHTML)}</div>;
};
export class TestChild extends MarkdownRenderChild {
	el: HTMLElement;
	containerEl: HTMLElement;

	constructor(containerEl: HTMLElement) {
		super(containerEl);
		this.containerEl = containerEl;
	}

	async onload() {
		this.el = this.containerEl.createEl("div");
		ReactDOM.render(<App element={this.containerEl} />, this.el);
		this.containerEl.children[0].replaceWith(this.el);
	}

	async onunload() {
		ReactDOM.unmountComponentAtNode(this.el);
	}
}
