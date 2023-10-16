export const getPositionFromEl = (el: HTMLElement) => {
	const { top, left, width, height } = el.getBoundingClientRect();
	return { top, left, width, height };
};
