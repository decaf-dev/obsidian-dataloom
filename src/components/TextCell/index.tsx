import React from "react";

import parse from "html-react-parser";
import {
	parseFileLinks,
	parseURLs,
	parseBoldMarkdown,
	parseItalicMarkdown,
	parseHighlightMarkdown,
} from "src/services/string/parsers";
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
	content = parseURLs(content);
	content = parseFileLinks(content);
	content = parseBoldMarkdown(content);
	content = parseItalicMarkdown(content);
	content = parseHighlightMarkdown(content);

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
	return <div className={className}>{parse(content)}</div>;
}
