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
}

export default function TextCell({ text }: Props) {
	text = parseURLs(text);
	text = parseFileLinks(text);
	text = parseBoldMarkdown(text);
	text = parseItalicMarkdown(text);
	text = parseHighlightMarkdown(text);

	return <p className="NLT__p">{parse(text)}</p>;
}
