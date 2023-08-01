import { css } from "@emotion/react";
import "./styles.css";
import { useOverflow } from "src/shared/spacing/hooks";

interface Props {
	variant?: "semibold" | "faint" | "muted" | "normal";
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	value: string;
	maxWidth?: string;
}

export default function Text({ value, variant, size = "sm", maxWidth }: Props) {
	let className = "dataloom-p";

	if (variant === "faint") className += " dataloom-text-faint";
	if (variant === "muted") className += " dataloom-text-muted";
	if (variant === "semibold") className += " dataloom-text-semibold";

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

	const overflowStyle = useOverflow(maxWidth !== undefined);
	return (
		<p
			className={className}
			css={css`
				font-size: ${fontSize};
				max-width: ${maxWidth === undefined ? "unset" : maxWidth};
				${overflowStyle}
			`}
		>
			{value}
		</p>
	);
}
