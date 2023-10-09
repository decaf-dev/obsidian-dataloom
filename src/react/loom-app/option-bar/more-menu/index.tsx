import React from "react";

import Menu from "src/react/shared/menu";
import { MoreMenuSubmenu } from "./constants";
import BaseContent from "./base-content";
import {
	LoomMenuCloseRequestType,
	Position,
} from "src/react/shared/menu/types";
import SettingsSubmenu from "./settings-submenu";
import ToggleColumnSubmenu from "./toggle-column-submenu";
import { Column } from "src/shared/loom-state/types/loom-state";

interface Props {
	id: string;
	isOpen: boolean;
	columns: Column[];
	triggerPosition: Position;
	showCalculationRow: boolean;
	onFilterClick: () => void;
	onSourcesClick: () => void;
	onColumnToggle: (id: string, isVisible: boolean) => void;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onCalculationRowToggle: (value: boolean) => void;
	onClose: () => void;
}

export default function MoreMenu({
	id,
	isOpen,
	triggerPosition,
	showCalculationRow,
	columns,
	onFilterClick,
	onSourcesClick,
	onRequestClose,
	onClose,
	onCalculationRowToggle,
	onColumnToggle,
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
					onToggleColumnClick={() =>
						setSubmenu(MoreMenuSubmenu.TOGGLE_COLUMNS)
					}
					onFilterClick={onFilterClick}
					onSourcesClick={onSourcesClick}
					onClose={onClose}
					onSettingsClick={() => setSubmenu(MoreMenuSubmenu.SETTINGS)}
				/>
			)}
			{submenu === MoreMenuSubmenu.SETTINGS && (
				<SettingsSubmenu
					showCalculationRow={showCalculationRow}
					onBackClick={() => setSubmenu(null)}
					onCalculationRowToggle={onCalculationRowToggle}
				/>
			)}
			{submenu === MoreMenuSubmenu.TOGGLE_COLUMNS && (
				<ToggleColumnSubmenu
					columns={columns}
					onColumnToggle={onColumnToggle}
					onBackClick={() => setSubmenu(null)}
				/>
			)}
		</Menu>
	);
}
