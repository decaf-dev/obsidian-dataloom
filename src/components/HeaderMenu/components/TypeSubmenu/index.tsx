import React from "react";

import { TYPE_ITEMS } from "../../constants";
import MenuItem from "../MenuItem";
import Submenu from "../Submenu";

//TODO change content type to string
interface Props {
	title: string;
	headerType: string;
	onTypeClick: (type: string) => void;
	onBackClick: () => void;
}

export default function TypeSubmenu({
	title,
	headerType,
	onTypeClick,
	onBackClick,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
			{TYPE_ITEMS.map((item) => (
				<MenuItem
					key={item.name}
					icon={null}
					content={item.content}
					onClick={() => onTypeClick(item.type)}
					selected={item.type === headerType}
				/>
			))}
		</Submenu>
	);
}
