import MarkdownIt from "markdown-it";

import NltPlugin from "../../main";

import {
	EXTERNAL_LINK_REGEX,
	LEFT_SQUARE_BRACKET_REGEX,
	INTERNAL_LINK_REGEX,
	RIGHT_SQUARE_BRACKET_REGEX,
	INTERNAL_LINK_ALIAS_REGEX,
} from "../string/regex";

const md = new MarkdownIt();

const replaceObsidianLinks = (markdown: string): string => {
	const matches = Array.from(markdown.matchAll(INTERNAL_LINK_REGEX));
	matches.forEach((match) => {
		const link = match[0];
		let fileName = link
			.replace(LEFT_SQUARE_BRACKET_REGEX, "")
			.replace(RIGHT_SQUARE_BRACKET_REGEX, "");
		const alias = fileName.match(INTERNAL_LINK_ALIAS_REGEX);
		if (alias) fileName = fileName.replace(INTERNAL_LINK_ALIAS_REGEX, "");

		const file = NltPlugin.getFiles().find(
			(file) => file.basename === fileName
		);

		const el = document.body.createEl("a");
		el.addClass("internal-link");
		if (!file) el.addClass("is-unresolved");
		el.setAttr("data-href", fileName);
		el.setAttr("href", fileName);
		el.setAttr("target", "_blank");
		el.setAttr("rel", "noopener");
		if (alias) {
			el.setText(alias[0].substring(1));
			el.setAttr("aria-label-position", "top");
			el.setAttr("aria-label", fileName);
		} else {
			el.setText(fileName);
		}
		el.remove();

		markdown = markdown.replace(link, el.outerHTML);
	});
	return markdown;
};

const replaceExternalLinks = (markdown: string): string => {
	const matches = Array.from(markdown.matchAll(EXTERNAL_LINK_REGEX));
	matches.forEach((match) => {
		const link = match[0];
		markdown = markdown.replace(
			link,
			`<a rel="noopener" class="external-link" href="${link}" target="_blank">${link}</a>`
		);
	});
	return markdown;
};

export const markdownToHtml = (markdown: string) => {
	markdown = md.renderInline(markdown, {});
	markdown = replaceObsidianLinks(markdown);
	markdown = replaceExternalLinks(markdown);
	return markdown;
};
