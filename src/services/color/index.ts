import { COLOR } from "../../constants";

export const findColorClassName = (
	isDarkMode: boolean,
	color: string
): string => {
	switch (color) {
		case COLOR.LIGHT_GRAY:
			return isDarkMode
				? "NLT__light-gray--dark"
				: "NLT__light-gray--light";
		case COLOR.GRAY:
			return isDarkMode ? "NLT__gray--dark" : "NLT__gray--light";
		case COLOR.BROWN:
			return isDarkMode ? "NLT__brown--dark" : "NLT__brown--light";
		case COLOR.ORANGE:
			return isDarkMode ? "NLT__orange--dark" : "NLT__orange--light";
		case COLOR.YELLOW:
			return isDarkMode ? "NLT__yellow--dark" : "NLT__yellow--light";
		case COLOR.GREEN:
			return isDarkMode ? "NLT__green--dark" : "NLT__green--light";
		case COLOR.BLUE:
			return isDarkMode ? "NLT__blue--dark" : "NLT__blue--light";
		case COLOR.PURPLE:
			return isDarkMode ? "NLT__purple--dark" : "NLT__purple--light";
		case COLOR.PINK:
			return isDarkMode ? "NLT__pink--dark" : "NLT__pink--light";
		case COLOR.RED:
			return isDarkMode ? "NLT__red--dark" : "NLT__red--light";
		default:
			return "";
	}
};
