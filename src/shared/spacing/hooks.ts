import "./styles.css";

export const useOverflow = (canTextWrap: boolean) => {
	if (canTextWrap) return "dataloom-overflow--wrap";
	return "dataloom-overflow--hide";
};
