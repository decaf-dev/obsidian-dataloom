import React from "react";

interface Props {
	date: string;
}

export default function DateCell({ date }: Props) {
	return <p className="NLT__p">{date}</p>;
}
