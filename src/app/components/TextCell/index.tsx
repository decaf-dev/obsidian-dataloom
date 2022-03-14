import React from "react";

interface Props {
	content: string;
}

export default function TextCell({ content }: Props) {
	return <p className="NLT__p">{content}</p>;
}
