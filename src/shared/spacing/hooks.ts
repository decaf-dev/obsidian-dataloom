export const useOverflowClassName = (shouldWrapOverflow: boolean) => {
	if (shouldWrapOverflow) {
		return "NLT__wrap-overflow";
	} else {
		return "NLT__hide-overflow";
	}
};
