import "./styles.css";
interface Props {
	value: string;
}

export default function DateCell({ value }: Props) {
	return <div className="NLT__date-cell">{value}</div>;
}
