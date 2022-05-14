import React from "react";

import parse from "html-react-parser";
import { parseFileLinks, parseURLs } from "src/app/services/string/parsers";
interface Props {
	content: string;
}

export default function TextCell({ content }: Props) {
	content = parseURLs(content);
	content = parseFileLinks(content);

	return <p className="NLT__p">{parse(content)}</p>;
}
