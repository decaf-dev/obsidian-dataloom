import { Modal, Notice } from "obsidian";
import NltPlugin from "./main";
import {
	parseTableFromMarkdown,
	parseTableModelFromParsedTable,
} from "./services/io/deserialize";
import { serializeTableModel } from "./services/io/serialize";
import { findTableFile } from "./services/io/utils";
import { generateNLTCodeBlock, randomTableId } from "./services/random";

export default class MigrationModal extends Modal {
	markdown: string;
	codeblockEl: HTMLElement;
	plugin: NltPlugin;
	errorEl: HTMLElement;

	constructor(plugin: NltPlugin) {
		super(plugin.app);
		this.plugin = plugin;
		this.markdown = "";
	}

	private async generateCodeblock(): Promise<string | null> {
		const tableId = randomTableId();
		const codeblock = generateNLTCodeBlock(tableId);
		const table = parseTableFromMarkdown(this.markdown);
		if (table.numColumns < 1 || table.numRows < 1) {
			return null;
		}
		const { file } = await findTableFile(this.plugin, tableId);
		const model = parseTableModelFromParsedTable(table);
		await serializeTableModel(this.plugin, file, model);
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
		markdownEl.addEventListener("input", () => {
			this.markdown = markdownEl.value;
		});

		this.errorEl = contentEl.createDiv({ text: "" });
		this.errorEl.style.fontSize = "12px";
		this.errorEl.style.color = "var(--text-error)";

		const generateEl = contentEl.createEl("button", {
			text: "Generate code block",
		});
		generateEl.className = "mod-cta";
		generateEl.addEventListener("click", async () => {
			const codeblock = await this.generateCodeblock();
			if (codeblock) {
				this.errorEl.setText("");
				this.codeblockEl.setText(codeblock);
			} else {
				this.errorEl.setText("Invalid table markdown");
			}
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
			new Notice("Copied code block to clipboard");
		});
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}
