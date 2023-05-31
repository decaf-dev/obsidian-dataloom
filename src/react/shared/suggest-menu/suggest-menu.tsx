import React from "react";

import { TFile } from "obsidian";
import Menu from "src/react/shared/menu";
import SuggestMenuContent from "./suggest-menu-context";

interface Props {
	id: string;
	isOpen: boolean;
	top: number;
	left: number;
	filterValue: string;
	onItemClick: (item: TFile | null, isFileNameUnique: boolean) => void;
}

const SuggestMenu = React.forwardRef<HTMLDivElement, Props>(
	function SuggestMenu(
		{ id, isOpen, top, left, filterValue, onItemClick }: Props,
		ref
	) {
		return (
			<Menu id={id} isOpen={isOpen} top={top} left={left} ref={ref}>
				<SuggestMenuContent
					filterValue={filterValue}
					onItemClick={onItemClick}
				/>
			</Menu>
		);
	}
);

export default SuggestMenu;
