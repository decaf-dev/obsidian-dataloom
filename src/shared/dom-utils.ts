export const findAncestorsUntilClassName = (
	currentEl: HTMLElement,
	className: string
) => {
	const ancestors: HTMLElement[] = [];
	let el: HTMLElement | null = currentEl;

	while (el && !el.classList.contains(className)) {
		ancestors.push(el);
		el = el.parentElement;
	}
	return ancestors;
};

export const findAncestorWithClassName = (
	currentEl: HTMLElement,
	className: string
) => {
	let el: HTMLElement | null = currentEl;

	while (el && !el.classList.contains(className)) {
		if (el.classList.contains(className)) {
			return el;
		}
		el = el.parentElement;
	}
	return null;
};
