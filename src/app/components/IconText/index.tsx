import React from "react";

import { findIcon } from "../../services/utils";
import "./styles.css";

interface Props {
	iconText: string;
	icon: string;
}

export default function IconText({ iconText, icon }: Props) {
	return (
		<div className="NLT__icon-text NLT__selectable">
			{icon !== "" && findIcon(icon, "NLT__icon--md NLT__margin-right")}
			<p>{iconText}</p>
		</div>
	);
}
