import React from "react";

interface Props {
	number: string;
}

export default function NumberCell({ number }: Props) {
	return <div className="NLT__number-cell">{number}</div>;
}
