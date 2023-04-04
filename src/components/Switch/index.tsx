import "./styles.css";

interface Props {
	isChecked: boolean;
	onToggle: (value: boolean) => void;
}

export default function Switch({ isChecked, onToggle }: Props) {
	return (
		<label className="NLT__switch">
			<input
				type="checkbox"
				checked={isChecked}
				onChange={() => {}}
				onClick={() => {
					onToggle(!isChecked);
				}}
			/>
			<span className="NLT__slider"></span>
		</label>
	);
}
