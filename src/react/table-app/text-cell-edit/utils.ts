/**
 * Checks if the current index is surrounded by double brackets
 * @param str the string to check
 * @param index the index to check
 * @example
 * isSurroundedByDoubleBrackets("[[filename]]", 4) // true
 */
export const isSurroundedByDoubleBrackets = (str: string, index: number) => {
	const regex = /\[\[(.*?)\]\]/g;
	let match;

	while ((match = regex.exec(str)) !== null) {
		const [fullMatch] = match;
		const startIndex = match.index + 1;
		const endIndex = startIndex + fullMatch.length - 2;

		if (index >= startIndex && index <= endIndex) {
			// Index is surrounded by [[ ]]
			return true;
		}
	}
	return false;
};

export const replaceDoubleBracketText = (
	str: string,
	index: number,
	replacement: string
) => {
	const regex = /\[\[(.*?)\]\]/g;
	let match;

	while ((match = regex.exec(str)) !== null) {
		const [fullMatch] = match;
		const startIndex = match.index + 1;
		const endIndex = startIndex + fullMatch.length - 2;

		if (index >= startIndex && index <= endIndex) {
			str =
				str.slice(0, startIndex + 1) +
				replacement +
				str.slice(endIndex - 1);
		}
	}
	return str;
};

/**
 * Adds a closing bracket when the user types an opening bracket
 * @param inputEl the input element
 * @param previousValue the previous input value
 * @param value the new input value
 */
export const addClosingBracket = (
	inputEl: HTMLTextAreaElement,
	value: string
) => {
	const { selectionStart } = inputEl;
	const char = value[selectionStart - 1];
	if (char === "[") value = value + "]";
	return value;
};

/**
 * Removes the closing bracket when the user deletes the opening bracket
 * @param inputEl the input element
 * @param previousValue the previous input value
 * @param value the new input value
 */
export const removeClosingBracket = (
	inputEl: HTMLTextAreaElement,
	previousValue: string,
	value: string
) => {
	const { selectionStart } = inputEl;

	// If the user is deleting a bracket, delete the closing bracket
	const previousChar = previousValue[selectionStart];
	const nextChar = value[selectionStart];
	if (previousChar === "[" && nextChar === "]") {
		const updatedValue =
			value.slice(0, selectionStart) + value.slice(selectionStart + 1);
		value = updatedValue;
	}

	return value;
};

export const findUniqueStrings = (arr: string[]) => {
	const frequencyMap = new Map<string, number>();
	arr.forEach((string) => {
		frequencyMap.set(string, (frequencyMap.get(string) || 0) + 1);
	});

	console.log(frequencyMap);

	const uniqueStrings = [];
	for (const string of frequencyMap.keys()) {
		if (frequencyMap.get(string) === 1) {
			uniqueStrings.push(string);
		}
	}

	return uniqueStrings;
};
