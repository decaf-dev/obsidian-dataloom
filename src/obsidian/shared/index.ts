import "./styles.css";

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
