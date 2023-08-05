import { useOverflow } from "src/shared/spacing/hooks";
import "./styles.css";

interface Props {
	variant?: "semibold" | "faint" | "muted" | "normal";
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	value: string;
	maxWidth?: string;
}

export default function Text({ value, variant, size = "sm", maxWidth }: Props) {
	const overflowClassName = useOverflow(maxWidth !== undefined);

	let className = "dataloom-text";

	if (variant === "faint") className += " dataloom-text--faint";
	if (variant === "muted") className += " dataloom-text--muted";
	if (variant === "semibold") className += " dataloom-text--semibold";
	className += " " + overflowClassName;

	let fontSize = "";
	if (size === "xs") {
		fontSize = "var(--nlt-font-size--xs)";
	} else if (size === "sm") {
		fontSize = "var(--nlt-font-size--sm)";
	} else if (size === "md") {
		fontSize = "var(--nlt-font-size--md)";
	} else if (size === "lg") {
		fontSize = "var(--nlt-font-size--lg)";
	}
	return (
		<p
			className={className}
			style={{
				fontSize,
				maxWidth: maxWidth === undefined ? "unset" : maxWidth,
			}}
		>
			{value}
		</p>
	);
}
