import { useOverflow } from "src/shared/spacing/hooks";

import "./styles.css";

interface Props {
	variant?: "semibold" | "faint" | "muted" | "on-accent" | "error" | "normal";
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	value: string | number;
	maxWidth?: string;
	noWrap?: boolean;
}

export default function Text({
	value,
	variant,
	size = "sm",
	maxWidth,
	noWrap = false,
}: Props) {
	const overflowClassName = useOverflow(maxWidth !== undefined && !noWrap, {
		ellipsis: true,
	});

	let className = "dataloom-text";
	if (variant === "faint") className += " dataloom-text--faint";
	else if (variant === "muted") className += " dataloom-text--muted";
	else if (variant === "semibold") className += " dataloom-text--semibold";
	else if (variant === "on-accent") className += " dataloom-text--on-accent";
	else if (variant === "error") className += " dataloom-text--error";
	className += " " + overflowClassName;

	let fontSize = "";
	if (size === "xs") {
		fontSize = "var(--dataloom-font-size--xs)";
	} else if (size === "sm") {
		fontSize = "var(--dataloom-font-size--sm)";
	} else if (size === "md") {
		fontSize = "var(--dataloom-font-size--md)";
	} else if (size === "lg") {
		fontSize = "var(--dataloom-font-size--lg)";
	}

	return (
		<p
			className={className}
			style={{
				fontSize,
				maxWidth: maxWidth !== undefined ? maxWidth : undefined,
			}}
		>
			{value}
		</p>
	);
}
