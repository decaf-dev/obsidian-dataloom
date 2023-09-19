export interface Expression {
	operator: "and" | "or";
	value: boolean;
}

export const evaluateWithPrecedence = (expressions: Expression[]): boolean => {
	if (expressions.length === 0) {
		return true;
	}

	let result = expressions[0].value;

	for (let i = 1; i < expressions.length; i++) {
		const { operator, value } = expressions[i];

		//Or has higher precedance
		if (operator === "or") {
			result = result || value;
		} else {
			result = result && value;
		}
	}

	return result;
};
