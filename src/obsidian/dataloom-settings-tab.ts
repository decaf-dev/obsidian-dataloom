import { PluginSettingTab, App } from "obsidian";
import { Setting } from "obsidian";
import DataLoomPlugin from "../main";
import { renderBuyMeACoffeeBadge } from "./shared";
import Logger from "js-logger";
import { LOG_LEVEL_DEBUG, LOG_LEVEL_ERROR, LOG_LEVEL_INFO, LOG_LEVEL_OFF, LOG_LEVEL_TRACE, LOG_LEVEL_WARN, stringToLogLevel } from "src/shared/logger";

export default class DataLoomSettingsTab extends PluginSettingTab {
	plugin: DataLoomPlugin;

	constructor(app: App, plugin: DataLoomPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		this.renderSupportHeader(containerEl);
		this.renderFileSettings(containerEl);
		this.renderTableSettings(containerEl);
		this.renderExportSettings(containerEl);
		this.renderEmbeddedLoomSettings(containerEl);
		this.renderModalSettings(containerEl);
		this.renderDebugSettings(containerEl);
	}

	private renderSupportHeader(containerEl: HTMLElement) {
		new Setting(containerEl).setName("DataLoom").setHeading();

		const supportDesc = new DocumentFragment();
		supportDesc.createDiv({
			text: "Enjoying the plugin? Please buy me an herbal tea to support the development of DataLoom.",
		});

		new Setting(containerEl).setDesc(supportDesc);

		renderBuyMeACoffeeBadge(containerEl);
		const spacing = containerEl.createDiv();
		spacing.style.marginBottom = "0.75em";
	}

	private renderFileSettings(containerEl: HTMLElement) {
		new Setting(containerEl).setName("File").setHeading();

		//Attachments folder
		const attachmentsFolderDesc = new DocumentFragment();
		attachmentsFolderDesc.createDiv({
			text: "Create looms in the attachments folder defined in the Obsidian settings.",
		});
		attachmentsFolderDesc.createSpan({
			text: "This can be changed in",
		});

		attachmentsFolderDesc.createSpan({
			text: " Files & Links -> Default location for new attachments",
			cls: "dataloom-modal-text--emphasize",
		});
		attachmentsFolderDesc.createEl("br");
		attachmentsFolderDesc.createDiv({
			text: "Otherwise, the folder location below will be used",
		});

		new Setting(containerEl)
			.setName("Create looms in the attachments folder")
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
		defaultLocationDesc.createSpan({
			text: "Where newly created looms are placed. Default location is the vault root folder, if not specified.",
		});

		if (this.plugin.settings.createAtObsidianAttachmentFolder === false) {
			new Setting(containerEl)
				.setName("Default location for new looms")
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

	private renderTableSettings(containerEl: HTMLElement) {
		const freezeColumnsDesc = new DocumentFragment();
		freezeColumnsDesc.createSpan({
			text: "The number of columns to stay in place when the table scrolls horizontally.",
		});

		new Setting(containerEl).setName("Table").setHeading();
		new Setting(containerEl)
			.setName("Frozen columns")
			.setDesc(freezeColumnsDesc)
			.addDropdown((cb) => {
				cb.addOptions({
					"0": "0",
					"1": "1",
					"2": "2",
					"3": "3",
				})
					.setValue(
						this.plugin.settings.defaultFrozenColumnCount.toString()
					)
					.onChange(async (value) => {
						this.plugin.settings.defaultFrozenColumnCount =
							parseInt(value);
						await this.plugin.saveSettings();
					});
			});
	}

	private renderExportSettings(containerEl: HTMLElement) {
		const removeMarkdownOnExportDesc = new DocumentFragment();
		removeMarkdownOnExportDesc.createSpan({
			text: "If enabled, content will be exported as plain text instead of markdown. For example, if enabled, a checkbox cell's content will be exported true or false instead of [ ] or [x].",
		});

		new Setting(containerEl).setName("Export").setHeading();
		new Setting(containerEl)
			.setName("Remove markdown")
			.setDesc(removeMarkdownOnExportDesc)
			.addToggle((cb) => {
				cb.setValue(
					this.plugin.settings.removeMarkdownOnExport
				).onChange(async (value) => {
					this.plugin.settings.removeMarkdownOnExport = value;
					await this.plugin.saveSettings();
				});
			});
	}

	private renderEmbeddedLoomSettings(containerEl: HTMLElement) {
		new Setting(containerEl).setName("Embedded looms").setHeading();

		const defaultEmbedWidthDesc = new DocumentFragment();
		defaultEmbedWidthDesc.createSpan({
			text: "The default embedded loom width. Accepts valid HTML width values. Like 100px, 50%, etc.",
		});
		defaultEmbedWidthDesc.createDiv({
			text: "Please close and reopen your embedded looms for this setting to take effect",
			cls: "dataloom-modal-text--emphasize",
		});

		new Setting(containerEl)
			.setName("Default embedded loom width")
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
		defaultEmbedHeightDesc.createSpan({
			text: "The default embedded loom height. Accepts valid HTML width values. Like 100px, 50%, etc.",
		});
		defaultEmbedHeightDesc.createDiv({
			text: "Please close and reopen your embedded looms for this setting to take effect",
			cls: "dataloom-modal-text--emphasize",
		});

		new Setting(containerEl)
			.setName("Default embedded loom height")
			.setDesc(defaultEmbedHeightDesc)
			.addText((cb) => {
				cb.setValue(this.plugin.settings.defaultEmbedHeight).onChange(
					async (value) => {
						this.plugin.settings.defaultEmbedHeight = value;
						await this.plugin.saveSettings();
					}
				);
			});
	}

	private renderModalSettings(containerEl: HTMLElement) {
		new Setting(containerEl).setName("Modal").setHeading();
		new Setting(containerEl)
			.setName("Release notes")
			.setDesc(
				"Display release notes the first time a loom file is opened after the plugin is updated."
			)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.showWhatsNewModal).onChange(
					async (value) => {
						this.plugin.settings.showWhatsNewModal = value;
						await this.plugin.saveSettings();
					}
				);
			});
	}

	private renderDebugSettings(containerEl: HTMLElement) {
		new Setting(containerEl).setName("Debugging").setHeading();
		new Setting(containerEl)
			.setName("Log level")
			.setDesc(
				"Sets the log level. Please use trace to see all log messages."
			)
			.addDropdown((cb) => {
				cb.addOptions({
					"Off": LOG_LEVEL_OFF,
					"Error": LOG_LEVEL_ERROR,
					"Warn": LOG_LEVEL_WARN,
					"Info": LOG_LEVEL_INFO,
					"Debug": LOG_LEVEL_DEBUG,
					"Trace": LOG_LEVEL_TRACE
				})
				cb.setValue(this.plugin.settings.logLevel).onChange(
					async (value) => {
						this.plugin.settings.logLevel = value;
						await this.plugin.saveSettings();
						Logger.setLevel(stringToLogLevel(value));
					}
				);
			});
	}
}
