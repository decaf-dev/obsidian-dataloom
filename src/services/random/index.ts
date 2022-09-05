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

export const randomBlockId = () => {
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345679";
	let result = "^";
	for (let i = 0; i < 6; i++) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
};

/**
 * Creates a 1 column NLT markdown table
 * @returns An NLT markdown table
 */
export const createEmptyMarkdownTable = (): string => {
	const rows = [];
	rows[0] = "| New Column |";
	rows[1] = "| ---------- |";
	rows[2] = randomBlockId();
	return rows.join("\n");
};
