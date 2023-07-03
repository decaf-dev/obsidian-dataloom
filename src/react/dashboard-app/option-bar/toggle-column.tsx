import ToggleColumnMenu from "./toggle-column-menu";

import MenuButton from "src/react/shared/menu-button";
import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";
import { ColumnWithMarkdown } from "./types";
import React from "react";

interface Props {
	columns: ColumnWithMarkdown[];
	onToggle: (id: string) => void;
}

const areEqual = (prevProps: Readonly<Props>, nextProps: Readonly<Props>) => {
	const toggleMatches = prevProps.onToggle == nextProps.onToggle;
	const columnsMatch =
		JSON.stringify(prevProps.columns) === JSON.stringify(nextProps.columns);
	return toggleMatches && columnsMatch;
};

const ToggleColumn = ({ columns, onToggle }: Props) => {
	const { menu, isMenuOpen, menuRef } = useMenu(MenuLevel.ONE);
	const { triggerPosition, triggerRef } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen, {
		openDirection: "left",
	});

	return (
		<>
			<div ref={triggerRef}>
				<MenuButton isLink menu={menu}>
					Toggle
				</MenuButton>
			</div>
			<ToggleColumnMenu
				id={menu.id}
				ref={menuRef}
				top={triggerPosition.top}
				left={triggerPosition.left}
				isOpen={isMenuOpen}
				columns={columns}
				onToggle={onToggle}
			/>
		</>
	);
};

export default React.memo(ToggleColumn, areEqual);
