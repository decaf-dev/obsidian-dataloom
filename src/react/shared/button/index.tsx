import React from "react";

import "./styles.css";
import { css } from "@emotion/react";

interface InternalButtonProps {
	menuId?: string;
	//On mobile the width of a button will be 100% of the screen
	//Constrain width will make the button the width of its content
	constrainWidth?: boolean;
	isLink?: boolean;
	shouldMenuRequestOnClose?: boolean;
	isSimple?: boolean;
	ariaLabel?: string;
	icon?: React.ReactNode;
	children?: React.ReactNode;
	onClick: (e: React.MouseEvent) => void;
	onMouseDown?: (e: React.MouseEvent) => void;
}

const InternalButton = ({
	isLink,
	children,
	constrainWidth = false,
	ariaLabel = "",
	shouldMenuRequestOnClose,
	icon,
	menuId,
	isSimple,
	onClick,
	onMouseDown,
}: InternalButtonProps) => {
	let className = "NLT__button NLT__focusable";
	if (icon !== undefined) className += " NLT__button--icon";
	if (isSimple) className += " NLT__button--simple";
	if (isLink) className += " NLT__button--link";

	return (
		<button
			className={className}
			css={css`
				width: ${constrainWidth ? "max-content !important" : "unset"};
			`}
			aria-label={ariaLabel}
			data-menu-id={menuId}
			data-menu-should-request-on-close={shouldMenuRequestOnClose}
			onClick={onClick}
			onMouseDown={onMouseDown}
		>
			{icon !== undefined ? icon : children}
		</button>
	);
};

interface ButtonProps
	extends Omit<Omit<InternalButtonProps, "menuId">, "shouldRequestOnClose"> {}

interface MenuButtonProps extends InternalButtonProps {
	menuId: string;
}

export const Button = ({
	constrainWidth,
	isSimple,
	isLink,
	ariaLabel,
	icon,
	children,
	onClick,
	onMouseDown,
}: ButtonProps) => {
	return (
		<InternalButton
			constrainWidth={constrainWidth}
			isLink={isLink}
			isSimple={isSimple}
			ariaLabel={ariaLabel}
			icon={icon}
			children={children}
			onClick={onClick}
			onMouseDown={onMouseDown}
		/>
	);
};

export const MenuButton = ({
	constrainWidth,
	menuId,
	isLink = false,
	shouldMenuRequestOnClose = false,
	isSimple,
	ariaLabel,
	icon,
	children,
	onClick,
	onMouseDown,
}: MenuButtonProps) => {
	return (
		<InternalButton
			constrainWidth={constrainWidth}
			isLink={isLink}
			menuId={menuId}
			shouldMenuRequestOnClose={shouldMenuRequestOnClose}
			isSimple={isSimple}
			ariaLabel={ariaLabel}
			icon={icon}
			children={children}
			onClick={onClick}
			onMouseDown={onMouseDown}
		/>
	);
};
