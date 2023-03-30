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
			.setName("Debug mode")
			.setDesc("Turns on console.log for various table events")
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.shouldDebug).onChange(
					async (value) => {
						this.plugin.settings.shouldDebug = value;
						await this.plugin.saveSettings();
					}
				);
			});
	}
}
