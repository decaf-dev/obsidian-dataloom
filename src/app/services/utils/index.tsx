import React, { useCallback, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { CELL_TYPE, ARROW } from "../../constants";

export const useForceUpdate = () => {
	const [, setValue] = useState(0);
	return useCallback(() => setValue((value) => value + 1), []);
};

export const AppContext = React.createContext(undefined);

export const useApp = (): App | undefined => {
	return React.useContext(AppContext);
};

export const initialHeader = (content: string, position: number) => {
	return {
		id: uuidv4(),
		position,
		content,
		arrow: ARROW.NONE,
		width: "15rem",
		type: CELL_TYPE.TEXT,
	};
};

export const initialCell = (
	rowId: number,
	position: number,
	type = CELL_TYPE.TEXT
) => {
	return {
		id: uuidv4(),
		rowId,
		position,
		text: "",
		tags: [],
		type,
	};
};

export const initialRow = (id: number) => {
	return {
		id,
		time: Date.now(),
	};
};

export const initialTag = (text: string, cellId: string) => {
	return { id: uuidv4(), content: text, selected: [cellId] };
};

export const initialClickedHeader = {
	left: 0,
	top: 0,
	id: 0,
	position: 0,
	content: "",
	type: CELL_TYPE.TEXT,
};
