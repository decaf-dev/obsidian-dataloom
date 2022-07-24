import { CONTENT_TYPE } from "../../../constants";
import { SortDir } from "../../sort/types";

export interface Header {
	id: string;
	content: string;
	sortDir: SortDir;
	sortName?: string; //Deprecated in 4.1.2
	width: string;
	type: string;
	useAutoWidth: boolean;
	shouldWrapOverflow: boolean;
}

export const initialHeader = (id: string, content: string): Header => {
	return {
		id,
		content,
		sortDir: SortDir.DEFAULT,
		width: "100px",
		shouldWrapOverflow: true,
		useAutoWidth: false,
		type: CONTENT_TYPE.TEXT,
	};
};
