import React from "react";

interface Props {
	number: string;
}

export default function DateCell({ number }: Props) {
	return <p className="NLT__p">{number}</p>;
}
