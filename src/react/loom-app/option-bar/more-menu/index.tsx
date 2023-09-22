import React from "react";

import Menu from "src/react/shared/menu";
import { MoreMenuSubmenu } from "./constants";
import FrozenColumnsSubmenu from "./frozen-columns-submenu";
import BaseContent from "./base-content";
import {
	LoomMenuCloseRequestType,
	Position,
} from "src/react/shared/menu/types";
import SettingsSubmenu from "./settings-submenu";

interface Props {
	id: string;
	isOpen: boolean;
	triggerPosition: Position;
	numFrozenColumns: number;
	showCalculationRow: boolean;
	onFrozenColumnsChange: (value: number) => void;
	onToggleColumnClick: () => void;
	onFilterClick: () => void;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onCalculationRowToggle: (value: boolean) => void;
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
	showCalculationRow,
	onCalculationRowToggle,
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
					onSettingsClick={() => setSubmenu(MoreMenuSubmenu.SETTINGS)}
				/>
			)}
			{submenu == MoreMenuSubmenu.FROZEN_COLUMNS && (
				<FrozenColumnsSubmenu
					numFrozenColumns={numFrozenColumns}
					onBackClick={() => setSubmenu(null)}
					onFrozenColumnsChange={onFrozenColumnsChange}
				/>
			)}
			{submenu === MoreMenuSubmenu.SETTINGS && (
				<SettingsSubmenu
					showCalculationRow={showCalculationRow}
					onBackClick={() => setSubmenu(null)}
					onCalculationRowToggle={onCalculationRowToggle}
				/>
			)}
		</Menu>
	);
}
