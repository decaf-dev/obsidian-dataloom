export const moveFocusUp = (
	focusedEls: NodeListOf<Element>,
	numColumns: number,
	numBodyRows: number,
	currentIndex: number
) => {
	//Function cell
	if (
		currentIndex >= focusedEls.length - 1 - numColumns &&
		currentIndex < focusedEls.length - 1
	) {
		// console.log("Function cell");
		// console.log(numBodyRows);
		if (numBodyRows === 0) return focusedEls[currentIndex - numColumns - 1];
		return focusedEls[currentIndex - numColumns];
	}

	//Add row button row
	if (currentIndex === focusedEls.length - 1) {
		// console.log("Add row button row");
		return focusedEls[focusedEls.length - 1 - numColumns];
	}

	//Header row
	if (currentIndex > 2 && currentIndex <= 2 + numColumns) {
		// console.log("Header row");
		return focusedEls[0];
	}

	//First body row - drag button
	if (currentIndex === 2 + numColumns + 2) {
		// console.log("First body row - drag button");
		return focusedEls[currentIndex - 1 - numColumns];
	}

	//First body row - columns
	if (
		currentIndex > 2 + numColumns + 2 &&
		currentIndex <= 2 + numColumns + 2 + numColumns
	) {
		// console.log("First body row - columns");
		return focusedEls[currentIndex - 2 - numColumns];
	}

	//Regular body row
	const index = currentIndex - 1 - numColumns;
	// console.log("Regular row");
	if (index < 0) return focusedEls[currentIndex];
	return focusedEls[index];
};

export const moveFocusDown = (
	focusedEls: NodeListOf<Element>,
	numColumns: number,
	numBodyRows: number,
	currentIndex: number
) => {
	//Option bar
	if (currentIndex <= 2) {
		// console.log("Option bar");
		return focusedEls[3];
	}

	//Function cell
	if (
		currentIndex >= focusedEls.length - 1 - numColumns &&
		currentIndex < focusedEls.length - 1
	) {
		// console.log("Function cell");
		return focusedEls[focusedEls.length - 1];
	}

	//Header row - columns
	if (currentIndex > 2 && currentIndex <= 2 + numColumns) {
		// console.log("Header row - columns");
		if (numBodyRows === 0) return focusedEls[currentIndex + numColumns + 1];
		return focusedEls[currentIndex + numColumns + 2];
	}

	//Last body row
	if (
		currentIndex >= focusedEls.length - 1 - numColumns - numColumns &&
		currentIndex < focusedEls.length - 1 - numColumns
	) {
		// console.log("Last body row");
		return focusedEls[currentIndex + numColumns];
	}

	//Header row - add column button
	if (currentIndex === 2 + numColumns + 1) {
		// console.log("Header rows - button");
		return focusedEls[currentIndex + numColumns + 1];
	}

	//Regular row
	const index = currentIndex + numColumns + 1;
	// console.log("Regular row");
	if (index >= focusedEls.length) return focusedEls[currentIndex];
	return focusedEls[index];
};
