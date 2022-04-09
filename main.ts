import { Plugin, Editor, MarkdownView, TFile } from "obsidian";

import { NLTTable } from "src/NLTTable";
import { NltSettings, DEFAULT_SETTINGS } from "src/app/services/state";
export default class NltPlugin extends Plugin {
	settings: NltSettings;
	containerElements: HTMLElement[] = [];

	async onload() {
		await this.loadSettings();
		await this.forcePostProcessorReload();

		this.registerMarkdownPostProcessor((element, context) => {
			const table = element.getElementsByTagName("table");
			if (table.length === 1) {
				context.addChild(
					new NLTTable(table[0], this.app, this, this.settings)
				);
			}
		});

		this.registerCommands();
	}

	registerCommands() {
		this.addCommand({
			id: "nlt-add-table",
			name: "Add table",
			editorCallback: (editor: Editor) => {
				editor.replaceSelection(this.emptyTable());
			},
		});
	}

	emptyTable(): string {
		const columnName = "Column 1";
		const rows = [];
		rows[0] = `|  ${columnName}  |`;
		rows[1] = `|  ${Array(columnName.length).fill("-").join("")}  |`;
		rows[2] = `|  text ${Array(columnName.length - 3)
			.fill(" ")
			.join("")}  |`;
		return rows.join("\n");
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async onunload() {
		await this.forcePostProcessorReload();
	}

	async forcePostProcessorReload() {
		const leaves = [
			...this.app.workspace.getLeavesOfType("markdown"),
			...this.app.workspace.getLeavesOfType("edit"),
		];
		for (let i = 0; i < leaves.length; i++) {
			const leaf = leaves[i];
			let view = null;
			if (leaf.view instanceof MarkdownView) view = leaf.view;
			const file = this.app.vault.getAbstractFileByPath(view.file.path);
			if (file instanceof TFile) {
				let content = await this.app.vault.read(file);

				//Find tables
				//Match |---| or | --- |
				//This is uniquely identity a new table
				const hyphenRows = content.match(/\|\s{0,1}-{3,}\s{0,1}\|\n/g);
				for (let i = 0; i < hyphenRows.length; i++) {
					const old = hyphenRows[i];
					const updated = old.replace("-", "--");
					content = content.replace(old, updated);
				}
				this.app.vault.modify(file, content);
			}
		}
	}
}
