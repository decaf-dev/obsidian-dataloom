import React from "react";

interface Props {
	expectedType: string;
	type: string;
}

export default function ErrorCell({ expectedType, type }: Props) {
	return (
		<div className="NLT__error">
			Invalid data. Type: {type} Expected type: {expectedType}
		</div>
	);
}
