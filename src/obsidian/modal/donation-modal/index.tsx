import { App, Modal } from "obsidian";
import {
	renderDivider,
	renderDonationBadge,
	setModalTitle,
} from "../../shared";

import "./styles.css";

export default class DonationModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { containerEl } = this;
		setModalTitle(containerEl, "Support DataLoom");

		const { contentEl } = this;
		renderDivider(contentEl);
		this.renderText(contentEl);
		renderDonationBadge(contentEl);
	}

	private renderText(contentEl: HTMLElement) {
		const containerEl = contentEl.createEl("div", {
			cls: "dataloom-donation-modal__container",
		});
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
