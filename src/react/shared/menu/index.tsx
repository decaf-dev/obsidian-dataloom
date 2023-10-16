import React from "react";

import BaseMenu from "../base-menu";

import { LoomMenuOpenDirection, LoomMenuPosition } from "./types";
import { useShiftMenu } from "../base-menu/utils";
import { useAppMount } from "src/react/loom-app/app-mount-provider";

interface Props {
	id: string;
	isOpen: boolean;
	hideBorder?: boolean;
	position: LoomMenuPosition;
	openDirection?: LoomMenuOpenDirection;
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
	width = 0,
	height = 0,
	maxHeight = 0,
	maxWidth = 0,
	children,
}: Props) {
	const ref = React.useRef<HTMLDivElement>(null);
	const { mountLeaf } = useAppMount();

	useShiftMenu(false, mountLeaf.view.containerEl, ref, position, isOpen, {
		openDirection,
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
			maxHeight={maxHeight}
			maxWidth={maxWidth}
		>
			{children}
		</BaseMenu>
	);
}
