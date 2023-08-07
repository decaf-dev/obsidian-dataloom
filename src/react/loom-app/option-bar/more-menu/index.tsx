import React from "react";

import Menu from "src/react/shared/menu";
import { MoreMenuSubmenu } from "./constants";
import FrozenColumnsSubmenu from "./frozen-columns-submenu";
import BaseContent from "./base-content";

interface Props {
	id: string;
	isOpen: boolean;
	top: number;
	left: number;
	numFrozenColumns: number;
	onFrozenColumnsChange: (value: number) => void;
	onCloseClick: (shouldFocusTrigger: boolean) => void;
	onToggleColumnClick: () => void;
	onFilterClick: () => void;
}

const MoreMenu = React.forwardRef<HTMLDivElement, Props>(function MoreMenu(
	{
		id,
		isOpen,
		top,
		left,
		numFrozenColumns,
		onCloseClick,
		onFrozenColumnsChange,
		onToggleColumnClick,
		onFilterClick,
	}: Props,
	ref
) {
	const [submenu, setSubmenu] = React.useState<MoreMenuSubmenu | null>(null);

	React.useEffect(() => {
		// If the menu is closed, clear the submenu.
		if (!isOpen) setSubmenu(null);
	}, [isOpen]);

	return (
		<Menu id={id} isOpen={isOpen} top={top} left={left} ref={ref}>
			{submenu === null && (
				<BaseContent
					onToggleColumnClick={onToggleColumnClick}
					onFilterClick={onFilterClick}
					onFreezeColumnsClick={() =>
						setSubmenu(MoreMenuSubmenu.FROZEN_COLUMNS)
					}
					onExportClick={() => onCloseClick(false)}
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
});

export default MoreMenu;
