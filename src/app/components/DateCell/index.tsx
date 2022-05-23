import React from "react";

import "./styles.css";
interface Props {
	date: string;
}

export default function DateCell({ date }: Props) {
	return <div className="NLT__date">{date}</div>;
}
