import React from "react";

import Menu from "src/react/shared/menu";
import { MoreMenuSubmenu } from "./constants";
import FrozenColumnsSubmenu from "./frozen-columns-submenu";
import BaseContent from "./base-content";
import {
	LoomMenuCloseRequestType,
	Position,
} from "src/react/shared/menu/types";

interface Props {
	id: string;
	isOpen: boolean;
	triggerPosition: Position;
	numFrozenColumns: number;
	onFrozenColumnsChange: (value: number) => void;
	onToggleColumnClick: () => void;
	onFilterClick: () => void;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onClose: () => void;
}

export default function MoreMenu({
	id,
	isOpen,
	triggerPosition,
	numFrozenColumns,
	onFrozenColumnsChange,
	onToggleColumnClick,
	onFilterClick,
	onRequestClose,
	onClose,
}: Props) {
	const [submenu, setSubmenu] = React.useState<MoreMenuSubmenu | null>(null);

	React.useEffect(() => {
		// If the menu is closed, clear the submenu.
		if (!isOpen) setSubmenu(null);
	}, [isOpen]);

	return (
		<Menu
			id={id}
			openDirection="bottom-left"
			isOpen={isOpen}
			triggerPosition={triggerPosition}
			onRequestClose={onRequestClose}
			onClose={onClose}
		>
			{submenu === null && (
				<BaseContent
					onToggleColumnClick={onToggleColumnClick}
					onFilterClick={onFilterClick}
					onFreezeColumnsClick={() =>
						setSubmenu(MoreMenuSubmenu.FROZEN_COLUMNS)
					}
					onClose={onClose}
				/>
			)}
			{submenu == MoreMenuSubmenu.FROZEN_COLUMNS && (
				<FrozenColumnsSubmenu
					numFrozenColumns={numFrozenColumns}
					onBackClick={() => setSubmenu(null)}
					onFrozenColumnsChange={onFrozenColumnsChange}
				/>
			)}
		</Menu>
	);
}
