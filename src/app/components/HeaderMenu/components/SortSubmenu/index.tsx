import React from "react";
import { SortDir } from "src/app/services/sort/types";

import { SORT_MENU_ITEM } from "../../constants";

import MenuItem from "../MenuItem";

interface Props {
	headerSortDir: SortDir;
	onSortClick: (sortDir: SortDir) => void;
}

export default function SortSubmenu({ headerSortDir, onSortClick }: Props) {
	return (
		<ul className="NLT__header-menu-ul">
			{Object.values(SORT_MENU_ITEM).map((item) => (
				<MenuItem
					key={item.name}
					icon={item.icon}
					content={`Sort ${item.content}`}
					onClick={() => onSortClick(item.name)}
					selected={headerSortDir === item.name}
				/>
			))}
		</ul>
	);
}
