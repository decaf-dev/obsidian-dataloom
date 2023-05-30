import { Color } from "src/shared/types/types";

const RED_GRAPHITE_THEME = "Red Graphite";

export const findColorClassName = (
	isDarkMode: boolean,
	color: Color
): string => {
	switch (color) {
		case Color.LIGHT_GRAY:
			return isDarkMode
				? "NLT__light-gray--dark"
				: "NLT__light-gray--light";
		case Color.GRAY:
			return isDarkMode ? "NLT__gray--dark" : "NLT__gray--light";
		case Color.BROWN:
			return isDarkMode ? "NLT__brown--dark" : "NLT__brown--light";
		case Color.ORANGE:
			return isDarkMode ? "NLT__orange--dark" : "NLT__orange--light";
		case Color.YELLOW:
			return isDarkMode ? "NLT__yellow--dark" : "NLT__yellow--light";
		case Color.GREEN:
			return isDarkMode ? "NLT__green--dark" : "NLT__green--light";
		case Color.BLUE:
			return isDarkMode ? "NLT__blue--dark" : "NLT__blue--light";
		case Color.PURPLE:
			return isDarkMode ? "NLT__purple--dark" : "NLT__purple--light";
		case Color.PINK:
			return isDarkMode ? "NLT__pink--dark" : "NLT__pink--light";
		case Color.RED:
			return isDarkMode ? "NLT__red--dark" : "NLT__red--light";
		default:
			return "";
	}
};

export const randomColor = () => {
	const index = Math.floor(Math.random() * Object.values(Color).length);
	return Object.values(Color)[index];
};

export const getTableBorderColor = (): string => {
	//@ts-expect-error
	const theme = app.vault.getConfig("cssTheme");
	if (theme === RED_GRAPHITE_THEME) {
		return "var(--table-border-color)";
	}
	return "var(--background-modifier-border)";
};

export const getTableBackgroundColor = (): string => {
	//@ts-expect-error
	const theme = app.vault.getConfig("cssTheme");
	if (theme === RED_GRAPHITE_THEME) {
		return "var(--table-header-background)";
	}
	return "var(--background-secondary)";
};
