import React from "react";
import ReactDOM from "react-dom";

import { numToPx } from "src/shared/conversion";

import type { LoomMenuPosition } from "../menu/types";

import { useMenuOperations } from "../menu-provider/hooks";

import Logger from "js-logger";
import "./styles.css";

interface Props {
	id: string;
	isOpen: boolean;
	hideBorder?: boolean;
	position: LoomMenuPosition;
	width?: number;
	height?: number;
	maxWidth?: number;
	minWidth?: number;
	maxHeight?: number;
	children: React.ReactNode;
}

const BaseMenu = React.forwardRef<HTMLDivElement, Props>(
	(
		{
			id,
			isOpen,
			hideBorder = false,
			position,
			width = 0,
			height = 0,
			minWidth = 0,
			maxHeight = 0,
			maxWidth = 0,
			children,
		}: Props,
		ref
	) => {
		const { topMenu, onRequestClose, onClose } = useMenuOperations();

		function handleClick(e: React.MouseEvent) {
			Logger.trace("Menu handleClick");
			//Don't propagate to the app
			//it will close the menu again
			e.stopPropagation();

			if (!topMenu) return;
			if (topMenu.id === id) return;
			onRequestClose(topMenu.id, "close-on-save");
		}

		function handleKeyDown(e: React.KeyboardEvent) {
			Logger.trace("Menu handleKeyDown");
			if (topMenu === null) return;

			if (e.key === "Enter") {
				//Don't propagate to the app, it will close the menu again
				e.stopPropagation();
				onRequestClose(topMenu.id, "close-on-save");
			} else if (e.key === "Escape") {
				//Don't propagate to the app
				//it will close the menu again
				e.stopPropagation();
				onClose(topMenu.id);
			}
		}

		if (!isOpen) return <></>;

		return ReactDOM.createPortal(
			<div
				id={id}
				className="dataloom-menu"
				ref={ref}
				style={{
					top: numToPx(position.top),
					left: numToPx(position.left),
					width: width !== 0 ? numToPx(width) : "max-content",
					height: height !== 0 ? numToPx(height) : "max-content",
					minWidth: minWidth !== 0 ? numToPx(minWidth) : undefined,
					maxWidth: maxWidth !== 0 ? numToPx(maxWidth) : undefined,
					maxHeight: maxHeight !== 0 ? numToPx(maxHeight) : undefined,
					overflowY: maxHeight !== 0 ? "scroll" : undefined,
					boxShadow: hideBorder
						? undefined
						: "0px 0px 0px 2px var(--background-modifier-border)",
				}}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
			>
				{children}
			</div>,
			document.body
		);
	}
);

export default BaseMenu;
