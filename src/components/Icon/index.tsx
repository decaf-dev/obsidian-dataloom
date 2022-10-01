import { IconType } from "src/services/icon/types";
import { findIcon } from "./services/utils";

import "./styles.css";

interface Props {
	icon: IconType;
	variant?: "sm" | "md" | "lg";
	className?: string;
}

export default function Icon({ icon, variant = "md", className }: Props) {
	let name = className;
	if (variant === "sm") {
		name += " NLT__icon--sm";
	} else if (variant === "md") {
		name += " NLT__icon--md";
	} else if (variant === "lg") {
		name += " NLT__icon--lg";
	}

	return <>{findIcon(icon, name)} </>;
}
