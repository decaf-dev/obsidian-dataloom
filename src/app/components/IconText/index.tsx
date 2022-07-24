import React from "react";

import { findIcon } from "src/app/services/icon/utils";
import { Icon } from "src/app/services/icon/types";
import "./styles.css";

interface Props {
	iconText: string;
	icon: Icon;
}

export default function IconText({ iconText, icon }: Props) {
	return (
		<div className="NLT__icon-text NLT__selectable">
			{findIcon(icon, "NLT__icon--md NLT__margin-right")}
			<p>{iconText}</p>
		</div>
	);
}
