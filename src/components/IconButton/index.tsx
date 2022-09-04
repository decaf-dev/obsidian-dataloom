import React from "react";

import { findIcon } from "src/services/icon/utils";
import { Icon } from "src/services/icon/types";

import Button from "../Button";
interface Props {
	icon: Icon;
	onClick: (e: React.MouseEvent) => void;
}

export default function IconButton({ icon, onClick }: Props) {
	return (
		<Button hasIcon={true} onClick={onClick}>
			{findIcon(icon, "NLT__icon--md")}
		</Button>
	);
}
