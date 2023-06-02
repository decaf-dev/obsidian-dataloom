import { MarkdownRenderChild } from "obsidian";
import { Root, createRoot } from "react-dom/client";

export default class NLTEmbeddedRenderChild extends MarkdownRenderChild {
	private root: Root | null;

	constructor(containerEl: HTMLElement, filePath: string) {
		super(containerEl);
	}

	onload(): void {
		const container = this.containerEl;

		this.root = createRoot(container);
		this.root.render(<div>Test Child</div>);
	}

	onunload(): void {
		if (this.root) this.root.unmount();
	}
}
