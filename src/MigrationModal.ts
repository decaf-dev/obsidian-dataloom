import { App, Modal, Notice } from "obsidian";
import NltPlugin from "./main";
import { deserializeTable } from "./services/io/deserialize";
import { generateNLTCodeBlock, randomTableId } from "./services/random";

export default class MigrationModal extends Modal {
	markdown: string;
	codeblockEl: HTMLElement;
	plugin: NltPlugin;

	constructor(plugin: NltPlugin) {
		super(plugin.app);
		this.plugin = plugin;
	}

	private async generateCodeblock(): Promise<string> {
		const tableId = randomTableId();
		const codeblock = generateNLTCodeBlock(tableId);
		return codeblock;
	}

	onOpen() {
		const { contentEl, titleEl } = this;

		titleEl.createDiv({ text: "Notion-Like Tables Migration Tool" });

		contentEl.createDiv({ text: "Markdown" });
		const subtitle = contentEl.createDiv({
			text: "Place previous table markdown here",
		});
		subtitle.style.fontSize = "12px";

		const markdownEl = contentEl.createEl("textarea");
		markdownEl.style.width = "100%";
		markdownEl.style.height = "200px";
		markdownEl.style.marginBottom = "10px";
		markdownEl.addEventListener("onChange", () => {
			const value = markdownEl.getText();
			this.markdown = value;
		});

		const generateEl = contentEl.createEl("button", {
			text: "Generate codeblock",
		});
		generateEl.className = "mod-cta";
		generateEl.addEventListener("click", async () => {
			const codeblock = await this.generateCodeblock();
			this.codeblockEl.setText(codeblock);
		});

		contentEl.createEl("hr");

		contentEl.createDiv({ text: "Generated NLT codeblock" });

		this.codeblockEl = contentEl.createEl("textarea");
		this.codeblockEl.style.width = "100%";
		this.codeblockEl.style.height = "100px";
		this.codeblockEl.style.marginBottom = "10px";
		this.codeblockEl.setAttr("readonly", "true");

		const copyEl = contentEl.createEl("button", { text: "Copy" });
		copyEl.addEventListener("click", async () => {
			await navigator.clipboard.writeText(this.codeblockEl.getText());
			new Notice("Copied codeblock to clipboard");
		});
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}
