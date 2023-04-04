import "./styles.css";

interface Props {
	variant?: "faint" | "muted" | "normal";
	value: string;
}

export default function Text({ value, variant }: Props) {
	let className = "NLT__p";
	if (variant == "faint") className += " NLT__text-faint";
	if (variant == "muted") className += " NLT__text-muted";
	return <p className={className}>{value}</p>;
}
