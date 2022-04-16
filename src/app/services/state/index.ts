import React from "react";
import { SORT } from "src/app/components/HeaderMenu/constants";
import { v4 as uuidv4 } from "uuid";

import { CELL_TYPE } from "../../constants";

export interface AppData {
	updateTime: number;
	headers: Header[];
	rows: Row[];
	cells: Cell[];
	tags: Tag[];
}
export interface ErrorData {
	columnIds: number[];
}

export const instanceOfErrorData = (object: any): object is ErrorData => {
	return "columnIds" in object;
};
export interface NltSettings {
	appData: { [filePath: string]: { [hash: number]: AppData } };
}

export const DEFAULT_SETTINGS: NltSettings = {
	appData: {},
};
export interface Header {
	id: string;
	index: number;
	content: string;
	sortName: string;
	width: string;
	type: string;
}
export interface TableHeader extends Header {
	component: React.ReactNode;
}

export interface Row {
	id: string;
	creationTime?: number;
}

export interface TableRow extends Row {
	component: React.ReactNode;
}
export interface Cell {
	id: string;
	rowId: string;
	headerIndex: number;
	content: string;
	type: string;
	expectedType: string | null;
}

export interface Tag {
	id: string;
	headerIndex: number;
	rowIndex: number;
	content: string;
	color: string;
	selected: string[];
}

export const initialHeader = (content: string, index: number): Header => {
	return {
		id: uuidv4(),
		index,
		content,
		sortName: SORT.DEFAULT.name,
		width: "15rem",
		type: CELL_TYPE.TEXT,
	};
};

export const initialRow = (id: string): Row => {
	return {
		id,
		creationTime: Date.now(),
	};
};

export const initialCell = (
	id: string,
	rowId: string,
	headerIndex: number,
	type: string,
	content: string,
	expectedType: string | null = null
): Cell => {
	return {
		id,
		rowId,
		headerIndex,
		type,
		content,
		expectedType,
	};
};

export const initialTag = (
	headerIndex: number,
	rowIndex: number,
	cellId: string,
	content: string,
	color: string
): Tag => {
	return {
		id: uuidv4(),
		headerIndex,
		rowIndex,
		content,
		color,
		selected: [cellId],
	};
};

export const initialHeaderMenuState = {
	left: 0,
	top: 0,
	id: "",
	index: 0,
	content: "",
	type: CELL_TYPE.TEXT,
};
