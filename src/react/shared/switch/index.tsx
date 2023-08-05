import { css } from "@emotion/react";
import { useAppSelector } from "src/redux/hooks";
import "./styles.css";

interface Props {
	id?: string;
	ariaLabel?: string;
	value: boolean;
	onToggle: (value: boolean) => void;
}

export default function Switch({ id, value, ariaLabel, onToggle }: Props) {
	const { isDarkMode } = useAppSelector((state) => state.global);
	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			e.stopPropagation();
			onToggle(!value);
		}
	}

	let className = "checkbox-container dataloom-switch dataloom-focusable";
	if (value) className += " is-enabled";
	return (
		<div
			id={id}
			tabIndex={0}
			className={className}
			css={css`
				transition: none !important;
				&:focus-visible {
					outline: 2px solid ${
						isDarkMode
							? "var(--text-on-accent);"
							: "var(--text-on-accent-inverted);"
					}
					outline-offset: 0px;
				}
			`}
			aria-label={ariaLabel}
			onClick={() => onToggle(!value)}
			onKeyDown={handleKeyDown}
		>
			<input type="checkbox" />
		</div>
	);
}
