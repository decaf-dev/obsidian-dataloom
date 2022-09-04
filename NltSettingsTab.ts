import { PluginSettingTab, App, Setting } from "obsidian";
import NltPlugin from "main";

export default class NltSettingsTab extends PluginSettingTab {
	plugin: NltPlugin;

	constructor(app: App, plugin: NltPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		// new Setting(containerEl)
		// 	.setName("Excluded tables")
		// 	.setDesc(
		// 		"File paths whose tables will not be rendered as a Notion-Like table. Please separate different paths by commas e.g. folder/note1.md, folder/note2.md, note3.md"
		// 	)
		// 	.addTextArea((text) =>
		// 		text
		// 			.setValue(this.plugin.settings.excludedFiles.join(","))
		// 			.onChange(async (value) => {
		// 				const paths = value.split(",");
		// 				this.plugin.settings.excludedFiles = paths;
		// 				await this.plugin.saveSettings();
		// 			})
		// 	);
	}
}
