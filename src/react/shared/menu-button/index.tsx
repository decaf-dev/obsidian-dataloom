import React from "react";

import MenuTrigger from "../menu-trigger";
import Button from "../button";

import { ButtonVariant } from "../button/types";
import { LoomMenuLevel } from "../menu-provider/types";

interface Props {
	menuId: string;
	level: LoomMenuLevel;
	isFocused: boolean;
	isDisabled?: boolean;
	variant?: ButtonVariant;
	ariaLabel?: string;
	icon?: React.ReactNode;
	children?: React.ReactNode;
	onClick?: (e: React.MouseEvent) => void;
	onMouseDown?: (e: React.MouseEvent) => void;
	onOpen: () => void;
}

const MenuButton = React.forwardRef<HTMLDivElement, Props>(
	(
		{
			menuId,
			isDisabled,
			isFocused,
			variant,
			level,
			ariaLabel,
			icon,
			children,
			onClick,
			onMouseDown,
			onOpen,
		}: Props,
		ref
	) => {
		return (
			<MenuTrigger
				ref={ref}
				menuId={menuId}
				isFocused={isFocused}
				variant="button"
				level={level}
				onClick={onClick}
				onMouseDown={onMouseDown}
				onOpen={onOpen}
			>
				<Button
					isDisabled={isDisabled}
					isFocusable={false}
					variant={variant}
					icon={icon}
					ariaLabel={ariaLabel}
				>
					{children}
				</Button>
			</MenuTrigger>
		);
	}
);

export default MenuButton;
