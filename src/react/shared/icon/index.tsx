import React from "react";

import { setIcon } from "obsidian";
import { appendOrReplaceFirstChild } from "src/shared/renderUtils";

interface Props {
	lucideId: string;
	size?: "sm" | "md" | "lg";
	fill?: string;
}

export default function Icon({ lucideId, size = "md" }: Props) {
	let className = "";
	if (size === "sm") {
		className = "NLT__icon--sm";
	} else if (size === "md") {
		className = "NLT__icon--md";
	} else if (size === "lg") {
		className = "NLT__icon--lg";
	}

	const ref = React.useRef<HTMLDivElement | null>(null);

	// .NLT__icon--sm {
	//     width: 0.9rem !important;
	//     height: 0.9rem !important;
	// }

	// .NLT__icon--md {
	//     width: 1rem !important;
	//     height: 1rem !important;
	// }

	// .NLT__icon--lg {
	//     width: 1.1rem !important;
	//     height: 1.1rem !important;
	// }

	return (
		<div
			ref={(node) => {
				//Set the reference
				ref.current = node;

				//Create an empty div
				const div = document.body.createDiv();
				div.style.display = "flex";
				div.detach();

				//Set the lucid icon on the div
				setIcon(div, lucideId); //The id should match lucide.dev

				//Update the reference content
				appendOrReplaceFirstChild(node, div);
			}}
		/>
	);
}
