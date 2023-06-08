import Icon from "src/react/shared/icon";
import Stack from "src/react/shared/stack";
import Flex from "../flex";
import Text from "../text";
import Padding from "../padding";

import { css } from "@emotion/react";
import React from "react";

interface Props {
	isFocusable?: boolean;
	lucideId?: string;
	ariaLabel?: string;
	name: string;
	value?: string;
	isSelected?: boolean;
	onClick?: () => void;
}

export default function MenuItem({
	isFocusable = true,
	lucideId,
	ariaLabel,
	name,
	value,
	onClick,
	isSelected = false,
}: Props) {
	const ref = React.useRef(null);
	React.useEffect(() => {
		if (!ref.current) return;

		if (isSelected) {
			(ref.current as HTMLElement).focus();
		}
	}, [isSelected]);

	function handleClick() {
		if (!onClick) return;
		onClick();
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			//Stop propagation so the the menu doesn't close when pressing enter
			e.stopPropagation();

			if (!onClick) return;
			onClick();
		}
	}

	let className = "NLT__menu-item NLT__selectable";
	if (isSelected) className += " NLT__selected";
	if (isFocusable) className += " NLT__focusable";

	return (
		<div
			ref={ref}
			tabIndex={0}
			className={className}
			css={css`
				display: flex;
				align-items: center;
				padding: var(--nlt-spacing--sm) var(--nlt-spacing--lg);
				width: 100%;
			`}
			aria-label={ariaLabel}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
		>
			<Flex justify="space-between">
				<Stack>
					{lucideId !== undefined && (
						<Padding pb="sm">
							<Icon lucideId={lucideId} />
						</Padding>
					)}
					<Text value={name} />
				</Stack>
				{value !== undefined && <Text variant="faint" value={value} />}
			</Flex>
		</div>
	);
}
