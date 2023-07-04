import { DateFormat } from "src/shared/types";
import { getDateCellContent } from "src/shared/cell-content/date-cell-content";

import { css } from "@emotion/react";

interface Props {
	value: number | null;
	format: DateFormat;
}

export default function DateCell({ value, format }: Props) {
	const content = getDateCellContent(value, format);
	return (
		<div
			className="Dashboards__date-cell"
			css={css`
				width: 100%;
				text-align: left;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				padding: var(--nlt-cell-spacing);
			`}
		>
			{content}
		</div>
	);
}
