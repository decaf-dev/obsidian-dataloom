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
	numOptionBarFocusableEls: number,
	numBottomBarFocusableEls: number,
	numColumns: number,
	numBodyRows: number,
	currentIndex: number
) => {
	const optionBarIndexEnd = numOptionBarFocusableEls - 1;
	const bottomBarIndexStart = focusableEls.length - numBottomBarFocusableEls;

	//Header row
	if (currentIndex <= optionBarIndexEnd + numColumns) {
		return focusableEls[0];
	}

	//Calculation row
	if (
		currentIndex >= bottomBarIndexStart - numColumns &&
		currentIndex < bottomBarIndexStart
	) {
		if (numBodyRows === 0)
			return focusableEls[currentIndex - numColumns - 1];
		return focusableEls[currentIndex - numColumns];
	}

	//Bottom bar row
	if (
		currentIndex >= bottomBarIndexStart &&
		currentIndex < focusableEls.length
	)
		return focusableEls[bottomBarIndexStart - numColumns];

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
	numOptionBarFocusableEls: number,
	numBottomBarFocusableEls: number,
	numColumns: number,
	numBodyRows: number,
	currentIndex: number
) => {
	const optionBarIndexEnd = numOptionBarFocusableEls - 1;
	const firstColumnIndex = optionBarIndexEnd + 1;
	const bottomBarIndexStart = focusableEls.length - numBottomBarFocusableEls;

	//Bottom bar row
	if (currentIndex >= bottomBarIndexStart)
		return focusableEls[focusableEls.length - 1];

	//Option bar row
	if (currentIndex >= 0 && currentIndex <= optionBarIndexEnd)
		return focusableEls[firstColumnIndex];

	//Calculation row
	if (
		currentIndex >= bottomBarIndexStart - numColumns &&
		currentIndex < bottomBarIndexStart
	)
		return focusableEls[bottomBarIndexStart];

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
		currentIndex >= bottomBarIndexStart - numColumns - numColumns &&
		currentIndex < bottomBarIndexStart - numColumns
	)
		return focusableEls[currentIndex + numColumns];

	//Header row - add column button
	if (currentIndex === optionBarIndexEnd + numColumns + 1)
		return focusableEls[currentIndex + numColumns + 1];

	//Body row
	return focusableEls[currentIndex + numColumns + 1];
};
