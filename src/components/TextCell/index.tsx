import React from "react";

import parse from "html-react-parser";
interface Props {
	content: string;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
}

export default function TextCell({
	content,
	shouldWrapOverflow,
	useAutoWidth,
}: Props) {
	let className = "NLT__text-cell";
	if (useAutoWidth) {
		className += " NLT__auto-width";
	} else {
		if (shouldWrapOverflow) {
			className += " NLT__wrap-overflow";
		} else {
			className += " NLT__hide-overflow";
		}
	}
	return <div className={className}> {parse(content)}</div>;
}
