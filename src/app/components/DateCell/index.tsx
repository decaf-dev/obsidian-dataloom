import React from "react";

import "./styles.css";
interface Props {
	text: string;
}

export default function DateCell({ text }: Props) {
	return <div className="NLT__date-cell">{text}</div>;
}
