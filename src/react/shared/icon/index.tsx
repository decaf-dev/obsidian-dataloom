import React from "react";

import { setIcon } from "src/obsidian-shim/build/set-icon";
import { appendOrReplaceFirstChild } from "src/shared/render/utils";

interface Props {
	lucideId: string;
	size?: "sm" | "md" | "lg";
	color?: string;
}

export default function Icon({
	lucideId,
	size = "md",
	color = "unset",
}: Props) {
	const ref = React.useRef<HTMLDivElement | null>(null);

	return (
		<div
			ref={(node) => {
				//Set the reference
				ref.current = node;

				//Create an empty div
				const div = document.createElement("div");
				div.style.display = "flex";
				div.style.color = color;
				div.style.pointerEvents = "none";

				if (size === "sm") {
					div.style.width = "0.9rem";
					div.style.height = "0.9rem";
				} else if (size === "md") {
					div.style.width = "1rem";
					div.style.height = "1rem";
				} else if (size === "lg") {
					div.style.width = "1.1rem";
					div.style.height = "1.1rem";
				}

				//Set the lucid icon on the div
				setIcon(div, lucideId); //The id should match lucide.dev

				//Update the reference content
				appendOrReplaceFirstChild(node, div);
			}}
		/>
	);
}
