import { SpacingSize } from "./types";

export const getSpacing = (size: SpacingSize) => {
	let spacing = "";
	if (size === "sm") {
		spacing = "var(--nlt-spacing--sm)";
	} else if (size === "md") {
		spacing = "var(--nlt-spacing--md)";
	} else if (size === "lg") {
		spacing = "var(--nlt-spacing--lg)";
	} else if (size === "xl") {
		spacing = "var(--nlt-spacing--xl)";
	} else if (size === "2xl") {
		spacing = "var(--nlt-spacing--2xl)";
	}
	return spacing;
};
