import React from "react";

import { ErrorData } from "src/app/services/state";

interface Props {
	data: ErrorData;
}

export default function ErrorDisplay({ data }: Props) {
	return (
		<>
			{data.columnIds.length > 0 ? (
				<ul>
					{data.columnIds.map((column, i) => (
						<li key={i} className="NLT__error">
							Invalid type definition in column {column}
						</li>
					))}
				</ul>
			) : (
				<div className="NLT__error">Missing type definition row</div>
			)}
		</>
	);
}
