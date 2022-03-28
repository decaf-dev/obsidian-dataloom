import React from "react";

import { ErrorData } from "src/app/services/dataUtils";

interface Props {
	data: ErrorData;
}

export default function ErrorDisplay({ data }: Props) {
	return (
		<ul>
			{data.columnIds.map((column, i) => (
				<li key={i} className="NLT__error">
					Invalid type in column {column}
				</li>
			))}
		</ul>
	);
}
