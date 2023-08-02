import { App, Modal, setIcon } from "obsidian";
import { renderDivider } from "src/obsidian/shared";

import "./styles.css";

export default class WelcomeModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h2", { text: "Welcome to DataLoom" });
		contentEl.createDiv({
			text: "Weave together data from diverse sources into a cohesive table view.",
		});
		renderDivider(contentEl);
		contentEl.createEl("h5", {
			text: "Learn how to use",
			cls: "dataloom-welcome-modal__title",
		});

		const cardContainerEl = contentEl.createDiv({
			cls: "dataloom-welcome-modal__card-container",
		});

		this.renderCard(
			cardContainerEl,
			"Quick start",
			"Learn the basics of creating a loom",
			"https://dataloom.xyz/getting-started/quick-start",
			"table"
		);

		this.renderCard(
			cardContainerEl,
			"Embedded looms",
			"Learn how to embed a loom into a markdown note",
			"https://dataloom.xyz/other/embedding-looms",
			"sticky-note"
		);

		this.renderCard(
			cardContainerEl,
			"Keyboard focus system",
			"Learn how to navigate looms with your keyboard",
			"https://dataloom.xyz/other/keyboard-focus-system",
			"list-plus"
		);
	}

	private renderCard(
		contentEl: HTMLElement,
		title: string,
		description: string,
		link: string,
		iconId: string
	) {
		//Card
		const cardEl = contentEl.createDiv({
			cls: "dataloom-welcome-modal__card",
		});
		const iconEl = cardEl.createDiv();
		setIcon(iconEl, iconId);
		(iconEl.firstChild as HTMLElement).classList.add(
			"dataloom-welcome-modal__card-icon"
		);

		//Card container
		const cardContainerEl = cardEl.createDiv();

		cardContainerEl.createEl("h6", {
			text: title,
			cls: "dataloom-welcome-modal__card-title",
		});

		cardContainerEl.createEl("p", {
			text: description,
			cls: "dataloom-welcome-modal__card-description",
		});

		cardContainerEl.createEl("a", { text: "Get started", href: link });
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
