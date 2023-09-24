import { DynamicSize } from "../spacing/types";

export const replaceNewLinesWithBr = (content: string) => {
	const lines = content.split("\n");
	let updated = "";
	lines.forEach((line) => {
		//If the line is empty, that means we want to render just a new line
		//The MarkdownRenderer.renderMarkdown function does not render a \n character with no other text before it
		//to do that we need to add a <br> tag
		//We still need the \n character however to make sure that lists are rendered properly
		if (line === "") {
			updated += "<br>";
		} else {
			updated += line + "\n";
		}
	});
	return updated;
};

export const appendOrReplaceFirstChild = (
	container: HTMLElement | null,
	child: HTMLElement | null
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
	if (value === undefined) return defaultValue;
	if (typeof value === "string") return value;

	const { base, mobile } = value as DynamicSize<T>;

	if (isSmallScreenSize()) {
		return mobile ?? base;
	} else {
		return base;
	}
};

export const isSmallScreenSize = () => {
	return window.innerWidth <= 480;
};

export const hasDarkTheme = () => {
	const el = document.querySelector("body");
	return el?.className.includes("theme-dark") ?? false;
};
