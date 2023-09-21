import "./styles.css";

export const renderBuyMeACoffeeBadge = (
	contentEl: HTMLElement | DocumentFragment
) => {
	const linkEl = contentEl.createEl("a", {
		href: "https://www.buymeacoffee.com/treywallis",
	});
	const imgEl = linkEl.createEl("img");
	imgEl.src =
		"https://img.buymeacoffee.com/button-api/?text=Buy me a herbal tea&emoji=🍵&slug=treywallis&button_colour=9478F0&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00&refresh_id=1";
	imgEl.referrerPolicy = "no-referrer";
	imgEl.alt = "Buymeacoffee";
	imgEl.width = 180;
};

export const renderGitHubSponsorBadge = (
	contentEl: HTMLElement | DocumentFragment
) => {
	const linkEl = contentEl.createEl("a", {
		href: "https://github.com/sponsors/trey-wallis",
	});
	const imgEl = linkEl.createEl("img");
	imgEl.src =
		"https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86";
	imgEl.referrerPolicy = "no-referrer";
	imgEl.alt = "GitHub Sponsor";
	imgEl.width = 110;
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
