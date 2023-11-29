import React from "react";

import BaseMenu from "../base-menu";

import { LoomMenuOpenDirection, LoomMenuPosition } from "./types";
import { useShiftMenu } from "../base-menu/utils";
import { useAppMount } from "src/react/loom-app/app-mount-provider";

interface Props {
	id: string;
	isOpen: boolean;
	position: LoomMenuPosition;
	hideBorder?: boolean;
	openDirection?: LoomMenuOpenDirection;
	topOffset?: number;
	leftOffset?: number;
	minWidth?: number;
	width?: number;
	height?: number;
	maxWidth?: number;
	maxHeight?: number;
	children: React.ReactNode;
}

export default function Menu({
	id,
	isOpen,
	hideBorder = false,
	openDirection,
	position,
	minWidth = 0,
	width = 0,
	height = 0,
	leftOffset = 0,
	topOffset = 0,
	maxHeight = 0,
	maxWidth = 0,
	children,
}: Props) {
	const ref = React.useRef<HTMLDivElement>(null);
	const { mountLeaf } = useAppMount();

	useShiftMenu(false, mountLeaf.view.containerEl, ref, position, isOpen, {
		openDirection,
		leftOffset,
		topOffset,
	});

	return (
		<BaseMenu
			ref={ref}
			id={id}
			isOpen={isOpen}
			hideBorder={hideBorder}
			position={position}
			width={width}
			height={height}
			minWidth={minWidth}
			maxHeight={maxHeight}
			maxWidth={maxWidth}
		>
			{children}
		</BaseMenu>
	);
}
