import React from "react";

import "./styles.css";

interface Props {
	number: string;
}

export default function NumberCell({ number }: Props) {
	return <div className="NLT__number-cell">{number}</div>;
}
