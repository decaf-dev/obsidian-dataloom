import "./styles.css";

interface Props {
	value: string;
}

export default function Text({ value }: Props) {
	return <p className="NLT__p">{value}</p>;
}
