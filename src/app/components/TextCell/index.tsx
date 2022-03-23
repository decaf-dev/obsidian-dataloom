import React from "react";

import parse from "html-react-parser";
interface Props {
	content: string;
}

export default function TextCell({ content }: Props) {
	return <p className="NLT__p">{parse(content)}</p>;
}
