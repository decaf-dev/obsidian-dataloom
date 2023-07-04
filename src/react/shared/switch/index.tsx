import { css } from "@emotion/react";
import { useAppSelector } from "src/redux/global/hooks";
import "./styles.css";

interface Props {
	id?: string;
	isChecked: boolean;
	ariaLabel?: string;
	onToggle: (value: boolean) => void;
}

export default function Switch({ id, isChecked, ariaLabel, onToggle }: Props) {
	const { isDarkMode } = useAppSelector((state) => state.global);
	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			e.stopPropagation();
			onToggle(!isChecked);
		}
	}

	let className =
		"checkbox-container Dashboards__switch Dashboards__focusable";
	if (isChecked) className += " is-enabled";
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
			onClick={() => onToggle(!isChecked)}
			onKeyDown={handleKeyDown}
		>
			<input type="checkbox" />
		</div>
	);
}
