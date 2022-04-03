import { Plugin } from "obsidian";

import { NLTTable } from "src/NLTTable";

interface NltSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: NltSettings = {
	mySetting: "default",
};

export default class NltPlugin extends Plugin {
	settings: NltSettings;

	async onload() {
		await this.loadSettings();

		this.registerMarkdownPostProcessor((element, context) => {
			console.log("registerMarkdownPostProcessor callback rerunning!");
			const table = element.getElementsByTagName("table");
			if (table.length === 1) {
				context.addChild(new NLTTable(table[0], this.app));
			}
		});
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
}
