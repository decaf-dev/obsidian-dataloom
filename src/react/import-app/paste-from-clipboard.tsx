interface Props {
	value: string;
	onChange: (value: string) => void;
}

export default function PasteFromClipboard({ value, onChange }: Props) {
	return (
		<textarea value={value} onChange={(e) => onChange(e.target.value)} />
	);
}
