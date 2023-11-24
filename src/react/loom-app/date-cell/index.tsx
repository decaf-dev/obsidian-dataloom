import "./styles.css";

interface Props {
	content: string;
}

export default function DateCell({ content }: Props) {
	return <div className="dataloom-date-cell">{content}</div>;
}
