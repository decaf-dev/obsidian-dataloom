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
				className="NLT__td"
				style={{ width }}
				ref={ref}
				onClick={onClick}
				onContextMenu={onContextClick}
			>
				<div className="NLT__number-cell">{number}</div>
			</td>
		);
	}
);

export default NumberCell;
