import React from "react";

import parse from "html-react-parser";
import {
	parseFileLinks,
	parseURLs,
	parseBoldMarkdown,
	parseItalicMarkdown,
	parseHighlightMarkdown,
} from "src/app/services/string/parsers";
interface Props {
	text: string;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
}

export default function TextCell({
	text,
	shouldWrapOverflow,
	useAutoWidth,
}: Props) {
	text = parseURLs(text);
	text = parseFileLinks(text);
	text = parseBoldMarkdown(text);
	text = parseItalicMarkdown(text);
	text = parseHighlightMarkdown(text);

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
	return <div className={className}>{parse(text)}</div>;
}
