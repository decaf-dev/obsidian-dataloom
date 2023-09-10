export const escapePipeCharacters = (value: string) =>
	value.replace(/\|/g, "\\|");
