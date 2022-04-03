import React from "react";

interface Props {
	type: string;
}

export default function ErrorCell({ type }: Props) {
	return (
		<div className="NLT__error">Invalid data. Expected type: {type}</div>
	);
}
