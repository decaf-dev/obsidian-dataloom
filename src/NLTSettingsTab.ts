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

		containerEl.createEl("h2", { text: "Notion-Like Tables" });
		containerEl.createSpan(
			{},
			(span) =>
				(span.innerHTML = `<strong style="color: var(--text-accent); font-size: 12px;">Please restart Obsidian for these settings to take effect</strong>`)
		);

		new Setting(containerEl).setName("Debug").setHeading();
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

		new Setting(containerEl).setName("File").setHeading();

		const attachmentsFolderDesc = new DocumentFragment();
		attachmentsFolderDesc.createSpan({}, (span) => {
			span.innerHTML = `Create tables in the attachments folder defined in the Obsidian settings.<br><br>This can be changed in <span style="color: var(--text-accent);">Files & Links -> Default location for new attachments</span><br><br>Otherwise, the custom location below will be used.`;
		});

		new Setting(containerEl)
			.setName("Create new tables in the attachments folder")
			.setDesc(attachmentsFolderDesc)
			.addToggle((cb) => {
				cb.setValue(
					this.plugin.settings.createAtObsidianAttachmentFolder
				).onChange(async (value) => {
					this.plugin.settings.createAtObsidianAttachmentFolder =
						value;
					await this.plugin.saveSettings();
					this.display();
				});
			});

		const customLocationDesc = new DocumentFragment();
		customLocationDesc.createSpan({}, (span) => {
			span.innerHTML = `Folder that new tables will be created in. Please don't include a slash at the start or end.<br>e.g. <strong>myfolder/subdirectory</strong><br><br>Default location is the vault root folder, if not specified.`;
		});

		if (this.plugin.settings.createAtObsidianAttachmentFolder === false) {
			new Setting(containerEl)
				.setName("Custom location for new tables")
				.setDesc(customLocationDesc)
				.addText((cb) => {
					cb.setValue(
						this.plugin.settings.customFolderForNewTables
					).onChange(async (value) => {
						this.plugin.settings.customFolderForNewTables = value;
						await this.plugin.saveSettings();
					});
				});
		}

		const activeFileNameTimestampDesc = new DocumentFragment();
		activeFileNameTimestampDesc.createSpan({}, (span) => {
			span.innerHTML = `If a markdown file is open, the active file name and current timestamp will be used as the table name.<br>e.g. if <strong>Test.md</strong> is open, the table will be named <strong>Test-2023-04-14T13.12.59-06.00.table</strong><br><br>Otherwise, the default table file name will be used.<br>e.g <strong>Untitled.table</strong>`;
		});

		new Setting(containerEl)
			.setName(
				"Create table name based on active file name and timestamp"
			)
			.setDesc(activeFileNameTimestampDesc)
			.addToggle((cb) => {
				cb.setValue(
					this.plugin.settings.nameWithActiveFileNameAndTimestamp
				).onChange(async (value) => {
					this.plugin.settings.nameWithActiveFileNameAndTimestamp =
						value;
					await this.plugin.saveSettings();
				});
			});
	}
}
