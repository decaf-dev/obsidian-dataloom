import React, { useCallback, useState } from "react";

import { App } from "obsidian";
import { v4 as uuidv4 } from "uuid";
import { CELL_TYPE, ARROW, CELL_COLOR } from "../../constants";

export const useForceUpdate = () => {
	const [, setValue] = useState(0);
	return useCallback(() => setValue((value) => value + 1), []);
};

export const AppContext = React.createContext(undefined);

export const useApp = (): App | undefined => {
	return React.useContext(AppContext);
};

export const randomColor = () => {
	const index = Math.floor(Math.random() * Object.keys(CELL_COLOR).length);
	console.log(Object.keys(CELL_COLOR)[index]);
	return Object.values(CELL_COLOR)[index];
};

export const initialTag = (text: string, cellId: string) => {
	return {
		id: uuidv4(),
		content: text,
		color: randomColor(),
		selected: [cellId],
	};
};

export interface Tag {
	id: string;
	content: string;
	selected: string[];
	color: string;
}

export interface HeaderComposition {
	id: string;
	content: React.ReactNode;
	width: string;
	onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}
export interface Header {
	id: string;
	position: number;
	content: string;
	arrow: string;
	width: string;
	type: string;
}

export const initialHeader = (content: string, position: number): Header => {
	return {
		id: uuidv4(),
		position,
		content,
		arrow: ARROW.NONE,
		width: "15rem",
		type: CELL_TYPE.TEXT,
	};
};

interface Cell {
	id: string;
	rowId: string;
	position: number;
	text: string;
	tags: Tag[];
	type: string;
}

export const initialCell = (
	rowId: string,
	position: number,
	type: string
): Cell => {
	return {
		id: uuidv4(),
		rowId,
		position,
		text: "",
		tags: [],
		type,
	};
};

export interface Row {
	id: string;
	time?: number;
	content: React.ReactNode;
}

export const initialRow = (id: string): Row => {
	return {
		id,
		time: Date.now(),
		content: <></>,
	};
};

export const initialClickedHeader = {
	left: 0,
	top: 0,
	id: "",
	position: 0,
	content: "",
	type: CELL_TYPE.TEXT,
};
