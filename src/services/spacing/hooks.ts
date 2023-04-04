export const useOverflowClassName = (
	hasAutoWidth: boolean,
	shouldWrapOverflow: boolean
) => {
	if (hasAutoWidth) {
		return "NLT__auto-width";
	} else {
		if (shouldWrapOverflow) {
			return "NLT__wrap-overflow";
		} else {
			return "NLT__hide-overflow";
		}
	}
};
