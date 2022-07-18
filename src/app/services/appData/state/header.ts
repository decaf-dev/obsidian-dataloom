import React from "react";
import { SORT } from "src/app/components/HeaderMenu/constants";
import { CONTENT_TYPE } from "../../../constants";

export interface Header {
	id: string;
	initialIndex: number;
	content: string;
	sortName: string;
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
		sortName: SORT.DEFAULT.name,
		width: "100px",
		shouldWrapOverflow: true,
		useAutoWidth: false,
		type: CONTENT_TYPE.TEXT,
	};
};
