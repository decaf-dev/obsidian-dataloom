import "./styles.css";

export const useOverflow = (
	shouldWrap: boolean,
	options?: { ellipsis?: boolean }
) => {
	const { ellipsis = false } = options ?? {};
	if (shouldWrap) return "dataloom-overflow--wrap";
	if (ellipsis) return "dataloom-overflow--ellipsis";
	return "dataloom-overflow--hide";
};
