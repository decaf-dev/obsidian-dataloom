import { CELL_COLOR } from "src/app/constants";

export const randomColor = (): string => {
	const index = Math.floor(Math.random() * Object.keys(CELL_COLOR).length);
	return Object.values(CELL_COLOR)[index];
};

/**
 * Gets current time with a random offset
 * Since some operations are preformed very quickly, it's possible for Date.now()
 * to return the same time. Adding a timeoffset makes sure that the time is different.
 * @returns Date.now() with a random offset
 */
export const getCurrentTimeWithOffset = (): number => {
	return Math.round(Date.now() - Math.random() * 1000);
};

/**
 * Creates a random table id
 * @returns A 6 alpha-numeric length string
 */
export const randomId = (): string => {
	return Math.random().toString(36).replace("0.", "").substring(0, 6);
};

export const randomTableId = (): string => {
	return `table-id-${randomId()}`;
};

export const randomCellId = (): string => {
	return `cell-id-${randomId()}`;
};

export const randomRowId = (): string => {
	return `row-id-${randomId()}`;
};

export const randomColumnId = (): string => {
	return `column-id-${randomId()}`;
};

export const randomTagId = (): string => {
	return `tag-id-${randomId()}`;
};
