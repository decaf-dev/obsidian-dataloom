interface Props {
	value: string;
	onChange: (value: string) => void;
}

export default function MarkdownInput({ value, onChange }: Props) {
	return (
		<textarea
			placeholder="Paste your markdown here..."
			style={{
				height: "150px",
				width: "100%",
			}}
			value={value}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
}
