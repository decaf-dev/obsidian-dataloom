import React from "react";

import parse from "html-react-parser";
import { parseFileLinks, parseURLs } from "src/app/services/string/parsers";
interface Props {
	text: string;
}

export default function TextCell({ text }: Props) {
	text = parseURLs(text);
	text = parseFileLinks(text);

	return <p className="NLT__p">{parse(text)}</p>;
}
