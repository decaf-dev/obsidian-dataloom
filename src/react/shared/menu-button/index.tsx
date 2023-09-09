import React from "react";

import MenuTrigger from "../menu-trigger";
import Button from "../button";
import { ButtonVariant } from "../button/types";
import { LoomMenu } from "../menu/types";

interface Props {
	isDisabled?: boolean;
	menu: LoomMenu;
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
			isDisabled,
			menu,
			variant,
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
				shouldOpenOnTrigger={true}
				isButton
				ref={ref}
				menu={menu}
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
