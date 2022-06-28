import React, { forwardRef } from "react";

import "./styles.css";

interface Props {
	number: string;
	width: string;
	onClick: (e: React.MouseEvent) => void;
	onContextClick: (e: React.MouseEvent) => void;
}

type Ref = HTMLTableCellElement;

const NumberCell = forwardRef<Ref, Props>(
	({ number, width, onClick, onContextClick }: Props, ref) => {
		return (
			<td
				className="NLT__td NLT__number-cell"
				ref={ref}
				onClick={onClick}
				onContextMenu={onContextClick}
				style={{ width }}
			>
				{number}
			</td>
		);
	}
);

export default NumberCell;
