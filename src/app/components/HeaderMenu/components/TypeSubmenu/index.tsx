import React from "react";

import { TYPE_ITEMS } from "../../constants";
import MenuItem from "../MenuItem";

//TODO change content type to string
interface Props {
	headerType: string;
	onTypeClick: (type: string) => void;
}

export default function TypeSubmenu({ headerType, onTypeClick }: Props) {
	return (
		<>
			{TYPE_ITEMS.map((item) => (
				<MenuItem
					key={item.name}
					icon={null}
					content={item.content}
					onClick={() => onTypeClick(item.type)}
					selected={item.type === headerType}
				/>
			))}
		</>
	);
}
