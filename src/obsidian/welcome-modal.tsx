import { App, Modal, setIcon } from "obsidian";

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
		this.renderDivider(contentEl);
		const titleEl = contentEl.createEl("h5", { text: "Learn how to use" });
		titleEl.style.marginTop = "0em";
		titleEl.style.marginBottom = "1em";

		const cardContainerEl = contentEl.createDiv();
		cardContainerEl.style.display = "flex";
		cardContainerEl.style.flexDirection = "column";
		cardContainerEl.style.rowGap = "1rem";

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

	private renderDivider(contentEl: HTMLElement) {
		const dividerEl = contentEl.createDiv();
		dividerEl.style.margin = "1.5em 0";
		dividerEl.style.borderTop =
			"1px solid var(--background-modifier-border)";
	}

	private renderCard(
		contentEl: HTMLElement,
		title: string,
		description: string,
		link: string,
		iconId: string
	) {
		//Card
		const cardEl = contentEl.createDiv();
		cardEl.style.display = "flex";
		cardEl.style.padding = "1em 1.5em";
		cardEl.style.columnGap = "1.5em";
		cardEl.style.alignItems = "center";
		cardEl.style.border = "1px solid var(--background-modifier-border)";

		const iconEl = cardEl.createDiv();
		setIcon(iconEl, iconId);
		(iconEl.firstChild as HTMLElement).style.width = "1.5em";
		(iconEl.firstChild as HTMLElement).style.height = "1.5em";

		//Card container
		const cardContainerEl = cardEl.createDiv();

		const titleEl = cardContainerEl.createEl("h6", { text: title });
		titleEl.style.margin = "0";

		const descriptionEl = cardContainerEl.createEl("p", {
			text: description,
		});
		descriptionEl.style.marginTop = "0.25em";
		descriptionEl.style.marginBottom = "0.5em";

		cardContainerEl.createEl("a", { text: "Get started", href: link });
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
