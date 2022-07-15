import React, { forwardRef } from "react";

import "./styles.css";

interface Props {
	isChecked: boolean;
	width: string;
	onCheckboxChange: (isChecked: boolean) => void;
	onContextClick: (e: React.MouseEvent) => void;
}

type Ref = HTMLTableCellElement;

const CheckboxCell = forwardRef<Ref, Props>(
	({ isChecked, width, onContextClick, onCheckboxChange }: Props, ref) => {
		return (
			<td
				className="NLT__td"
				style={{ width }}
				ref={ref}
				onContextMenu={onContextClick}
				onClick={() => onCheckboxChange(!isChecked)}
			>
				<div className="NLT__checkbox-cell">
					<input
						className="task-list-item-checkbox"
						type="checkbox"
						checked={isChecked}
						onChange={() => {}}
						onClick={(e) => {
							e.stopPropagation();
							onCheckboxChange(!isChecked);
						}}
					/>
				</div>
			</td>
		);
	}
);

export default CheckboxCell;
