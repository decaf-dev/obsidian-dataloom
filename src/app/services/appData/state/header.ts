import { CONTENT_TYPE } from "../../../constants";
import { SortDir } from "../../sort/types";

export interface Header {
	id: string;
	initialIndex: number;
	content: string;
	sortDir: SortDir;
	sortName?: string; //Deprecated in 4.1.2
	width: string;
	type: string;
	useAutoWidth: boolean;
	shouldWrapOverflow: boolean;
}

export const initialHeader = (
	id: string,
	initialIndex: number,
	content: string
): Header => {
	return {
		id,
		initialIndex,
		content,
		sortDir: SortDir.DEFAULT,
		width: "100px",
		shouldWrapOverflow: true,
		useAutoWidth: false,
		type: CONTENT_TYPE.TEXT,
	};
};
