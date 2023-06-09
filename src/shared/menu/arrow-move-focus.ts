export const moveMenuFocusUp = (
	focusableEls: NodeListOf<Element>,
	currentIndex: number
) => {
	let index = currentIndex - 1;
	if (index < 0) index = focusableEls.length - 1;

	return focusableEls[index];
};

export const moveMenuFocusDown = (
	focusableEls: NodeListOf<Element>,
	currentIndex: number
) => {
	let index = currentIndex + 1;
	if (index > focusableEls.length - 1) index = 0;

	return focusableEls[index];
};

export const moveFocusLeft = (
	focusableEls: NodeListOf<Element>,
	currentIndex: number
) => {
	let index = currentIndex - 1;
	if (index < 0) index = focusableEls.length - 1;

	return focusableEls[index];
};

export const moveFocusRight = (
	focusableEls: NodeListOf<Element>,
	currentIndex: number
) => {
	let index = currentIndex + 1;
	if (index > focusableEls.length - 1) index = 0;

	return focusableEls[index];
};

export const moveFocusUp = (
	focusableEls: NodeListOf<Element>,
	numColumns: number,
	numBodyRows: number,
	numSortedColumns: number,
	currentIndex: number
) => {
	const searchInputIndex = numSortedColumns;
	const optionBarIndexEnd = numSortedColumns + 2;
	const newRowButtonIndex = focusableEls.length - 1;

	//Already in the option bar
	//Don't do anything
	if (currentIndex <= optionBarIndexEnd) return focusableEls[currentIndex];

	//Column row
	if (
		currentIndex > optionBarIndexEnd &&
		currentIndex <= optionBarIndexEnd + numColumns
	) {
		return focusableEls[searchInputIndex];
	}

	//Function cell
	if (
		currentIndex >= newRowButtonIndex - numColumns &&
		currentIndex < newRowButtonIndex
	) {
		if (numBodyRows === 0)
			return focusableEls[currentIndex - numColumns - 1];
		return focusableEls[currentIndex - numColumns];
	}

	//Add row button row
	if (currentIndex === newRowButtonIndex)
		return focusableEls[newRowButtonIndex - numColumns];

	//Header row
	//Go to the first element
	if (
		currentIndex > optionBarIndexEnd &&
		currentIndex <= optionBarIndexEnd + numColumns
	)
		return focusableEls[0];

	//First body row - drag button
	if (currentIndex === optionBarIndexEnd + numColumns + 2)
		return focusableEls[currentIndex - 1 - numColumns];

	//First body row - columns
	if (
		currentIndex > optionBarIndexEnd + numColumns + 2 &&
		currentIndex <= optionBarIndexEnd + numColumns + 2 + numColumns
	)
		return focusableEls[currentIndex - 2 - numColumns];

	//Body row
	return focusableEls[currentIndex - 1 - numColumns];
};

export const moveFocusDown = (
	focusableEls: NodeListOf<Element>,
	numColumns: number,
	numBodyRows: number,
	numSortedColumns: number,
	currentIndex: number
) => {
	const firstColumnIndex = numSortedColumns + 3;
	const optionBarIndexEnd = numSortedColumns + 2;
	const newRowButtonIndex = focusableEls.length - 1;

	//At the row button
	//Don't do anything
	if (currentIndex === newRowButtonIndex) return focusableEls[currentIndex];

	//Option bar row
	if (currentIndex >= 0 && currentIndex <= optionBarIndexEnd)
		return focusableEls[firstColumnIndex];

	//Function cell
	if (
		currentIndex >= newRowButtonIndex - numColumns &&
		currentIndex < newRowButtonIndex
	)
		return focusableEls[newRowButtonIndex];

	//Header row - columns
	if (
		currentIndex > optionBarIndexEnd &&
		currentIndex <= optionBarIndexEnd + numColumns
	) {
		if (numBodyRows === 0)
			return focusableEls[currentIndex + numColumns + 1];
		return focusableEls[currentIndex + numColumns + 2];
	}

	//Last body row
	if (
		currentIndex >= newRowButtonIndex - numColumns - numColumns &&
		currentIndex < newRowButtonIndex - numColumns
	)
		return focusableEls[currentIndex + numColumns];

	//Header row - add column button
	if (currentIndex === optionBarIndexEnd + numColumns + 1)
		return focusableEls[currentIndex + numColumns + 1];

	//Body row
	return focusableEls[currentIndex + numColumns + 1];
};
