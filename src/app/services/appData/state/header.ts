import { v4 as uuidv4 } from "uuid";

import { SORT } from "src/app/components/HeaderMenu/constants";
import { CELL_TYPE } from "../../../constants";

export interface Header {
	id: string;
	content: string;
	sortName: string;
	width: string;
	type: string;
}
export interface TableHeader extends Header {
	component: React.ReactNode;
}

export const initialHeader = (content: string): Header => {
	return {
		id: uuidv4(),
		content,
		sortName: SORT.DEFAULT.name,
		width: "100px",
		type: CELL_TYPE.TEXT,
	};
};
