import "./styles.css";

interface Props {
	value: string;
	onInputChange: (value: string) => void;
}

export default function NumberCellEdit({ value, onInputChange }: Props) {
	return (
		<div className="NLT__number-cell-edit">
			<input
				type="number"
				autoFocus
				value={value}
				onChange={(e) => onInputChange(e.target.value)}
			/>
		</div>
	);
}
