export const escapePipeCharacters = (value: string) =>
	value.replace(/\|/g, "\\|");

export const replaceNewLinesWithBreaks = (value: string) =>
	value.replace(/\n/g, "<br>");
