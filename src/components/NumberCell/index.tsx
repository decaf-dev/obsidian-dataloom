import React from "react";

import "./styles.css";

interface Props {
	number: string;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
}

export default function NumberCell({
	number,
	shouldWrapOverflow,
	useAutoWidth,
}: Props) {
	let className = "NLT__number-cell";
	if (useAutoWidth) {
		className += " NLT__auto-width";
	} else {
		if (shouldWrapOverflow) {
			className += " NLT__wrap-overflow";
		} else {
			className += " NLT__hide-overflow";
		}
	}
	return <div className={className}>{number}</div>;
}
