import { css } from "@emotion/react";
import "./styles.css";
import { useAppSelector } from "src/redux/global/hooks";

interface Props {
	isChecked: boolean;
	ariaLabel?: string;
	onToggle: (value: boolean) => void;
}

export default function Switch({ isChecked, ariaLabel, onToggle }: Props) {
	const { isDarkMode } = useAppSelector((state) => state.global);
	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			e.stopPropagation();
			onToggle(!isChecked);
		}
	}

	let className = "checkbox-container NLT__switch NLT__focusable";
	if (isChecked) className += " is-enabled";
	return (
		<div
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
			onClick={() => onToggle(!isChecked)}
			onKeyDown={handleKeyDown}
		>
			<input type="checkbox" />
		</div>
	);
}
