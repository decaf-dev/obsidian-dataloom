import "./styles.css";

interface Props {
	content: string;
}

export default function NumberCell({ content }: Props) {
	return <div className="dataloom-number-cell">{content}</div>;
}
