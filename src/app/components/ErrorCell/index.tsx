import React from "react";

import "./styles.css";

interface Props {
	content: string;
}

export default function ErrorCell({ content }: Props) {
	return <div className="NLT__error-cell">{content}</div>;
}
