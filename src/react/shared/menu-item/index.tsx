import React from "react";

import Icon from "src/react/shared/icon";
import Stack from "src/react/shared/stack";
import Flex from "../flex";
import Text from "../text";
import Padding from "../padding";

import "./styles.css";

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

	function handleClick(e: React.MouseEvent) {
		if (!onClick) return;

		//Stop propagation so the the menu doesn't remove the focus class
		e.stopPropagation();
		onClick();
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			//Stop propagation so the the menu doesn't close when pressing enter
			e.stopPropagation();
			onClick?.();
		}
	}

	let className = "dataloom-menu-item dataloom-selectable";
	if (isSelected) className += " dataloom-selected";
	if (isFocusable) className += " dataloom-focusable";

	return (
		<div
			ref={ref}
			tabIndex={0}
			className={className}
			aria-label={ariaLabel}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
		>
			<Flex justify="space-between" align="center">
				<Stack isHorizontal>
					{lucideId !== undefined && (
						<Padding width="unset" pb="sm">
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
