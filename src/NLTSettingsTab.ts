import { PluginSettingTab, App } from "obsidian";
import NLTPlugin from "./main";
import { Setting } from "obsidian";

export default class NLTSettingsTab extends PluginSettingTab {
	plugin: NLTPlugin;

	constructor(app: App, plugin: NLTPlugin) {
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
