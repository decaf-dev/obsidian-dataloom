import React from "react";

import { findIcon } from "../../services/utils";
import "./styles.css";

interface Props {
	iconText: string;
	icon: string;
	onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function IconText({ iconText, icon, onClick }: Props) {
	return (
		<div className="NLT__icon-text NLT__selectable" onClick={onClick}>
			{icon !== "" && findIcon(icon, "NLT__icon--md NLT__margin-right")}
			<p>{iconText}</p>
		</div>
	);
}
