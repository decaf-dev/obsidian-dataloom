import React from "react";

interface Props {
	isChecked: boolean;
	onCheckboxChange: (isChecked: boolean) => void;
}

export default function CheckboxCell({ isChecked, onCheckboxChange }: Props) {
	return (
		<input
			type="checkbox"
			checked={isChecked}
			onChange={() => onCheckboxChange(!isChecked)}
		></input>
	);
}
