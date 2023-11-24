import "./styles.css";

interface Props {
	value: boolean;
}

export default function CheckboxCell({ value }: Props) {
	return (
		<div className="dataloom-checkbox-cell">
			<input
				className="task-list-item-checkbox"
				type="checkbox"
				checked={value}
				onChange={() => {}}
			/>
		</div>
	);
}
