import { type SpacingSize } from "./types";

export const getSpacing = (size: SpacingSize) => {
	let spacing = "";
	if (size === "sm") {
		spacing = "var(--dataloom-spacing--sm)";
	} else if (size === "md") {
		spacing = "var(--dataloom-spacing--md)";
	} else if (size === "lg") {
		spacing = "var(--dataloom-spacing--lg)";
	} else if (size === "xl") {
		spacing = "var(--dataloom-spacing--xl)";
	} else if (size === "2xl") {
		spacing = "var(--dataloom-spacing--2xl)";
	} else if (size === "3xl") {
		spacing = "var(--dataloom-spacing--3xl)";
	} else if (size === "4xl") {
		spacing = "var(--dataloom-spacing--4xl)";
	}
	return spacing;
};
