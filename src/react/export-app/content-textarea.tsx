interface Props {
	value: string;
}

export default function ContentTextArea({ value }: Props) {
	return <textarea readOnly value={value} />;
}
