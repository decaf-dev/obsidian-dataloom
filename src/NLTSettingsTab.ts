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

		new Setting(containerEl)
			.setName("Create new tables at attachments folder")
			.setDesc(
        "If true, new tables will be created in the attachments folder " +
        "define in Obsidian settings. Otherwise, the custom location " +
        "below will be used."
      )
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.createAtObsidianAttachmentFolder).onChange(
					async (value) => {
						this.plugin.settings.createAtObsidianAttachmentFolder = value;
						await this.plugin.saveSettings();
					}
				);
			});

		new Setting(containerEl)
			.setName("Custom location for new tables")
			.setDesc(
        "Custom location for newly created tables. Default location is  the " +
        "vault root folder, if not specified."
      )
			.addText((cb) => {
				cb.setValue(this.plugin.settings.customFolderForNewTables).onChange(
					async (value) => {
						this.plugin.settings.customFolderForNewTables = value;
						await this.plugin.saveSettings();
					}
				);
			});
	}
}
