import { COLOR } from "../../constants";

export const hasDarkTheme = () => {
	const el = document.querySelector("body");
	return el.className.includes("theme-dark");
};

export const findColorClass = (color: string): string => {
	const inDarkMode = hasDarkTheme();
	switch (color) {
		case COLOR.LIGHT_GRAY:
			return inDarkMode
				? "NLT__light-gray--dark"
				: "NLT__light-gray--light";
		case COLOR.GRAY:
			return inDarkMode ? "NLT__gray--dark" : "NLT__gray--light";
		case COLOR.BROWN:
			return inDarkMode ? "NLT__brown--dark" : "NLT__brown--light";
		case COLOR.ORANGE:
			return inDarkMode ? "NLT__orange--dark" : "NLT__orange--light";
		case COLOR.YELLOW:
			return inDarkMode ? "NLT__yellow--dark" : "NLT__yellow--light";
		case COLOR.GREEN:
			return inDarkMode ? "NLT__green--dark" : "NLT__green--light";
		case COLOR.BLUE:
			return inDarkMode ? "NLT__blue--dark" : "NLT__blue--light";
		case COLOR.PURPLE:
			return inDarkMode ? "NLT__purple--dark" : "NLT__purple--light";
		case COLOR.PINK:
			return inDarkMode ? "NLT__pink--dark" : "NLT__pink--light";
		case COLOR.RED:
			return inDarkMode ? "NLT__red--dark" : "NLT__red--light";
		default:
			return "";
	}
};
