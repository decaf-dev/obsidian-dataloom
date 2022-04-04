import React from "react";

import { ErrorData } from "src/app/services/state";

interface Props {
	data: ErrorData;
}

export default function ErrorDisplay({ data }: Props) {
	return (
		<ul>
			{data.columnIds.map((column, i) => (
				<li key={i} className="NLT__error">
					Invalid type definition in column {column}
				</li>
			))}
		</ul>
	);
}
