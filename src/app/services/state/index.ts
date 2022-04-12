import React from "react";
import { v4 as uuidv4 } from "uuid";

import { CELL_TYPE, ARROW } from "../../constants";

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
	tagData: { [id: string]: string };
}

export const DEFAULT_SETTINGS: NltSettings = {
	tagData: {},
};
export interface Header {
	id: string;
	position: number;
	content: string;
	arrow: string;
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
	position: number;
	content: string;
	type: string;
	expectedType: string | null;
}

export interface Tag {
	id: string;
	content: string;
	headerId: string;
	color: string;
	selected: string[];
}

export const initialHeader = (content: string, position: number): Header => {
	console.log("CREATING INITIAL HEADER!");
	return {
		id: uuidv4(),
		position,
		content,
		arrow: ARROW.NONE,
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
	position: number,
	type: string,
	content: string,
	expectedType: string | null = null
): Cell => {
	return {
		id,
		rowId,
		position,
		type,
		content,
		expectedType,
	};
};

export const initialTag = (
	content: string,
	cellId: string,
	headerId: string,
	color: string
): Tag => {
	return {
		id: uuidv4(),
		headerId,
		content,
		color,
		selected: [cellId],
	};
};

export const initialHeaderMenuState = {
	left: 0,
	top: 0,
	id: "",
	position: 0,
	content: "",
	type: CELL_TYPE.TEXT,
};
