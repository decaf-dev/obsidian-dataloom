import "./styles.css";

interface Props {
	isChecked: boolean;
	ariaLabel?: string;
	onToggle: (value: boolean) => void;
}

export default function Switch({ isChecked, ariaLabel, onToggle }: Props) {
	function handleKeyDown(e: React.KeyboardEvent) {
		console.log("SWITCH KEY DOWN");
		if (e.key === "Enter") {
			e.stopPropagation();
			onToggle(!isChecked);
		}
	}

	let className =
		"checkbox-container NLT__switch NLT__focusable NLT__focusable--switch";
	if (isChecked) className += " is-enabled";
	return (
		<div
			tabIndex={0}
			className={className}
			aria-label={ariaLabel}
			onClick={() => onToggle(!isChecked)}
			onKeyDown={handleKeyDown}
		>
			<input type="checkbox" />
		</div>
	);
}
