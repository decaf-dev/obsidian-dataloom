export const getPositionFromEl = (el: HTMLElement) => {
	const { top, left, width, height } = el.getBoundingClientRect();
	return { top, left, width, height };
};

export const findMenuTriggerEl = (menuId: string) => {
	return document.querySelector(
		`[data-menu-id="${menuId}"]`
	) as HTMLElement | null;
};
