import "./styles.css";

interface Props {
	content: string;
}

export default function Text({ content }: Props) {
	return <p className="NLT__p">{content}</p>;
}
