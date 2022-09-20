import { PluginSettingTab, App } from "obsidian";
import NltPlugin from "./main";
import { Setting } from "obsidian";

export default class NltSettingsTab extends PluginSettingTab {
	plugin: NltPlugin;

	constructor(app: App, plugin: NltPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Table definition folder")
			.setDesc(
				"The folder that contains the NLT table definition files. Do not include any slashes. e.g. '_notion-like-tables'"
			)
			.addText((text) => {
				text.setValue(this.plugin.settings.tableFolder).onChange(
					async (value) => {
						this.plugin.settings.tableFolder = value;
						await this.plugin.saveSettings();
					}
				);
			});
	}
}
