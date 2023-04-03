export const useOverflowClassname = (
	useAutoWidth: boolean,
	shouldWrapOverflow: boolean
) => {
	if (useAutoWidth) {
		return "NLT__auto-width";
	} else {
		if (shouldWrapOverflow) {
			return "NLT__wrap-overflow";
		} else {
			return "NLT__hide-overflow";
		}
	}
};
