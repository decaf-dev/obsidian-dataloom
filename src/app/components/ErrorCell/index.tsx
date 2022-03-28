import React from "react";

interface Props {
	content: string;
}

export default function ErrorCell({ content }: Props) {
	return <div className="NLT__error">{content}</div>;
}
