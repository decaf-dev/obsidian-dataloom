import { css } from "@emotion/react";
import "./styles.css";

interface Props {
	variant?: "semibold" | "faint" | "muted" | "normal";
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	value: string;
	maxWidth?: string;
	whiteSpace?: "nowrap" | "pre" | "pre-wrap" | "pre-line" | "break-spaces";
}

export default function Text({
	value,
	variant,
	size = "sm",
	maxWidth,
	whiteSpace = "nowrap",
}: Props) {
	let className = "NLT__p";

	if (variant == "faint") className += " NLT__text-faint";
	if (variant == "muted") className += " NLT__text-muted";
	if (variant == "semibold") className += " NLT__text-semibold";

	let fontSize = "";
	if (size === "xs") {
		fontSize = "var(--nlt-font-size--xs)";
	} else if (size == "sm") {
		fontSize = "var(--nlt-font-size--sm)";
	} else if (size == "md") {
		fontSize = "var(--nlt-font-size--md)";
	} else if (size == "lg") {
		fontSize = "var(--nlt-font-size--lg)";
	}

	return (
		<p
			className={className}
			css={css`
				font-size: ${fontSize};
				max-width: ${maxWidth === undefined ? "unset" : maxWidth};
				white-space: ${whiteSpace}
				overflow: ${maxWidth === undefined ? "unset" : "hidden"};
				text-overflow: ${maxWidth === undefined ? "unset" : "ellipsis"};
			`}
		>
			{value}
		</p>
	);
}
