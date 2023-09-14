import "./styles.css";

interface Props {
	className?: string;
	value: string[];
	onKeyDown?: (e: React.KeyboardEvent<HTMLSelectElement>) => void;
	onChange: (value: string[]) => void;
	children: React.ReactNode;
}

export default function MultiSelect({
	className: customClassName,
	value,
	onChange,
	onKeyDown,
	children,
}: Props) {
	function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const selectedValues = Array.from(
			e.target.selectedOptions,
			(option) => option.value
		);
		onChange(selectedValues);
	}

	let className = "dataloom-multi-select dataloom-focusable";
	if (customClassName) {
		className += " " + customClassName;
	}

	return (
		<select
			tabIndex={0}
			multiple={true}
			className={className}
			value={value}
			onChange={handleChange}
			onKeyDown={onKeyDown}
		>
			{children}
		</select>
	);
}
