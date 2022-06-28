import React, { forwardRef } from "react";

import "./styles.css";
interface Props {
	text: string;
	width: string;
	onClick: (e: React.MouseEvent) => void;
	onContextClick: (e: React.MouseEvent) => void;
}

type Ref = HTMLTableCellElement;

const DateCell = forwardRef<Ref, Props>(
	({ text, width, onContextClick, onClick }: Props, ref) => {
		return (
			<td
				className="NLT__date-cell"
				ref={ref}
				style={{ width }}
				onContextMenu={onContextClick}
				onClick={onClick}
			>
				{text}
			</td>
		);
	}
);

export default DateCell;
