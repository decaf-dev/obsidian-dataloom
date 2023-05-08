import "./styles.css";

interface Props {
	isChecked: boolean;
	ariaLabel?: string;
	onToggle: (value: boolean) => void;
}

export default function Switch({ isChecked, ariaLabel, onToggle }: Props) {
	let className = "checkbox-container NLT__switch";
	if (isChecked) className += " is-enabled";
	return (
		<div
			className={className}
			aria-label={ariaLabel}
			onClick={() => onToggle(!isChecked)}
		>
			<input type="checkbox" />
		</div>
	);
}
