import "./styles.css";

export const renderDonationBadge = (
	contentEl: HTMLElement | DocumentFragment
) => {
	const linkEl = contentEl.createEl("a", {
		href: "https://www.buymeacoffee.com/treywallis",
	});
	const imgEl = linkEl.createEl("img");
	imgEl.src =
		"https://img.buymeacoffee.com/button-api/?text=Buy me a herbal tea&emoji=🍵&slug=treywallis&button_colour=FF5F5F&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00";
	imgEl.referrerPolicy = "no-referrer";
	imgEl.alt = "Buymeacoffee";
	imgEl.width = 180;
};

export const renderDivider = (contentEl: HTMLElement | DocumentFragment) => {
	contentEl.createDiv({ cls: "dataloom-modal__divider" });
};
