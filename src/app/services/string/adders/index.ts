/**
 * Add a pounds sign to input string
 * @param input The input string
 * @returns A string starting with a pound (#) symbol
 */
export const addPound = (input: string) => {
	return `#${input}`;
};

export const uppercaseFirst = (input: string) => {
	return input.charAt(0).toUpperCase() + input.slice(1);
};
