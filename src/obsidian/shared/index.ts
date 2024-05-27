import "./styles.css";

export const renderBuyMeACoffeeBadge = (
	contentEl: HTMLElement | DocumentFragment,
	width = 175
) => {
	const linkEl = contentEl.createEl("a", {
		href: "https://www.buymeacoffee.com/decaf_dev",
	});
	const imgEl = linkEl.createEl("img");
	imgEl.src =
		"https://github.com/decaf-dev/obsidian-dataloom/assets/40307803/dee919ac-1065-4595-8511-7e7e7a962356";
	imgEl.alt = "Buy me a coffee";
	imgEl.width = width;
};

export const renderDivider = (contentEl: HTMLElement | DocumentFragment) => {
	const isFirstChild = contentEl.children.length === 0;
	const dividerEl = contentEl.createEl("hr", {
		cls: "dataloom-modal__divider",
	});
	if (isFirstChild) {
		dividerEl.addClass("dataloom-modal__divider--first-child");
	}
};

export const setModalTitle = (containerEl: HTMLElement, text: string) => {
	const modalTitleEl = containerEl.querySelector(".modal-title");
	modalTitleEl?.createEl("h3", { text });
	modalTitleEl?.addClass("dataloom-modal__title");
};
