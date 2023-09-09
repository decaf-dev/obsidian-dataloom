import React from "react";

import BaseMenu from "./base-menu";

import {
	LoomMenuCloseRequestType,
	LoomMenuOpenDirection,
	Position,
} from "./types";
import { useShiftMenu } from "./utils";

import "./styles.css";
import { useAppMount } from "src/react/loom-app/app-mount-provider";

interface Props {
	id: string;
	isOpen: boolean;
	hideBorder?: boolean;
	triggerPosition: Position;
	openDirection?: LoomMenuOpenDirection;
	width?: number;
	height?: number;
	maxWidth?: number;
	maxHeight?: number;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onClose: () => void;
	children: React.ReactNode;
}

export default function Menu({
	id,
	isOpen,
	hideBorder = false,
	openDirection,
	triggerPosition,
	width = 0,
	height = 0,
	maxHeight = 0,
	maxWidth = 0,
	children,
	onRequestClose,
	onClose,
}: Props) {
	const ref = React.useRef<HTMLDivElement>(null);
	const { mountLeaf } = useAppMount();

	useShiftMenu(
		false,
		mountLeaf.view.containerEl,
		ref,
		triggerPosition,
		isOpen,
		{
			openDirection,
		}
	);

	if (!isOpen) return <></>;

	return (
		<BaseMenu
			ref={ref}
			id={id}
			isOpen={isOpen}
			hideBorder={hideBorder}
			triggerPosition={triggerPosition}
			width={width}
			height={height}
			maxHeight={maxHeight}
			maxWidth={maxWidth}
			onRequestClose={onRequestClose}
			onClose={onClose}
		>
			{children}
		</BaseMenu>
	);
}
