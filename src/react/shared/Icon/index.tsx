import React from "react";
import { findIcon } from "./utils";

import "./styles.css";
import { IconType } from "src/shared/types";

interface Props {
	type: IconType;
	size?: "sm" | "md" | "lg";
	onClick?: (e: React.MouseEvent) => void;
}

export default function Icon({ type, size = "md", onClick }: Props) {
	let className = "";
	if (size === "sm") {
		className = "NLT__icon--sm";
	} else if (size === "md") {
		className = "NLT__icon--md";
	} else if (size === "lg") {
		className = "NLT__icon--lg";
	}

	return (
		<div className="NLT__icon" onClick={onClick && onClick}>
			{findIcon(type, className)}
		</div>
	);
}
