import "./styles.css";

interface Props {
	className?: string;
	value: string;
	onKeyDown?: (e: React.KeyboardEvent<HTMLSelectElement>) => void;
	onChange: (value: string) => void;
	children: React.ReactNode;
}

export default function Select({
	className,
	value,
	onChange,
	onKeyDown,
	children,
}: Props) {
	let newClassName = "dataloom-select dataloom-focusable";
	if (className) {
		newClassName += " " + className;
	}
	return (
		<select
			tabIndex={0}
			className={newClassName}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			onKeyDown={onKeyDown}
		>
			{children}
		</select>
	);
}
