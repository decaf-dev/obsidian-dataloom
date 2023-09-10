import { PluginSettingTab, App } from "obsidian";
import { Setting } from "obsidian";
import DataLoomPlugin from "../main";
import { renderDonationBadge } from "./shared";

export default class DataLoomSettingsTab extends PluginSettingTab {
	plugin: DataLoomPlugin;

	constructor(app: App, plugin: DataLoomPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		this.renderDonationHeader(containerEl);
		this.renderFileSettings(containerEl);
		this.renderTableSettings(containerEl);
		this.renderExportSettings(containerEl);
		this.renderEmbeddedLoomSettings(containerEl);
		this.renderModalSettings(containerEl);
		this.renderDebugSettings(containerEl);
	}

	private renderDonationHeader(containerEl: HTMLElement) {
		new Setting(containerEl).setName("DataLoom").setHeading();

		const donationDesc = new DocumentFragment();
		const textEl = donationDesc.createDiv({
			text: "I need your support - this project is dependent on donations from people like you",
		});
		textEl.style.marginBottom = "1.5em";
		renderDonationBadge(donationDesc);

		new Setting(containerEl).setDesc(donationDesc);
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
			.setName("Create new looms in the attachments folder")
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
			text: "If enabled, content will be exported as raw text instead of markdown. For example, if enabled, a checkbox cell's content will be exported true or false instead of [ ] or [x].",
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
			.setName("What's new modal")
			.setDesc("Show the what's new modal when the plugin is updated.")
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.showWhatsNewModal).onChange(
					async (value) => {
						this.plugin.settings.showWhatsNewModal = value;
						await this.plugin.saveSettings();
					}
				);
			});

		new Setting(containerEl)
			.setName("Donation modal")
			.setDesc("Show the donation modal when the plugin is updated.")
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.showDonationModal).onChange(
					async (value) => {
						this.plugin.settings.showDonationModal = value;
						await this.plugin.saveSettings();
					}
				);
			});
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
}
