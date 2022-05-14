import React from "react";

interface Props {
	isChecked: boolean;
	onCheckboxChange: (isChecked: boolean) => void;
}

export default function CheckboxCell({ isChecked, onCheckboxChange }: Props) {
	return (
		<div
			style={{ width: "100%" }}
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
