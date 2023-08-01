import { App, Modal } from "obsidian";
import { renderDonationBadge } from "./html-utils";

export default class DonationModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h2", { text: "Support DataLoom" });
		this.renderTextEl(contentEl);
		renderDonationBadge(contentEl);
	}

	private renderTextEl(contentEl: HTMLElement) {
		const containerEl = contentEl.createEl("div");
		containerEl.style.marginBottom = "1.5em";
		containerEl.createEl("p", {
			text: "I need your help. I develop this plugin as a free service, however I cannot dedicate adequate time to it without some support.",
		});
		containerEl.createEl("p", {
			text: "If this plugin has helped you, please consider donating.",
		});
		containerEl.createEl("p", {
			text: "- Trey.",
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
