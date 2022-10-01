import { IconType } from "src/services/icon/types";
import { findIcon } from "./services/utils";

interface Props {
	icon: IconType;
	variant?: "sm" | "md" | "lg";
	className?: string;
}

export default function Icon({ icon, variant, className }: Props) {
	let name = className;
	if (variant === "sm") {
		name += " NLT__icon--sm";
	} else if (variant === "lg") {
		name += " NLT__icon--lg";
	} else {
		name += " NLT__icon--md";
	}

	return <>{findIcon(icon, name)} </>;
}
