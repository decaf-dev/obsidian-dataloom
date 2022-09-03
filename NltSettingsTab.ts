import { PluginSettingTab, App, Setting } from "obsidian";
import NLTPlugin from "main";

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
			.setName("Excluded tables")
			.setDesc(
				"File paths whose tables will not be rendered as a Notion-Like table. Please separate different paths by commas e.g. folder/note1.md, folder/note2.md, note3.md"
			)
			.addTextArea((text) =>
				text
					.setValue(this.plugin.settings.excludedFiles.join(","))
					.onChange(async (value) => {
						const paths = value.split(",");
						this.plugin.settings.excludedFiles = paths;
						await this.plugin.saveSettings();
					})
			);
	}
}
