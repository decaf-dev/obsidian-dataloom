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

		new Setting(containerEl)
			.setName("Sync interval")
			.setDesc(
				"How often to check in milliseconds for changes between live preview and reading modes. If you switch tabs a lot, you may want to pick a quicker interval. Please restart Obsidian for this to take effect."
			)
			.addDropdown((dropdown) => {
				dropdown.addOption("2000", "Normal - 2000");
				dropdown.addOption("1500", "Fast - 1500");
				dropdown.addOption("1000", "Faster - 1000");
				dropdown.setValue(String(this.plugin.settings.syncInterval));
				dropdown.onChange(async (value) => {
					this.plugin.settings.syncInterval =
						value !== "" ? Number(value) : 0;
					await this.plugin.saveSettings();
				});
			});
	}
}
