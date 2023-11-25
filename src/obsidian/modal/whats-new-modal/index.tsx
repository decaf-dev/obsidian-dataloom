import { App, Component, MarkdownRenderer, Modal } from "obsidian";

import { getLastestGithubRelease } from "src/data/network";
import {
	renderBuyMeACoffeeBadge,
	renderDivider,
	setModalTitle,
} from "src/obsidian/shared";

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
			text: "Thank you for using DataLoom! If you like the plugin, please consider supporting development. With your sponsorship, I'll be able to continue to add features, fix bugs, and respond to issues on GitHub.",
		});
		const badgeContainer = containerEl.createDiv({
			cls: "dataloom-whats-new-modal__badge-container",
		});
		renderBuyMeACoffeeBadge(badgeContainer, 200);

		containerEl.createDiv({
			text: "DataLoom is now on Discord. Please join to get help, report bugs, and participate in the community.",
		});
		containerEl.createDiv({
			cls: "dataloom-whats-new-modal__spacer",
		});
		containerEl.createEl("a", {
			text: "Join Discord",
			href: "https://discord.gg/QaFbepMdN4",
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
		const { contentEl } = this;
		contentEl.empty();
	}
}
