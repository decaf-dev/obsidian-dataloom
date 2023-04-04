import "./styles.css";

interface Props {
	value: string;
	onInputChange: (value: string) => void;
}

export default function CurrencyCellEdit({ value, onInputChange }: Props) {
	return (
		<div className="NLT__currency-cell-edit">
			<input
				type="number"
				autoFocus
				value={value}
				onChange={(e) => onInputChange(e.target.value)}
			/>
		</div>
	);
}
