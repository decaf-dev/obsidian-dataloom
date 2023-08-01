export const renderDonationBadge = (
	parentEl: HTMLElement | DocumentFragment
) => {
	const linkEl = parentEl.createEl("a", {
		href: "https://www.buymeacoffee.com/treywallis",
	});
	const imgEl = linkEl.createEl("img");
	imgEl.src =
		"https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=treywallis&button_colour=6a8695&font_colour=ffffff&font_family=Poppins&outline_colour=000000&coffee_colour=FFDD00";
	imgEl.referrerPolicy = "no-referrer";
	imgEl.alt = "Buymeacoffee";
	imgEl.width = 180;
};
