import { PluginSettingTab, App } from "obsidian";
import DashboardsPlugin from "../main";
import { Setting } from "obsidian";

export default class DashboardsSettingsTab extends PluginSettingTab {
	plugin: DashboardsPlugin;

	constructor(app: App, plugin: DashboardsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	private renderFileSettings(containerEl: HTMLElement) {
		new Setting(containerEl).setName("File").setHeading();

		//Attachments folder
		const attachmentsFolderDesc = new DocumentFragment();
		attachmentsFolderDesc.createSpan({}, (span) => {
			span.innerHTML = `Create tables in the attachments folder defined in the Obsidian settings.<br><br>This can be changed in <span style="color: var(--text-accent);">Files & Links -> Default location for new attachments</span><br><br>Otherwise, the folder location below will be used.`;
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

		//Folder location
		const defaultLocationDesc = new DocumentFragment();
		defaultLocationDesc.createSpan({}, (span) => {
			span.innerHTML = `Where newly created tables are placed. Please don't include a slash at the beginning or end of the value.<br>e.g. <strong>myfolder/subdirectory</strong><br><br>Default location is the vault root folder, if not specified.`;
		});

		if (this.plugin.settings.createAtObsidianAttachmentFolder === false) {
			new Setting(containerEl)
				.setName("Default location for new tables")
				.setDesc(defaultLocationDesc)
				.addText((cb) => {
					cb.setValue(
						this.plugin.settings.customFolderForNewFiles
					).onChange(async (value) => {
						this.plugin.settings.customFolderForNewFiles = value;
						await this.plugin.saveSettings();
					});
				});
		}
	}

	private renderExportSettings(containerEl: HTMLElement) {
		const exportRenderMarkdownDesc = new DocumentFragment();
		exportRenderMarkdownDesc.createSpan({}, (span) => {
			span.innerHTML =
				"If enabled, content will be exported as markdown. For example, if enabled, a checkbox cell's content will be exported as <strong>[ ]</strong> or <strong>[x]</strong>. If disabled, the content will be exported as <strong>true</strong> or <strong>false</strong>.";
		});

		new Setting(containerEl).setName("Export").setHeading();
		new Setting(containerEl)
			.setName("Export content as markdown")
			.setDesc(exportRenderMarkdownDesc)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.exportRenderMarkdown).onChange(
					async (value) => {
						this.plugin.settings.exportRenderMarkdown = value;
						await this.plugin.saveSettings();
					}
				);
			});
	}

	private renderEmbeddedTableSettings(containerEl: HTMLElement) {
		new Setting(containerEl).setName("Embedded Tables").setHeading();

		const defaultEmbedWidthDesc = new DocumentFragment();
		defaultEmbedWidthDesc.createSpan({}, (span) => {
			span.innerHTML =
				"The default embedded table width. Accepts valid HTML width values. Like <strong>100px<strong>, <strong>50%</strong>, etc.";
		});

		new Setting(containerEl)
			.setName("Default embedded table width")
			.setDesc(defaultEmbedWidthDesc)
			.addText((cb) => {
				cb.setValue(this.plugin.settings.defaultEmbedWidth).onChange(
					async (value) => {
						this.plugin.settings.defaultEmbedWidth = value;
						await this.plugin.saveSettings();
					}
				);
			});

		const defaultEmbedHeightDesc = new DocumentFragment();
		defaultEmbedHeightDesc.createSpan({}, (span) => {
			span.innerHTML =
				"The default embedded table height. Accepts valid HTML width values. Like <strong>100px</strong>, <strong>50%</strong>, etc.";
		});

		new Setting(containerEl)
			.setName("Default embedded table height")
			.setDesc(defaultEmbedHeightDesc)
			.addText((cb) => {
				cb.setValue(this.plugin.settings.defaultEmbedHeight).onChange(
					async (value) => {
						this.plugin.settings.defaultEmbedHeight = value;
						await this.plugin.saveSettings();
					}
				);
			});

		containerEl.createSpan(
			{},
			(span) =>
				(span.innerHTML = `<strong style="color: var(--text-accent); font-size: 12px;">Please close and reopen your embedded tables for these settings to take effect</strong>`)
		);
	}

	private renderDebugSettings(containerEl: HTMLElement) {
		new Setting(containerEl).setName("Debug").setHeading();
		new Setting(containerEl)
			.setName("Debug mode")
			.setDesc(
				"Turns on console.log for plugin events. This is useful for troubleshooting."
			)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.shouldDebug).onChange(
					async (value) => {
						this.plugin.settings.shouldDebug = value;
						await this.plugin.saveSettings();
					}
				);
			});
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		this.renderFileSettings(containerEl);
		this.renderExportSettings(containerEl);
		this.renderEmbeddedTableSettings(containerEl);
		this.renderDebugSettings(containerEl);
	}
}
