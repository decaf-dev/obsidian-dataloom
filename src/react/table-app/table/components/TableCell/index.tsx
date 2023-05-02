interface Props {
	content: React.ReactNode;
}

export default function TableCell({ content }: Props) {
	return <td className="NLT__td">{content}</td>;
}
