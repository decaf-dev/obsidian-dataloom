interface Props {
	isChecked: boolean;
	onToggle: (value: boolean) => void;
}

export default function Switch({ isChecked, onToggle }: Props) {
	let className = "checkbox-container";
	if (isChecked) className += " is-enabled";
	return (
		<div className={className} onClick={() => onToggle(!isChecked)}>
			<input type="checkbox" />
		</div>
	);
}
