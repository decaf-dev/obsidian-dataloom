import { setIcon } from "obsidian";

import React from "react";

import { appendOrReplaceFirstChild } from "src/shared/render/utils";

import "./styles.css";

interface Props {
	ariaLabel?: string;
	lucideId: string;
	size?: "sm" | "md" | "lg" | "xl";
	color?: string;
}

export default function Icon({
	ariaLabel,
	lucideId,
	size = "sm",
	color,
}: Props) {
	const ref = React.useRef<HTMLDivElement | null>(null);

	let className = "";
	if (size === "sm") {
		className += "dataloom-svg--sm";
	} else if (size === "md") {
		className += "dataloom-svg--md";
	} else if (size === "lg") {
		className += "dataloom-svg--lg";
	} else if (size === "xl") {
		className += "dataloom-svg--xl";
	}

	return (
		<div
			aria-label={ariaLabel}
			ref={(node) => {
				//Set the reference
				ref.current = node;

				//Create an empty div
				const div = document.createElement("div");

				if (color) {
					div.style.color = color;
				}

				setIcon(div, lucideId); //The id should match lucide.dev

				const svg = div.querySelector("svg");
				if (svg) {
					svg.addClass("dataloom-svg");
					svg.addClass(className);
				}

				//Update the reference content
				appendOrReplaceFirstChild(node, div);
			}}
		/>
	);
}
