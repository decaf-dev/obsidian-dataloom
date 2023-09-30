import "./styles.css";

interface Props {
	id?: string;
	hasError?: boolean;
	className?: string;
	value: string;
	onKeyDown?: (e: React.KeyboardEvent<HTMLSelectElement>) => void;
	onChange: (value: string) => void;
	children: React.ReactNode;
}

export default function Select({
	id,
	hasError,
	className: customClassName,
	value,
	onChange,
	onKeyDown,
	children,
}: Props) {
	let className = "dataloom-select dataloom-focusable";
	if (customClassName) {
		className += " " + customClassName;
	}
	if (hasError) {
		className += " dataloom-select--error";
	}
	return (
		<select
			id={id}
			tabIndex={0}
			className={className}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			onKeyDown={onKeyDown}
		>
			{children}
		</select>
	);
}
