import React from "react";
import ReactDOM from "react-dom";

import { numToPx } from "src/shared/conversion";
import { useLogger } from "src/shared/logger";

import { LoomMenuCloseRequestType, Position } from "./types";

import "./styles.css";

interface Props {
	id: string;
	isOpen: boolean;
	hideBorder?: boolean;
	triggerPosition: Position;
	width?: number;
	height?: number;
	maxWidth?: number;
	maxHeight?: number;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onClose: () => void;
	children: React.ReactNode;
}

const BaseMenu = React.forwardRef<HTMLDivElement, Props>(
	(
		{
			id,
			isOpen,
			hideBorder = false,
			triggerPosition,
			width = 0,
			height = 0,
			maxHeight = 0,
			maxWidth = 0,
			children,
			onRequestClose,
			onClose,
		}: Props,
		ref
	) => {
		const logger = useLogger();

		function handleKeyDown(e: React.KeyboardEvent) {
			logger("Menu handleKeyDown");
			if (e.key === "Enter") {
				onRequestClose("close-on-save");
			} else if (e.key === "Escape") {
				onClose();
			}
		}

		function handleClick(e: React.MouseEvent) {
			logger("Menu handleClick");
			e.stopPropagation();
		}

		if (!isOpen) return <></>;

		return (
			<>
				{ReactDOM.createPortal(
					<div
						id={id}
						className="dataloom-menu"
						onClick={handleClick}
						onKeyDown={handleKeyDown}
					>
						<div
							ref={ref}
							className="dataloom-menu__container"
							style={{
								top: numToPx(triggerPosition.top),
								left: numToPx(triggerPosition.left),
								width:
									width !== 0
										? numToPx(width)
										: "max-content",
								height:
									height !== 0
										? numToPx(height)
										: "max-content",
								maxWidth:
									maxWidth !== 0
										? numToPx(maxWidth)
										: undefined,
								maxHeight:
									maxHeight !== 0
										? numToPx(maxHeight)
										: undefined,
								overflowY:
									maxHeight !== 0 ? "scroll" : undefined,
								boxShadow: hideBorder
									? undefined
									: "0px 0px 0px 2px var(--background-modifier-border)",
							}}
						>
							{children}
						</div>
					</div>,
					document.body
				)}
			</>
		);
	}
);

export default BaseMenu;
