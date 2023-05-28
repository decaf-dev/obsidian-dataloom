import { DynamicSize } from "./spacing/types";

export const appendOrReplaceFirstChild = (
	container: HTMLDivElement | null,
	child: HTMLDivElement | null
) => {
	if (container == null || child === null) return;

	//If there is no first child, append the child
	if (container && !container.firstChild) {
		container.appendChild(child);
		//If there is already a child and it is not the same as the child, replace the child
	} else if (container.firstChild && container.firstChild !== child) {
		container.replaceChild(child, container.firstChild);
	}
};

export const getDynamicSize = <T>(
	defaultValue: string,
	value?: T | DynamicSize<T>
) => {
	if (value == undefined) return defaultValue;
	if (typeof value === "string") return value;

	const { base, mobile } = value as DynamicSize<T>;

	if (window.innerWidth <= 480) {
		return mobile ?? base;
	} else {
		return base;
	}
};
