import { isCheckboxChecked } from "src/shared/match";

import "./styles.css";

interface Props {
	value: string;
}

export default function CheckboxCell({ value }: Props) {
	const isChecked = isCheckboxChecked(value);

	return (
		<div className="dataloom-checkbox-cell">
			<input
				className="task-list-item-checkbox"
				type="checkbox"
				checked={isChecked}
				onChange={() => {}}
			/>
		</div>
	);
}
