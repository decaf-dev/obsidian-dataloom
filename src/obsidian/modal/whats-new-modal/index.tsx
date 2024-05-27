import { App, Component, MarkdownRenderer, Modal } from "obsidian";

import { getLastestGithubRelease } from "src/data/network";
import { renderDivider, setModalTitle } from "src/obsidian/shared";

import "./styles.css";

export default class WhatsNewModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	async onOpen() {
		const { containerEl } = this;
		const data = await getLastestGithubRelease();
		const { body, tag_name } = data;
		setModalTitle(containerEl, `DataLoom ${tag_name}`);

		const { contentEl } = this;
		this.renderDescription(contentEl);
		renderDivider(contentEl);
		this.renderContent(contentEl, body);
	}

	async renderDescription(containerEl: HTMLElement) {
		containerEl.createDiv({
			text: "Thank you for using DataLoom! Here are the latest updates:",
		});
	}

	async renderContent(contentEl: HTMLElement, body: string) {
		const data = await getLastestGithubRelease();

		if (data) {
			const bodyEl = contentEl.createDiv({
				cls: "dataloom-whats-new-modal__content",
			});
			const replacedText = this.replaceIssueNumbersWithLinks(body);
			MarkdownRenderer.render(
				this.app,
				replacedText,
				bodyEl,
				"",
				new Component()
			);
			bodyEl.querySelectorAll("a").forEach((a) => {
				const issueNumber = this.extractIssueNumberFromURL(a.getText());
				if (issueNumber) {
					a.setText(issueNumber);
				}
			});

			contentEl.createDiv({
				cls: "dataloom-whats-new-modal__spacer",
			});

			contentEl.createEl("a", {
				text: "View all releases",
				href: "https://github.com/decaf-dev/obsidian-dataloom/releases",
			});
		} else {
			contentEl.createDiv({
				text: "Couldn't fetch latest release from GitHub.",
			});
		}
	}

	private replaceIssueNumbersWithLinks(text: string) {
		// Regular expression to match #<number> pattern
		const regex = /#(\d+)/g;
		const replacedText = text.replace(
			regex,
			"https://github.com/decaf-dev/obsidian-dataloom/issues/$1"
		);
		return replacedText;
	}

	private extractIssueNumberFromURL(text: string) {
		// Regular expression to extract the issue number
		const regex = /\/(\d+)$/;

		// Extract the issue number from the URL
		const matches = text.match(regex);

		if (matches && matches.length > 1) {
			// Return the extracted issue number
			return "#" + matches[1];
		}

		// Return null if no issue number is found
		return null;
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
