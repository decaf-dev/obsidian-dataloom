import { App, Component, MarkdownRenderer, Modal } from "obsidian";
import { getLastestGithubRelease } from "src/data/network";

import "./styles.css";
import { renderDivider } from "src/obsidian/html-utils";

export default class WhatsNewModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	async onOpen() {
		let { contentEl } = this;
		contentEl.createEl("h2", { text: "DataLoom - What's New" });
		renderDivider(contentEl);
		this.renderContent(contentEl);
	}

	async renderContent(contentEl: HTMLElement) {
		const data = await getLastestGithubRelease();
		const { body, published_at, tag_name } = data;
		if (data) {
			const tagEl = contentEl.createEl("h5", {
				text: `v${tag_name}`,
				cls: "dataloom-whats-new-modal__tag",
			});

			const date = new Date(published_at);
			tagEl.innerHTML += ` <span style="font-size: 0.75em; color: var(--text-muted);">(${date.toLocaleDateString()})</span>`;

			const bodyEl = contentEl.createDiv();
			const replacedText = this.replaceIssueNumbersWithLinks(body);
			MarkdownRenderer.renderMarkdown(
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

			contentEl.createEl("a", {
				text: "View all releases",
				href: "https://github.com/trey-wallis/obsidian-dataloom/releases",
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
			"https://github.com/trey-wallis/obsidian-dataloom/issues/$1"
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
		let { contentEl } = this;
		contentEl.empty();
	}
}
