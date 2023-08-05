import "./styles.css";

export const useOverflow = (shouldWrapOverflow: boolean) => {
	if (shouldWrapOverflow) return "dataloom-overflow--wrap";
	return "dataloom-overflow--hide";
};
