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

export const initialHeader = (id: string, content: string): Header => {
	return {
		id,
		content,
		sortName: SORT.DEFAULT.name,
		width: "100px",
		type: CELL_TYPE.TEXT,
	};
};
