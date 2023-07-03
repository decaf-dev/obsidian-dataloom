export const getAverage = (values: number[]) => {
	return getSum(values) / values.length;
};

export const getSum = (values: number[]) => {
	return values.reduce((sum, a) => sum + a, 0);
};

export const getMaximum = (values: number[]) => {
	return Math.max(...values);
};

export const getMinimum = (values: number[]) => {
	return Math.min(...values);
};

export const getMedian = (values: number[]) => {
	const sortedValues = values.sort((a, b) => a - b);
	const middle = Math.floor(values.length / 2);
	if (values.length % 2 === 0) {
		return (sortedValues[middle - 1] + sortedValues[middle]) / 2;
	} else {
		return sortedValues[middle];
	}
};

export const getRange = (values: number[]) => {
	return getMaximum(values) - getMinimum(values);
};
