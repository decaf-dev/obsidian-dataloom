export const uppercaseFirst = (input: string) => {
	return input.charAt(0).toUpperCase() + input.slice(1);
};

export const addPound = (input: string) => {
	return `#${input}`;
};
