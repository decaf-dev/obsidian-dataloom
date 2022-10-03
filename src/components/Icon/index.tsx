import React from "react";
import { IconType } from "src/services/icon/types";
import { findIcon } from "./services/utils";

import "./styles.css";

interface Props {
	icon: IconType;
	variant?: "sm" | "md" | "lg";
	onClick?: (e: React.MouseEvent) => void;
}

export default function Icon({ icon, variant = "md", onClick }: Props) {
	let className = "";
	if (variant === "sm") {
		className = "NLT__icon--sm";
	} else if (variant === "md") {
		className = "NLT__icon--md";
	} else if (variant === "lg") {
		className = "NLT__icon--lg";
	}

	return (
		<div className="NLT__icon" onClick={onClick && onClick}>
			{findIcon(icon, className)}
		</div>
	);
}
