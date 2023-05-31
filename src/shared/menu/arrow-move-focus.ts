export const moveFocusLeft = (
	focusableEls: NodeListOf<Element>,
	index: number
) => {
	//Out of bounds
	if (index === 0) return focusableEls[index];

	//Default
	return focusableEls[index - 1];
};

export const moveFocusRight = (
	focusableEls: NodeListOf<Element>,
	index: number
) => {
	//Out of bounds
	if (index === focusableEls.length - 1) return focusableEls[index];

	//Default
	return focusableEls[index + 1];
};

export const moveFocusUp = (
	focusableEls: NodeListOf<Element>,
	numColumns: number,
	numBodyRows: number,
	numSortedColumns: number,
	index: number
) => {
	const searchInputIndex = numSortedColumns;
	const optionBarIndexEnd = numSortedColumns + 2;
	const newRowButtonIndex = focusableEls.length - 1;

	//Already in the option bar
	//Don't do anything
	if (index <= optionBarIndexEnd) return focusableEls[index];

	//Column row
	if (index > optionBarIndexEnd && index <= optionBarIndexEnd + numColumns) {
		return focusableEls[searchInputIndex];
	}

	//Function cell
	if (index >= newRowButtonIndex - numColumns && index < newRowButtonIndex) {
		if (numBodyRows === 0) return focusableEls[index - numColumns - 1];
		return focusableEls[index - numColumns];
	}

	//Add row button row
	if (index === newRowButtonIndex)
		return focusableEls[newRowButtonIndex - numColumns];

	//Header row
	//Go to the first element
	if (index > optionBarIndexEnd && index <= optionBarIndexEnd + numColumns)
		return focusableEls[0];

	//First body row - drag button
	if (index === optionBarIndexEnd + numColumns + 2)
		return focusableEls[index - 1 - numColumns];

	//First body row - columns
	if (
		index > optionBarIndexEnd + numColumns + 2 &&
		index <= optionBarIndexEnd + numColumns + 2 + numColumns
	)
		return focusableEls[index - 2 - numColumns];

	//Body row
	return focusableEls[index - 1 - numColumns];
};

export const moveFocusDown = (
	focusableEls: NodeListOf<Element>,
	numColumns: number,
	numBodyRows: number,
	numSortedColumns: number,
	index: number
) => {
	const firstColumnIndex = numSortedColumns + 3;
	const optionBarIndexEnd = numSortedColumns + 2;
	const newRowButtonIndex = focusableEls.length - 1;

	//At the row button
	//Don't do anything
	if (index === newRowButtonIndex) return focusableEls[index];

	//Option bar row
	if (index >= 0 && index <= optionBarIndexEnd)
		return focusableEls[firstColumnIndex];

	//Function cell
	if (index >= newRowButtonIndex - numColumns && index < newRowButtonIndex)
		return focusableEls[newRowButtonIndex];

	//Header row - columns
	if (index > optionBarIndexEnd && index <= optionBarIndexEnd + numColumns) {
		if (numBodyRows === 0) return focusableEls[index + numColumns + 1];
		return focusableEls[index + numColumns + 2];
	}

	//Last body row
	if (
		index >= newRowButtonIndex - numColumns - numColumns &&
		index < newRowButtonIndex - numColumns
	)
		return focusableEls[index + numColumns];

	//Header row - add column button
	if (index === optionBarIndexEnd + numColumns + 1)
		return focusableEls[index + numColumns + 1];

	//Body row
	return focusableEls[index + numColumns + 1];
};
