import { TABLE_EXTENSION } from "src/data/constants";

export const getEmbeddedTableLinkEls = (el: HTMLElement) => {
	const embeddedLinkEls = el.querySelectorAll(".internal-embed");
	const tableLinkEls: HTMLElement[] = [];

	for (let i = 0; i < embeddedLinkEls.length; i++) {
		const linkEl = embeddedLinkEls[i];
		const src = linkEl.getAttribute("src");
		if (src?.endsWith(TABLE_EXTENSION))
			tableLinkEls.push(linkEl as HTMLElement);
	}
	return tableLinkEls;
};
