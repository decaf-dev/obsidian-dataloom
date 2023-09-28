import "./styles.css";

interface Props {
	id?: string;
	className?: string;
	value: string;
	onKeyDown?: (e: React.KeyboardEvent<HTMLSelectElement>) => void;
	onChange: (value: string) => void;
	children: React.ReactNode;
}

export default function Select({
	id,
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
			id={id}
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
