import { COLOR } from "src/constants";

export const randomColor = (): string => {
	const index = Math.floor(Math.random() * Object.keys(COLOR).length);
	return Object.values(COLOR)[index];
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
