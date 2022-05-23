import React from "react";

import "./styles.css";

interface Props {
	isChecked: boolean;
	onCheckboxChange: (isChecked: boolean) => void;
}

export default function CheckboxCell({ isChecked, onCheckboxChange }: Props) {
	return (
		<div
			className="NLT__checkbox-cell"
			onClick={() => onCheckboxChange(!isChecked)}
		>
			<input
				className="task-list-item-checkbox"
				type="checkbox"
				checked={isChecked}
				onChange={(e) => {
					e.stopPropagation();
					onCheckboxChange(!isChecked);
				}}
			/>
		</div>
	);
}
