import { useCallback, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { CELL_TYPE, ARROW } from "../../constants";

export const useForceUpdate = () => {
	const [, setValue] = useState(0);
	return useCallback(() => setValue((value) => value + 1), []);
};

export const initialHeader = (content, position) => {
	return {
		id: uuidv4(),
		position,
		content,
		arrow: ARROW.NONE,
		width: "15rem",
		type: CELL_TYPE.TEXT,
	};
};

export const initialCell = (rowId, position, type = CELL_TYPE.TEXT) => {
	return {
		id: uuidv4(),
		rowId,
		position,
		text: "",
		tags: [],
		type,
	};
};

export const initialRow = (id) => {
	return {
		id,
		time: Date.now(),
	};
};

export const initialTag = (text, cellId) => {
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
